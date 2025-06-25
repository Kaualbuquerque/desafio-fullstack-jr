import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Coupon } from './coupon.entity';

@Injectable()
export class CouponSeeder implements OnModuleInit {
    constructor(
        @InjectRepository(Coupon)
        private readonly repository: Repository<Coupon>,
    ) { }

    async onModuleInit() {
        const count = await this.repository.count();
        if (count === 0) {
            const now = new Date();
            const validFrom = new Date(now.getTime() - 1000 * 60 * 60 * 24); // ontem
            const validUntil = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30); // 30 dias depois

            const coupons: DeepPartial<Coupon>[] = [
                { code: 'save10', type: 'percent', value: 10, one_shot: false, valid_from: validFrom, valid_until: validUntil, uses_count: 0 },
                { code: 'save15', type: 'percent', value: 15, one_shot: false, valid_from: validFrom, valid_until: validUntil, uses_count: 0 },
                { code: 'save20', type: 'percent', value: 20, one_shot: false, valid_from: validFrom, valid_until: validUntil, uses_count: 0 },
                { code: 'save25', type: 'percent', value: 25, one_shot: false, valid_from: validFrom, valid_until: validUntil, uses_count: 0 },
                { code: 'save30', type: 'percent', value: 30, one_shot: false, valid_from: validFrom, valid_until: validUntil, uses_count: 0 },
                { code: 'save35', type: 'percent', value: 35, one_shot: false, valid_from: validFrom, valid_until: validUntil, uses_count: 0 },
            ];

            for (const c of coupons) {
                const coupon = this.repository.create(c);
                await this.repository.save(coupon);
            }

            console.log('Cupons iniciais inseridos no banco');
        }
    }
}
