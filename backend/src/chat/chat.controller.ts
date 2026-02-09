import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatConversation } from './conversation.entity';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Post('conversations')
    async createConversation(@Body() data: Partial<ChatConversation>) {
        return this.chatService.createConversation(data);
    }

    @Get('conversations/active')
    async getActiveConversations() {
        return this.chatService.getActiveConversations();
    }

    @Get('conversations/resolved')
    async getResolvedConversations() {
        return this.chatService.getResolvedConversations();
    }

    @Get('conversations/user/:email')
    async getConversationsByUser(@Param('email') email: string) {
        return this.chatService.getConversationsByUser(email);
    }

    @Get('conversations/:id')
    async getConversation(@Param('id') id: string) {
        return this.chatService.getConversation(id);
    }

    @Post('conversations/:id/resolve')
    async resolveConversation(@Param('id') id: string) {
        return this.chatService.resolveConversation(id);
    }
}
