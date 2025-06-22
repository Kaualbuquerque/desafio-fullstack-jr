import { PartialType } from '@nestjs/mapped-types';
import { CreateCouponDto } from './create-coupon.dto';
import { OmitType } from '@nestjs/mapped-types';

export class UpdateCouponDto extends OmitType(
  PartialType(CreateCouponDto),
  ['code'] as const
) {}
