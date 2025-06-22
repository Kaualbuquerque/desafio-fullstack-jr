import { ProductCouponApplication } from "src/product-coupon-application/product-coupon-application.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity("Products")
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100, unique: true })
    name: string;

    @Column({ length: 300, nullable: true })
    description: string;

    @Column('decimal', { precision: 12, scale: 2 })
    price: number;

    @Column('int', { default: 0 })
    stock: number;

    @CreateDateColumn({ type: 'datetime' })
    created_at: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updated_at: Date;


    @OneToMany(() => ProductCouponApplication, app => app.product, { cascade: true, eager: false })
    couponApplications: ProductCouponApplication[];
}