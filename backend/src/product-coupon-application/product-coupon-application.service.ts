import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductCouponApplication } from "./product-coupon-application.entity";
import { DataSource, IsNull, Repository } from "typeorm";
import { Product } from "src/products/product.entity";
import { Coupon } from "src/coupon/coupon.entity";

@Injectable()
export class ProductCouponApplicationService {
    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(ProductCouponApplication)
        private readonly appRepo: Repository<ProductCouponApplication>,
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
        @InjectRepository(Coupon)
        private readonly couponRepo: Repository<Coupon>,
    ) { }

    async applyCoupon(productId: number, code: string) {
        return this.dataSource.transaction(async manager => {
            const product = await manager.findOne(Product, { where: { id: productId } });
            if (!product) throw new NotFoundException('Produto não encontrado')

            // Verifica aplicação ativa
            const existingApp = await manager.findOne(ProductCouponApplication, {
                where: { product: { id: productId }, removed_at: IsNull() },
            });
            if (existingApp) {
                throw new ConflictException('Já existe um cupom ativo para este produto.');
            }

            // Busca e valida cupom
            const coupon = await manager.findOne(Coupon, {
                where: { code: code.toLowerCase().trim() },
            });
            if (!coupon) throw new NotFoundException('Cupom não encontrado.');

            const now = new Date();
            if (now < coupon.valid_from || now > coupon.valid_until) {
                throw new BadRequestException('Cupom fora da janela de validade.');
            }
            if (coupon.one_shot && coupon.uses_count >= 1) {
                throw new ConflictException('Cupom de uso único já foi utilizado.');
            }
            if (!coupon.one_shot && coupon.max_uses != null && coupon.uses_count >= coupon.max_uses) {
                throw new ConflictException('Cupom atingiu o número máximo de usos.');
            }

            // Calcula preço final para garantir >= 0.01
            const original = product.price;
            let finalPrice =
                coupon.type === 'percent'
                    ? original * (1 - coupon.value / 100)
                    : original - coupon.value;
            if (finalPrice < 0.01) {
                throw new BadRequestException('Preço final após desconto seria inferior a R$ 0,01.');
            }

            // Cria registro de aplicação
            const app = manager.create(ProductCouponApplication, {
                product,
                coupon,
            });
            await manager.save(app);

            // Incrementa contador de uso do cupom
            coupon.uses_count++;
            await manager.save(coupon);

            return { product, coupon, appliedAt: app.applied_at, finalPrice };
        });
    }

    async removeCoupon(productId: number) {
        return this.dataSource.transaction(async manager => {
            const app = await manager.findOne(ProductCouponApplication, {
                where: { product: { id: productId }, removed_at: IsNull() },
                relations: ['coupon', 'product'],
            });
            if (!app) throw new NotFoundException('Não há cupom ativo para este produto.');

            // Marca remoção
            app.removed_at = new Date();
            await manager.save(app);

            // Caso fosse uso único, deixar use_count como está
            return { product: app.product, removedAt: app.removed_at };
        });
    }
}