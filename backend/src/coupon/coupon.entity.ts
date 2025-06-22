import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('coupons')
export class Coupon {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 20 })
    code: string;

    @Column({ type: 'simple-enum', enum: ['percent', 'fixed'], default: 'percent' })
    type: 'percent' | 'fixed';

    @Column('decimal', { precision: 10, scale: 2 })
    value: number;

    @Column({ default: false })
    one_shot: boolean;

    @Column('integer', { nullable: true })
    max_uses?: number;

    @Column('integer', { default: 0 })
    uses_count: number;

    @Column({ type: 'datetime' })
    valid_from: Date;

    @Column({ type: 'datetime' })
    valid_until: Date;

    @CreateDateColumn({ type: 'datetime' })
    created_at: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'datetime', nullable: true })
    deleted_at?: Date;
}