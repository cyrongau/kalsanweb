import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatConversation } from './conversation.entity';
import { ChatMessage } from './message.entity';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { MailsModule } from '../mails/mails.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ChatConversation, ChatMessage]),
        MailsModule,
    ],
    controllers: [ChatController],
    providers: [ChatService, ChatGateway],
    exports: [ChatService],
})
export class ChatModule { }
