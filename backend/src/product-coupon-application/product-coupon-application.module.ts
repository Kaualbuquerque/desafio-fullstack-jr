import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCouponApplication } from './product-coupon-application.entity';
import { Product } from '../products/product.entity';
import { Coupon } from '../coupon/coupon.entity';
import { ProductCouponApplicationService } from './product-coupon-application.service';
import { ProductCouponApplicationController } from './product-coupon-application.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProductCouponApplication, Product, Coupon]),
    ],
    providers: [ProductCouponApplicationService],
    controllers: [ProductCouponApplicationController],
    exports: [ProductCouponApplicationService],  // ← exporta o service
})
export class ProductCouponApplicationModule { }
