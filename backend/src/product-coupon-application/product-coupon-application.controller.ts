import {Controller, Post, Delete, Param, Body, ParseIntPipe} from '@nestjs/common';
import { ProductCouponApplicationService } from './product-coupon-application.service';

class ApplyCouponDto {
    code: string;
}

@Controller('products/:id/coupon')
export class ProductCouponApplicationController {
    constructor(
        private readonly service: ProductCouponApplicationService,
    ) { }

    @Post()
    apply(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: ApplyCouponDto,
    ) {
        return this.service.applyCoupon(id, dto.code);
    }

    @Delete()
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.removeCoupon(id);
    }
}
