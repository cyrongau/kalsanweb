import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn, ManyToOne, Index } from 'typeorm';
import { Quote } from '../quotes/quote.entity';
import { User } from '../users/user.entity';

export enum OrderStatus {
    PENDING = 'pending',
    PAID = 'paid',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
}

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => Quote)
    @JoinColumn()
    quote: Quote;

    @ManyToOne(() => User)
    user: User;

    @Column()
    payment_intent_id: string;

    @Column({ nullable: true })
    payment_method: string;

    @Column({ type: 'jsonb', nullable: true })
    shipping_address: any;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total_paid: number;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    })
    status: OrderStatus;

    @Column({ nullable: true })
    tracking_number: string;

    @Column({ nullable: true })
    invoice_url: string;

    @Index()
    @CreateDateColumn()
    created_at: Date;

    @Index()
    @Column({ default: false })
    is_read: boolean;
}
