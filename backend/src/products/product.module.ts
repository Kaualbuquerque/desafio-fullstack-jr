import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductCouponApplication } from 'src/product-coupon-application/product-coupon-application.entity';
import { ProductCouponApplicationModule } from '../product-coupon-application/product-coupon-application.module';
import { Coupon } from 'src/coupon/coupon.entity';
import { CouponModule } from 'src/coupon/coupon.module'; // ✅ Importa o módulo

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductCouponApplication, Coupon]), // ✅ inclua Coupon se necessário aqui
    forwardRef(() => ProductCouponApplicationModule),
    CouponModule, // ✅ necessário para resolver o repositório
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule { }
