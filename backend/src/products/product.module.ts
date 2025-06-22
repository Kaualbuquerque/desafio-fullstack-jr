import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductCouponApplicationModule } from '../product-coupon-application/product-coupon-application.module';
import { ProductCouponApplication } from 'src/product-coupon-application/product-coupon-application.entity';

@Module({
  imports: [
    // agora registramos *ambas* as entidades no mesmo módulo
    TypeOrmModule.forFeature([Product, ProductCouponApplication]),

    // se estiver usando o serviço da aplicação de cupom:
    forwardRef(() => ProductCouponApplicationModule),
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule { }
