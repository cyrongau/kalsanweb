import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { QuoteItem } from './quote-item.entity';

export enum QuoteStatus {
    PENDING = 'pending',
    REVIEWING = 'reviewing',
    PRICE_READY = 'price_ready',
    EXPIRED = 'expired',
    CONVERTED = 'converted',
}

@Entity('quotes')
export class Quote {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { nullable: true })
    user: User;

    @Column({ type: 'varchar', nullable: true })
    guest_name: string | null;

    @Column({ type: 'varchar', nullable: true })
    guest_email: string | null;

    @Column({ type: 'varchar', nullable: true })
    guest_phone: string | null;

    @Column({ type: 'text', nullable: true })
    guest_notes: string | null;

    @Column({
        type: 'enum',
        enum: QuoteStatus,
        default: QuoteStatus.PENDING,
    })
    status: QuoteStatus;

    @Column({ type: 'timestamp', nullable: true })
    expires_at: Date;

    @Column({ nullable: true })
    admin_notes: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    total_amount: number;

    @OneToMany(() => QuoteItem, (item) => item.quote, { cascade: true })
    items: QuoteItem[];

    @CreateDateColumn()
    created_at: Date;

    @Column({ default: false })
    is_read: boolean;
}
