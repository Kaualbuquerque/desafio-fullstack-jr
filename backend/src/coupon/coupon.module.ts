import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from './coupon.entity';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { CouponSeeder } from './CouponSeeder';

@Module({
  imports: [
    TypeOrmModule.forFeature([Coupon]),
  ],
  providers: [CouponService, CouponSeeder],
  controllers: [CouponController],
  exports: [CouponService],
})
export class CouponModule {}
