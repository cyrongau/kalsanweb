import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum UserRole {
    CUSTOMER = 'customer',
    INVENTORY_STAFF = 'inventory_staff',
    SALES_MANAGER = 'sales_manager',
    ADMIN = 'admin',
    SUPER_ADMIN = 'super_admin',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password_hash: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CUSTOMER,
    })
    role: UserRole;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    avatar_url: string;

    @Column({ nullable: true })
    nationality: string;

    @Column({ type: 'jsonb', nullable: true })
    addresses: any[];

    @Column({ type: 'jsonb', nullable: true })
    favorites: string[]; // Array of product IDs

    @Column({ type: 'jsonb', nullable: true })
    garage_details: any[];

    @Column({ default: false })
    twoFactorEnabled: boolean;

    @Column({
        type: 'enum',
        enum: ['email', 'sms', 'whatsapp'],
        default: 'email'
    })
    twoFactorMethod: 'email' | 'sms' | 'whatsapp';

    @Column({ nullable: true })
    team: string; // 'Support' | 'Technical' | 'Sales & Marketing'

    @CreateDateColumn()
    created_at: Date;
}
