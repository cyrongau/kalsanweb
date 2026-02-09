import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { ChatMessage } from './message.entity';
import { User } from '../users/user.entity';

@Entity('chat_conversations')
export class ChatConversation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    userName: string;

    @Column({ nullable: true })
    userEmail: string;

    @Column({ nullable: true })
    team: string; // 'Support' | 'Technical' | 'Sales & Marketing'

    @Column({ default: 'active' })
    status: string; // 'active' | 'resolved' | 'closed'

    @ManyToOne(() => User, { nullable: true })
    agent: User;

    @Column({ nullable: true })
    agentId: string;

    @OneToMany(() => ChatMessage, (message) => message.conversation)
    messages: ChatMessage[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
