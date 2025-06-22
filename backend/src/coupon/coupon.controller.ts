import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dtos/create-coupon.dto';
import { UpdateCouponDto } from './dtos/update-coupon.dto';

@Controller('coupons')
export class CouponController {
    constructor(private readonly service: CouponService) { }


    // Cria um novo coupon
    @Post()
    create(@Body() dto: CreateCouponDto) {
        return this.service.create(dto);
    }

    // Listagem dos coupons ativos
    @Get()
    findAll() {
        return this.service.findAll();
    }

    // Buscar coupon por código
    @Get(':code')
    findByCode(@Param('code') code: string) {
        return this.service.findByCode(code);
    }

    // Atualizar coupon (exceto código)
    @Patch(':code')
    update(@Param('code') code: string, @Body() dto: UpdateCouponDto) {
        return this.service.update(code, dto);
    }

    // Inativa um coupon
    @Delete(':code')
    delete(@Param('code') code: string){
        return this.service.softDelete(code);
    }
}
