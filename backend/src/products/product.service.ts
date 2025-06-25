import { BadRequestException, ConflictException, Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./product.entity";
import { IsNull, Repository } from "typeorm";
import { CreateProductDto } from "./dtos/create-product.dto";
import { ListProductDto } from "./dtos/list-product.dto";
import { UpdateProductDto } from "./dtos/update-product.dto";
import { AppliedCouponInfo, applyDiscountUtil, DiscountType } from "src/utils/discount";
import { ProductCouponApplicationService } from "src/product-coupon-application/product-coupon-application.service";
import { ProductCouponApplication } from "src/product-coupon-application/product-coupon-application.entity";
import { Coupon } from "src/coupon/coupon.entity";

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly repository: Repository<Product>,
        @InjectRepository(ProductCouponApplication)
        private readonly appRepository: Repository<ProductCouponApplication>,
        @InjectRepository(Coupon)
        private readonly couponRepository: Repository<Coupon>,
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

        // 1) Incluir ou não os soft-deletados
        if (filters.includeDeleted) {
            qb.withDeleted();
        } else {
            qb.andWhere('p.deleted_at IS NULL');
        }

        // 2) Filtro por busca textual
        if (filters.search) {
            qb.andWhere(
                '(p.name ILIKE :search OR p.description ILIKE :search)',
                { search: `%${filters.search}%` }
            );
        }

        // 3) Filtros por faixa de preço
        if (filters.minPrice != null) {
            qb.andWhere('p.price >= :minPrice', { minPrice: filters.minPrice });
        }

        if (filters.maxPrice != null) {
            qb.andWhere('p.price <= :maxPrice', { maxPrice: filters.maxPrice });
        }

        // 4) Filtro por estoque zerado
        if (filters.onlyOutOfStock) {
            qb.andWhere('p.stock = 0');
        }

        // 5) Filtro por cupom aplicado
        if (filters.hasDiscount || filters.withCouponApplied) {
            qb.innerJoin(
                'p.couponApplications',
                'activeApp',
                'activeApp.removed_at IS NULL'
            );
        }

        // 6) Ordenação
        if (filters.sortBy) {
            const validSortFields = ['id', 'name', 'price', 'stock', 'created_at', 'updated_at'];
            if (validSortFields.includes(filters.sortBy)) {
                qb.orderBy(`p.${filters.sortBy}`, (filters.sortOrder || 'ASC').toUpperCase() as 'ASC' | 'DESC');
            }
        }

        // 7) Paginação
        const page = filters.page ?? 1;
        const limit = filters.limit ?? 10;

        const [products, total] = await qb
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        // 8) Enriquecer com finalPrice e cupom ativo
        const data = await Promise.all(
            products.map(async (p) => {
                const app = await this.ProductCouponApplicationService.findActiveApplication(p.id);

                let finalPrice = p.price;
                let coupon: AppliedCouponInfo | undefined;

                if (app) {
                    finalPrice = applyDiscountUtil(p.price, {
                        type: app.coupon.type,
                        value: app.coupon.value,
                    });

                    coupon = {
                        code: app.coupon.code,
                        type: app.coupon.type,
                        value: app.coupon.value,
                        applied_at: app.applied_at,
                    };
                }

                return {
                    product: p,
                    finalPrice,
                    coupon,
                };
            })
        );

        // 9) Retorno final
        return {
            data,
            meta: {
                page,
                limit,
                totalItems: total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }



    // Retorna produto + preço final + cupom ativo
    async findOneWithDiscount(productId: number): Promise<{
        product: Product;
        finalPrice: number;
        coupon?: {
            code: string;
            type: DiscountType;
            value: number;
            applied_at: Date;
        };
    }> {
        const product = await this.repository.findOne({ where: { id: productId } });
        if (!product) throw new NotFoundException('Produto não encontrado.');

        const app = await this.appRepository.findOne({
            where: {
                product: { id: productId },
                removed_at: IsNull(),
            },
            relations: ['coupon'],
        });

        if (app && app.coupon) {
            const finalPrice = applyDiscountUtil(product.price, {
                type: app.coupon.type,
                value: app.coupon.value,
            });

            return {
                product,
                finalPrice,
                coupon: {
                    code: app.coupon.code,
                    type: app.coupon.type,
                    value: app.coupon.value,
                    applied_at: app.applied_at,
                },
            };
        }

        // Caso não tenha cupom, finalPrice = price original
        return {
            product,
            finalPrice: product.price,
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
        Promise<{ product: Product; finalPrice: number; coupon?: { code: string; type: DiscountType; value: number; applied_at: Date }; }> {
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

    async applyCoupon(id: number, code: string) {
        const product = await this.repository.findOne({ where: { id }, relations: ['couponApplications'] });
        if (!product) throw new NotFoundException('Produto não encontrado.');

        const coupon = await this.couponRepository.findOne({ where: { code } });
        if (!coupon) throw new NotFoundException('Cupom não encontrado.');

        const alreadyApplied = await this.appRepository.findOne({
            where: { product: { id }, coupon: { id: coupon.id } }
        });

        if (alreadyApplied) {
            throw new ConflictException('Cupom já aplicado a este produto.');
        }

        const finalPrice = applyDiscountUtil(product.price, { type: coupon.type, value: coupon.value });

        await this.appRepository.save({
            product,
            coupon,
            applied_at: new Date(),
        });

        return {
            product,
            finalPrice,
            coupon: {
                code: coupon.code,
                type: coupon.type,
                value: coupon.value,
                applied_at: new Date(),
            }
        };
    }

    // Remove qualquer disconto ativo
    async removeDiscount(id: number): Promise<{ product: Product; removedAt?: Date; }> {

        const removed = await this.ProductCouponApplicationService.removeCoupon(id);

        const product = await this.repository.findOne({ where: { id } });
        return { product: product!, removedAt: removed.removedAt };
    }
}