import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Brand } from '../brands/brand.entity';
import { Category } from '../categories/category.entity';
import { Condition } from '../conditions/condition.entity';
import { Review } from './review.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    sku: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    short_description: string;

    @ManyToOne(() => Brand, (brand) => brand.products)
    @JoinColumn({ name: 'brand_id' })
    brand: Brand;

    @Column()
    brand_id: string;

    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column()
    category_id: string;

    @ManyToOne(() => Condition, (condition) => condition.products)
    @JoinColumn({ name: 'condition_id' })
    condition: Condition;

    @Column({ nullable: true })
    condition_id: string;

    @Column('text', { array: true, default: '{}' })
    image_urls: string[];

    @Column('decimal', { precision: 12, scale: 2, default: 0 })
    price: number;

    @Column({ default: 0 })
    quantity: number;

    @Column({ default: 'in_stock' })
    stock_status: string;

    @Column('text', { array: true, default: '{}' })
    compatibility: string[];

    @Column({ default: false })
    universal_fit: boolean;

    @Column('jsonb', { nullable: true, default: '{}' })
    specifications: Record<string, string>;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => Review, (review) => review.product)
    reviews: Review[];


    @UpdateDateColumn()
    updated_at: Date;
}
