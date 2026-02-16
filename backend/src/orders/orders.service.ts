import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { Quote } from '../quotes/quote.entity';
import { User } from '../users/user.entity';
import { MailsService } from '../mails/mails.service';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
        @InjectRepository(Quote)
        private quotesRepository: Repository<Quote>,
        private dataSource: DataSource,
        private mailsService: MailsService,
    ) { }

    async create(quoteId: string, paymentIntentId: string, paymentMethod: string = 'card', shippingAddress?: any): Promise<Order> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const quote = await this.quotesRepository.findOne({
                where: { id: quoteId },
                relations: ['items', 'items.product', 'user'],
            });

            if (!quote) {
                throw new NotFoundException('Quote not found');
            }

            const order = this.ordersRepository.create({
                quote,
                user: quote.user,
                payment_intent_id: paymentIntentId,
                payment_method: paymentMethod,
                status: OrderStatus.PAID,
                shipping_address: shippingAddress,
                total_paid: quote.total_amount, // Added this based on original logic
            });

            const savedOrder = await queryRunner.manager.save(order);
            await queryRunner.commitTransaction();
            return savedOrder;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
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

    async findAllByUser(userId: string): Promise<Order[]> {
        return this.ordersRepository.find({
            where: { user: { id: userId } },
            relations: ['quote', 'quote.items', 'quote.items.product'],
            order: { created_at: 'DESC' }
        });
    }

    async markAsRead(id: string): Promise<void> {
        await this.ordersRepository.update(id, { is_read: true });
    }

    async findAll(page: number = 1, limit: number = 10): Promise<{ data: Order[], total: number }> {
        const [data, total] = await this.ordersRepository.findAndCount({
            relations: ['quote', 'user'],
            order: { created_at: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total };
    }
}
