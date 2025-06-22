import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './products/product.module';
import { CouponModule } from './coupon/coupon.module';
import { ProductCouponApplicationModule } from './product-coupon-application/product-coupon-application.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3', 
      database: ':memory:',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ProductModule,
    CouponModule,
    ProductCouponApplicationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
