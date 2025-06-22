import { BadRequestException, ConflictException, Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./product.entity";
import { Repository } from "typeorm";
import { CreateProductDto } from "./dtos/create-product.dto";
import { ListProductDto } from "./dtos/list-product.dto";
import { UpdateProductDto } from "./dtos/update-product.dto";
import { applyDiscountUtil, DiscountType } from "src/utils/discount";
import { ProductCouponApplicationService } from "src/product-coupon-application/product-coupon-application.service";

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private repository: Repository<Product>,
        private readonly ProductCouponApplicationService: ProductCouponApplicationService,
    ) { }

    // Criar Produto
    async create(dto: CreateProductDto): Promise<Product> {
        // nome único após normalização
        dto.name = dto.name.trim().replace(/\s+/g, ' ');

        const product = this.repository.create(dto);
        return this.repository.save(product);
    }

    // Listar Produto
    async list(filters: ListProductDto) {
        const qb = this.repository.createQueryBuilder('p');

        if (filters.search) {
            qb.andWhere('(p.name ILIKE :search OR p.description ILIKE :search)', {
                search: `%${filters.search}%`
            })
        }

        if (filters.minPrice != null) qb.andWhere('p.price >= :minPrice', { minPrice: filters.minPrice });
        if (filters.maxPrice != null) qb.andWhere('p.price <= :maxPrice', { maxPrice: filters.maxPrice });
        if (filters.onlyOutOfStock) qb.andWhere('p.stock = 0');
        if (filters.hasDiscount) qb.andWhere('p.price < p.price'); // placeholder para lógica real
        // TODO: filtro withCouponApplied

        // ordenação
        if (filters.sortBy) {
            qb.orderBy(`p.${filters.sortBy}`, filters.sortOrder?.toUpperCase() as 'ASC' | 'DESC' || 'ASC');
        }

        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const [items, total] = await qb
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return {
            page,
            limit,
            totalItems: total,
            totalPages: Math.ceil(total / limit),
            items,
        };
    }

    // Buscar produto por id
    async findOne(id: number): Promise<Product> {
        const product = await this.repository.findOne({ where: { id } });
        if (!product) throw new NotFoundException();

        return product;
    }

    // Atualizar produto
    async update(id: number, dto: UpdateProductDto): Promise<Product> {
        const product = await this.repository.findOne({ where: { id } });

        if (!product) {
            throw new NotFoundException(`Produto com id ${id} não encontrado.`)
        }

        if (dto.name) {
            const normalized = dto.name.trim().replace(/\s+/g, ' ');

            // verificar se já existe outro produto com esse nome
            const exists = await this.repository.findOne({
                where: { name: normalized },
            });
            if (exists && exists.id !== id) {
                throw new BadRequestException('Já existe produto com esse nome.');
            }
            product.name = normalized;
        }

        if (dto.description !== undefined) {
            product.description = dto.description;
        }
        if (dto.stock !== undefined) {
            product.stock = dto.stock;
        }
        if (dto.price !== undefined) {
            // valida preço mínimo após conversão no Dto
            if (dto.price < 0.01) {
                throw new BadRequestException('Preço com desconto não pode ser inferior a R$ 0,01.');
            }
            product.price = dto.price;
        }

        return this.repository.save(product);
    }

    // Inativa produto
    async delete(id: number): Promise<void> {
        const product = await this.findOne(id);
        await this.repository.softRemove(product);
    }

    // Restaura produto inativo
    async restore(id: number): Promise<Product> {
        const product = await this.repository.findOne({ where: { id }, withDeleted: true });
        if (!product) throw new NotFoundException();
        return this.repository.save(product);
    }

    // Aplica desconto percentual 
    async applyDiscount(id: number, type: DiscountType, value: number): 
    Promise<{product: Product; finalPrice: number; coupon?: { code: string; type: DiscountType; value: number; appliedAt: Date };}> {
        const product = await this.repository.findOne({ where: { id } });
        if (!product) throw new NotFoundException('Produto não encontrado.');

        if (type === 'fixed' || type === 'percent') {
            let finalPrice: number;
            try {
                finalPrice = applyDiscountUtil(product.price, { type, value });
            } catch (err) {
                const msg = err instanceof Error ? err.message : 'Erro ao aplicar desconto';
                if (msg.includes('percentual') || msg.includes('fixo')) {
                    throw new BadRequestException(msg);
                }
                if (msg.includes('muito baixo')) {
                    throw new UnprocessableEntityException(msg);
                }
                throw new BadRequestException(msg);
            }

            return { product, finalPrice };
        }
        throw new BadRequestException('Tipo de desconto não suportado.');
    }

    // Remove qualquer disconto ativo
    async removeDiscount(id: number): Promise<{ product: Product; removedAt?: Date; }> {

        const removed = await this.ProductCouponApplicationService.removeCoupon(id);

        const product = await this.repository.findOne({ where: { id } });
        return { product: product!, removedAt: removed.removedAt };
    }
}