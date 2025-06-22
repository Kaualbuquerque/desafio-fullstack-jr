import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { Coupon } from "./coupon.entity";
import { CreateCouponDto } from "./dtos/create-coupon.dto";
import { normalizeCode } from "src/utils/normalize";
import { UpdateCouponDto } from "./dtos/update-coupon.dto";

@Injectable()
export class CouponService {
    constructor(
        @InjectRepository(Coupon)
        private readonly repository: Repository<Coupon>
    ) { }

    // Criar coupon
    async create(dto: CreateCouponDto): Promise<Coupon> {
        const normalizedCode = normalizeCode(dto.code);

        if (['admin', 'auth', 'null', 'undefined'].includes(normalizedCode)) {
            throw new BadRequestException('Código do cupom é reservado');
        }

        const existing = await this.repository.findOne({ where: { code: normalizedCode } });
        if (existing) throw new ConflictException('Código já existe');

        const validFrom = new Date(dto.valid_from);
        const validUntil = new Date(dto.valid_until);

        if (validUntil <= validFrom) {
            throw new BadRequestException('valid_until deve ser posterior a valid_from');
        }

        const maxValidity = new Date(validFrom);
        maxValidity.setFullYear(validFrom.getFullYear() + 5);
        if (validUntil > maxValidity) {
            throw new BadRequestException('Validade máxima de 5 anos')
        }

        const coupon = this.repository.create({
            ...dto,
            code: normalizedCode,
            uses_count: 0
        });

        return this.repository.save(coupon);
    }

    // Lista os coupons ativos
    async findAll(): Promise<Coupon[]> {
        return this.repository.find({ where: { deleted_at: IsNull() } })
    }

    // Busca coupon pelo código
    async findByCode(code: string): Promise<Coupon> {
        const normalized = normalizeCode(code);
        const coupon = await this.repository.findOne({ where: { code: normalized } });

        if (!coupon || coupon.deleted_at) {
            throw new NotFoundException('Coupon não encontrado')
        }

        return coupon;
    }

    // Atualiza o coupon, exceto o código
    async update(code: string, dto: UpdateCouponDto): Promise<Coupon> {
        const normalized = normalizeCode(code);
        const coupon = await this.repository.findOne({ where: { code: normalized } })

        if (!coupon || coupon.deleted_at) {
            throw new NotFoundException('Cupom não encontrado');
        }

        Object.assign(coupon, dto);
        return this.repository.save(coupon);
    }

    // Inativa coupon
    async softDelete(code: string): Promise<void> {
        const normalized = normalizeCode(code);
        const coupon = await this.repository.findOne({ where: { code: normalized } })

        if (!coupon || coupon.deleted_at) {
            throw new NotFoundException('Cupom não encontrado');
        }

        await this.repository.softRemove(coupon); // Marca como deletado
    }

}