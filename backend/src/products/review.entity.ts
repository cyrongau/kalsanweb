import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';
import { User } from '../users/user.entity';

@Entity('reviews')
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('int')
    rating: number;

    @Column('text')
    comment: string;

    @ManyToOne(() => Product, (product) => product.id)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column()
    product_id: string;

    @ManyToOne(() => User, (user) => user.id, { nullable: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ nullable: true })
    user_id: string;

    @Column({ nullable: true })
    guest_name: string;

    @Column({ nullable: true })
    guest_email: string;

    @Column({
        type: 'enum',
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    })
    status: string;

    @Column({ nullable: true })
    title: string;

    @CreateDateColumn()
    created_at: Date;
}
