import { Coupon } from "src/coupon/coupon.entity";
import { Product } from "src/products/product.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('product_coupon_applications')
export class ProductCouponApplication {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, { eager: true })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ManyToOne(() => Coupon, { eager: true })
    @JoinColumn({ name: 'coupon_id' })
    coupon: Coupon;

    @CreateDateColumn({ name: 'applied_at', type: 'datetime' })
    applied_at: Date;

    @Column({ name: 'remove_at', type: 'datetime', nullable: true })
    removed_at?: Date;
}