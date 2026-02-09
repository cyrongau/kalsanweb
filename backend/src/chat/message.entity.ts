import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { ChatConversation } from './conversation.entity';

@Entity('chat_messages')
export class ChatMessage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    text: string;

    @Column()
    sender: string; // 'user' | 'agent' | 'system'

    @ManyToOne(() => ChatConversation, (conversation) => conversation.messages, { onDelete: 'CASCADE' })
    conversation: ChatConversation;

    @Column()
    conversationId: string;

    @CreateDateColumn()
    createdAt: Date;
}
