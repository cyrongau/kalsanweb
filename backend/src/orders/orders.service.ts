import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { Quote } from '../quotes/quote.entity';
import { User } from '../users/user.entity';
import { MailsService } from '../mails/mails.service';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
        private mailsService: MailsService,
    ) { }

    async create(user: User, quote: Quote, paymentIntentId: string): Promise<Order> {
        const order = new Order();
        order.user = user;
        order.quote = quote;
        order.payment_intent_id = paymentIntentId;
        order.total_paid = quote.total_amount;
        order.status = OrderStatus.PAID;

        return this.ordersRepository.save(order);
    }

    async findOne(id: string): Promise<Order> {
        const order = await this.ordersRepository.findOne({
            where: { id },
            relations: ['quote', 'quote.items', 'quote.items.product', 'user'],
        });
        if (!order) throw new NotFoundException('Order not found');
        return order;
    }

    async updateStatus(id: string, status: OrderStatus, trackingNumber?: string): Promise<Order> {
        const order = await this.findOne(id);
        order.status = status;
        if (trackingNumber) order.tracking_number = trackingNumber;

        const updatedOrder = await this.ordersRepository.save(order);

        if (status === OrderStatus.SHIPPED) {
            await this.mailsService.sendOrderShipped(
                order.user.email,
                order.id,
                trackingNumber || 'N/A'
            );
        }

        return updatedOrder;
    }

    async getUnreadCount(): Promise<number> {
        return this.ordersRepository.count({
            where: { is_read: false }
        });
    }

    async markAsRead(id: string): Promise<void> {
        await this.ordersRepository.update(id, { is_read: true });
    }

    async findAll(): Promise<Order[]> {
        return this.ordersRepository.find({
            relations: ['quote', 'user'],
            order: { created_at: 'DESC' }
        });
    }
}
