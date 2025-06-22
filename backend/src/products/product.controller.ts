import { Controller, Post, Body, Get, Query, Patch, Param, ParseIntPipe, HttpCode, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { ListProductDto } from './dtos/list-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@Controller('products')
export class ProductController {
    constructor(private readonly service: ProductService) { }

    // Listagem com filtros e paginação
    @Get()
    list(@Query() filters: ListProductDto) {
        return this.service.list(filters);
    }

    // Retorna detalhes de um produto
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.findOne(id);
    }

    // Criação de produto
    @Post()
    create(@Body() dto: CreateProductDto) {
        return this.service.create(dto);
    }

    //Atualização do produto
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
        return this.service.update(id, dto)
    }

    // Inativa produto
    @Delete(':id')
    @HttpCode(204)
    softDelete(@Param('id', ParseIntPipe) id: number) {
        return this.service.delete(id);
    }

    // Restaura um produto inativo
    @Post(':id/restore')
    restore(@Param('id', ParseIntPipe) id: number) {
        return this.service.restore(id);
    }

    @Delete(':id/discount')
    @HttpCode(204)
    removeDiscount(@Param('id', ParseIntPipe) id: number) {
        return this.service.removeDiscount(id);
    }
}
