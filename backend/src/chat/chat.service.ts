import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatConversation } from './conversation.entity';
import { ChatMessage } from './message.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatConversation)
        private conversationRepository: Repository<ChatConversation>,
        @InjectRepository(ChatMessage)
        private messageRepository: Repository<ChatMessage>,
    ) { }

    async createConversation(data: Partial<ChatConversation>): Promise<ChatConversation> {
        const conversation = this.conversationRepository.create(data);
        return this.conversationRepository.save(conversation);
    }

    async getConversation(id: string): Promise<ChatConversation | null> {
        return this.conversationRepository.findOne({
            where: { id },
            relations: ['messages', 'agent'],
        });
    }

    async saveMessage(data: Partial<ChatMessage>): Promise<ChatMessage> {
        const message = this.messageRepository.create(data);
        const savedMessage = await this.messageRepository.save(message);

        // Update the conversation's updatedAt timestamp
        if (data.conversationId) {
            await this.conversationRepository.update(data.conversationId, {
                updatedAt: new Date(),
            });
        }

        return savedMessage;
    }

    async getActiveConversations(): Promise<ChatConversation[]> {
        return this.conversationRepository.find({
            where: { status: 'active' },
            order: { updatedAt: 'DESC' },
            relations: ['messages', 'agent'],
        });
    }

    async getResolvedConversations(): Promise<ChatConversation[]> {
        return this.conversationRepository.find({
            where: { status: 'resolved' },
            order: { updatedAt: 'DESC' },
            relations: ['messages', 'agent'],
        });
    }

    async getConversationsByUser(email: string): Promise<ChatConversation[]> {
        return this.conversationRepository.find({
            where: { userEmail: email },
            order: { updatedAt: 'DESC' },
            relations: ['messages', 'agent'],
        });
    }

    async assignAgent(conversationId: string, agentId: string): Promise<void> {
        await this.conversationRepository.update(conversationId, { agentId });
    }

    async resolveConversation(id: string): Promise<void> {
        await this.conversationRepository.update(id, { status: 'resolved' });
    }
}
