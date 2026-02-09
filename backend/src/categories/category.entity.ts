import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ unique: true })
    slug: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    icon: string;

    @Column({ nullable: true })
    parent_id: string;

    @ManyToOne(() => Category, (category) => category.children, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'parent_id' })
    parent: Category;

    @OneToMany(() => Category, (category) => category.parent)
    children: Category[];

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
