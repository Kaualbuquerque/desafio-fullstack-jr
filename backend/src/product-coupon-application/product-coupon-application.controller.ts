import { Controller, Post, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ProductCouponApplicationService } from './product-coupon-application.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

class ApplyCouponDto {
    code: string;
}

@ApiTags('products')
@Controller('products/:id/coupon')
export class ProductCouponApplicationController {
    constructor(
        private readonly service: ProductCouponApplicationService,
    ) { }

    @ApiOperation({ summary: 'Aplicar cupom a um produto' })
    @ApiParam({ name: 'id', type: Number, description: 'ID do produto' })
    @ApiBody({
        description: 'Código do cupom a ser aplicado',
        type: ApplyCouponDto,
    })
    @ApiResponse({ status: 201, description: 'Cupom aplicado com sucesso' })
    @ApiResponse({ status: 404, description: 'Produto ou cupom não encontrado' })
    @ApiResponse({ status: 409, description: 'Cupom já utilizado ou já aplicado ao produto' })
    @Post()
    apply(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: ApplyCouponDto,
    ) {
        return this.service.applyCoupon(id, dto.code);
    }

    @ApiOperation({ summary: 'Remover cupom aplicado de um produto' })
    @ApiParam({ name: 'id', type: Number, description: 'ID do produto' })
    @ApiResponse({ status: 200, description: 'Cupom removido com sucesso' })
    @ApiResponse({ status: 404, description: 'Cupom não encontrado para o produto' })
    @Delete()
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.removeCoupon(id);
    }
}
