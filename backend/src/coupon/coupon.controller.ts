import { Controller, Post, Body, Get, Param, Patch, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dtos/create-coupon.dto';
import { UpdateCouponDto } from './dtos/update-coupon.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('coupons')
@Controller('coupons')
export class CouponController {
    constructor(private readonly service: CouponService) { }

    // Cria um novo cupom com os dados fornecidos
    @ApiOperation({ summary: 'Criar um novo cupom' })
    @ApiBody({ type: CreateCouponDto })
    @ApiResponse({ status: 201, description: 'Cupom criado com sucesso.' })
    @ApiResponse({ status: 400, description: 'Dados inválidos para criação.' })
    @Post()
    create(@Body() dto: CreateCouponDto) {
        return this.service.create(dto);
    }

    // Retorna todos os cupons ativos
    @ApiOperation({ summary: 'Listar todos os cupons ativos' })
    @ApiResponse({ status: 200, description: 'Lista de cupons retornada com sucesso.' })
    @Get()
    findAll() {
        return this.service.findAll();
    }

    // Busca um cupom específico pelo seu código
    @ApiOperation({ summary: 'Buscar cupom por código' })
    @ApiParam({ name: 'code', type: String, description: 'Código do cupom' })
    @ApiResponse({ status: 200, description: 'Cupom encontrado.' })
    @ApiResponse({ status: 404, description: 'Cupom não encontrado.' })
    @Get(':code')
    findByCode(@Param('code') code: string) {
        return this.service.findByCode(code);
    }

    // Atualiza os dados de um cupom existente, exceto o código
    @ApiOperation({ summary: 'Atualizar cupom pelo código (exceto código)' })
    @ApiParam({ name: 'code', type: String, description: 'Código do cupom a ser atualizado' })
    @ApiBody({ type: UpdateCouponDto })
    @ApiResponse({ status: 200, description: 'Cupom atualizado com sucesso.' })
    @ApiResponse({ status: 404, description: 'Cupom não encontrado.' })
    @Patch(':code')
    update(@Param('code') code: string, @Body() dto: UpdateCouponDto) {
        return this.service.update(code, dto);
    }

    // Inativa (soft delete) um cupom com base no código
    @ApiOperation({ summary: 'Inativar (soft delete) um cupom pelo código' })
    @ApiParam({ name: 'code', type: String, description: 'Código do cupom a ser inativado' })
    @ApiResponse({ status: 204, description: 'Cupom inativado com sucesso.' })
    @ApiResponse({ status: 404, description: 'Cupom não encontrado.' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':code')
    delete(@Param('code') code: string) {
        return this.service.softDelete(code);
    }
}
