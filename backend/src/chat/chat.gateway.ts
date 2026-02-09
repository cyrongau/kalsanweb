import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { MailsService } from '../mails/mails.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly chatService: ChatService,
        private readonly mailsService: MailsService,
    ) { }

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('join_conversation')
    async handleJoinConversation(
        @MessageBody() conversationId: string,
        @ConnectedSocket() client: Socket,
    ) {
        client.join(conversationId);
        console.log(`Client ${client.id} joined conversation: ${conversationId}`);
    }

    @SubscribeMessage('send_message')
    async handleMessage(
        @MessageBody() data: { conversationId: string; text: string; sender: string },
        @ConnectedSocket() client: Socket,
    ) {
        const savedMessage = await this.chatService.saveMessage({
            conversationId: data.conversationId,
            text: data.text,
            sender: data.sender,
        });

        // Broadcast message to everyone in the conversation room
        this.server.to(data.conversationId).emit('new_message', savedMessage);

        // Check if any agent is online
        const adminRoom = this.server.sockets.adapter.rooms.get('admin_room');
        const agentsOnline = adminRoom ? adminRoom.size > 0 : false;

        if (agentsOnline) {
            // Notify admins/agents in the control center
            this.server.to('admin_room').emit('incoming_chat', {
                conversationId: data.conversationId,
                message: savedMessage
            });
        } else if (data.sender === 'user') {
            // Offline fallback: Send email for the first user message if no agent is online
            const conversation = await this.chatService.getConversation(data.conversationId);
            if (conversation && conversation.messages.length <= 2) { // 1 welcome bot msg + 1 user msg
                await this.mailsService.sendOfflineChatEmail({
                    name: conversation.userName || 'Guest',
                    email: conversation.userEmail || 'No Email',
                    team: conversation.team || 'General',
                    message: data.text,
                });
            }
        }

        return savedMessage;
    }

    @SubscribeMessage('admin_join')
    handleAdminJoin(@ConnectedSocket() client: Socket) {
        client.join('admin_room');
        console.log(`Admin joined admin_room: ${client.id}`);
    }

    @SubscribeMessage('resolve_chat')
    async handleResolveChat(
        @MessageBody() conversationId: string,
        @ConnectedSocket() client: Socket,
    ) {
        await this.chatService.resolveConversation(conversationId);
        this.server.to(conversationId).emit('chat_resolved', conversationId);
    }
}
