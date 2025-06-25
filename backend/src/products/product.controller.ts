import { Controller, Post, Body, Get, Query, Patch, Param, ParseIntPipe, HttpCode, Delete, HttpStatus } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { ListProductDto } from './dtos/list-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ApplyDiscountDto } from 'src/product-coupon-application/dtos/apply-discount.dto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductController {
    constructor(private readonly service: ProductService) { }

    @ApiOperation({ summary: 'Listar produtos com filtros e paginação' })
    @ApiQuery({ name: 'search', required: false, description: 'Busca por nome ou descrição' })
    @ApiQuery({ name: 'minPrice', required: false, type: Number })
    @ApiQuery({ name: 'maxPrice', required: false, type: Number })
    @ApiQuery({ name: 'onlyOutOfStock', required: false, type: Boolean })
    @ApiQuery({ name: 'hasDiscount', required: false, type: Boolean })
    @ApiQuery({ name: 'withCouponApplied', required: false, type: Boolean })
    @ApiQuery({ name: 'sortBy', required: false })
    @ApiQuery({ name: 'sortOrder', required: false })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'includeDeleted', required: false, type: Boolean })
    @ApiResponse({ status: 200, description: 'Lista de produtos retornada com sucesso' })
    @Get()
    list(@Query() filters: ListProductDto) {
        return this.service.list(filters);
    }

    @ApiOperation({ summary: 'Buscar um produto com preço final e cupom ativo (se houver)' })
    @ApiParam({ name: 'id', type: Number, description: 'ID do produto' })
    @ApiResponse({ status: 200, description: 'Produto encontrado com sucesso' })
    @ApiResponse({ status: 404, description: 'Produto não encontrado' })
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.findOneWithDiscount(id);
    }

    @ApiOperation({ summary: 'Criar novo produto' })
    @ApiBody({ type: CreateProductDto })
    @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
    @Post()
    create(@Body() dto: CreateProductDto) {
        return this.service.create(dto);
    }

    @ApiOperation({ summary: 'Aplicar cupom ao produto' })
    @ApiParam({ name: 'id', type: Number, description: 'ID do produto' })
    @ApiBody({ schema: { example: { code: "CUPOM10" } } })
    @ApiResponse({ status: 200, description: 'Cupom aplicado com sucesso' })
    @Post(':id/apply-coupon')
    @HttpCode(HttpStatus.OK)
    applyCoupon(
        @Param('id', ParseIntPipe) id: number,
        @Body('code') code: string,
    ) {
        return this.service.applyCoupon(id, code);
    }

    @ApiOperation({ summary: 'Aplicar desconto direto ao produto (percentual ou fixo)' })
    @ApiParam({ name: 'id', type: Number, description: 'ID do produto' })
    @ApiBody({ type: ApplyDiscountDto })
    @ApiResponse({ status: 200, description: 'Desconto aplicado com sucesso' })
    @Post(':id/discount')
    @HttpCode(HttpStatus.OK)
    applyDirectDiscount(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: ApplyDiscountDto,
    ) {
        return this.service.applyDiscount(id, dto.type, dto.value);
    }

    @ApiOperation({ summary: 'Atualizar um produto' })
    @ApiParam({ name: 'id', type: Number, description: 'ID do produto' })
    @ApiBody({ type: UpdateProductDto })
    @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso' })
    @ApiResponse({ status: 404, description: 'Produto não encontrado' })
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
        return this.service.update(id, dto);
    }

    @ApiOperation({ summary: 'Inativar (soft-delete) um produto' })
    @ApiParam({ name: 'id', type: Number, description: 'ID do produto' })
    @ApiResponse({ status: 204, description: 'Produto inativado com sucesso' })
    @Delete(':id')
    @HttpCode(204)
    softDelete(@Param('id', ParseIntPipe) id: number) {
        return this.service.delete(id);
    }

    @ApiOperation({ summary: 'Restaurar um produto inativo' })
    @ApiParam({ name: 'id', type: Number, description: 'ID do produto' })
    @ApiResponse({ status: 200, description: 'Produto restaurado com sucesso' })
    @Post(':id/restore')
    restore(@Param('id', ParseIntPipe) id: number) {
        return this.service.restore(id);
    }

    @ApiOperation({ summary: 'Remover o desconto aplicado ao produto' })
    @ApiParam({ name: 'id', type: Number, description: 'ID do produto' })
    @ApiResponse({ status: 204, description: 'Desconto removido com sucesso' })
    @ApiResponse({ status: 404, description: 'Produto ou cupom não encontrado' })
    @Delete(':id/discount')
    @HttpCode(204)
    removeDiscount(@Param('id', ParseIntPipe) id: number) {
        return this.service.removeDiscount(id);
    }
}
