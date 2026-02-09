import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity('brands')
export class Brand {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ unique: true })
    slug: string;

    @Column({ nullable: true })
    description: string;

    @Column({ type: 'text', nullable: true })
    logo_url: string;

    @Column({ type: 'text', nullable: true })
    hero_banner_url: string;

    @Column({ default: true })
    is_active: boolean;

    @OneToMany(() => Product, (product) => product.brand)
    products: Product[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
