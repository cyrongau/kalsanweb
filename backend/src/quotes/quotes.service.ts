import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quote, QuoteStatus } from './quote.entity';
import { QuoteItem } from './quote-item.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';

import { MailsService } from '../mails/mails.service';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class QuotesService {
    constructor(
        @InjectRepository(Quote)
        private quotesRepository: Repository<Quote>,
        @InjectRepository(QuoteItem)
        private quoteItemsRepository: Repository<QuoteItem>,
        private mailsService: MailsService,
        private ordersService: OrdersService,
    ) { }

    async create(user: User, productItems: { productId: string; quantity: number }[], guestInfo?: { name?: string; email?: string; phone?: string; notes?: string }): Promise<Quote> {
        const quote = new Quote();
        if (user && user.id && !user.id.startsWith('guest')) {
            quote.user = user;
        }

        if (guestInfo) {
            quote.guest_name = guestInfo.name ?? null;
            quote.guest_email = guestInfo.email ?? null;
            quote.guest_phone = guestInfo.phone ?? null;
            quote.guest_notes = guestInfo.notes ?? null;
        }

        quote.status = QuoteStatus.PENDING;

        const savedQuote = await this.quotesRepository.save(quote);

        const items = productItems.map((item) => {
            const quoteItem = new QuoteItem();
            quoteItem.quote = savedQuote;
            quoteItem.product = { id: item.productId } as Product;
            quoteItem.quantity = item.quantity;
            return quoteItem;
        });

        await this.quoteItemsRepository.save(items);
        const savedWithItems = await this.findOne(savedQuote.id);

        // Notify admin and customer
        const recipientEmail = (user && user.email) || quote.guest_email || 'customer@example.com';
        await this.mailsService.sendQuoteReceivedNotification(recipientEmail, savedQuote.id);
        await this.mailsService.sendAdminNewQuoteAlert(savedQuote.id);

        return savedWithItems;
    }

    async findOne(id: string): Promise<Quote> {
        const quote = await this.quotesRepository.findOne({
            where: { id },
            relations: ['items', 'items.product', 'user'],
        });
        if (!quote) throw new NotFoundException('Quote not found');
        return quote;
    }

    async setPrices(id: string, prices: { itemId: string; unitPrice: number }[], discount: number = 0): Promise<Quote> {
        const quote = await this.findOne(id);

        if (quote.status === QuoteStatus.CONVERTED) {
            throw new BadRequestException('Cannot update prices on a converted quote');
        }

        quote.status = QuoteStatus.REVIEWING;
        await this.quotesRepository.save(quote);

        for (const price of prices) {
            const item = quote.items.find((i) => i.id === price.itemId);
            if (item) {
                item.unit_price = price.unitPrice;
                await this.quoteItemsRepository.save(item);
            }
        }

        quote.status = QuoteStatus.PRICE_READY;
        quote.discount = discount;

        const subtotal = quote.items.reduce((sum, item) => sum + (Number(item.unit_price) || 0) * item.quantity, 0);
        const discountAmount = subtotal * (discount / 100);
        quote.total_amount = subtotal - discountAmount;

        const updatedQuote = await this.quotesRepository.save(quote);

        // Notify customer that prices are ready
        await this.mailsService.sendQuoteReadyNotification(updatedQuote);

        return updatedQuote;
    }

    async delete(id: string): Promise<void> {
        const result = await this.quotesRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Quote with ID "${id}" not found`);
        }
    }

    async getUnreadCount(): Promise<number> {
        return this.quotesRepository.count({
            where: { is_read: false }
        });
    }

    async markAsRead(id: string): Promise<void> {
        await this.quotesRepository.update(id, { is_read: true });
    }

    async findAll(page: number = 1, limit: number = 10): Promise<{ data: Quote[], total: number }> {
        const [data, total] = await this.quotesRepository.findAndCount({
            relations: ['user', 'items', 'items.product'],
            order: { created_at: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total };
    }

    async convertToOrder(id: string, paymentMethod: string = 'card', shippingAddress?: any): Promise<any> {
        const quote = await this.findOne(id);
        if (quote.status !== QuoteStatus.PRICE_READY) {
            throw new BadRequestException('Quote must be in price_ready status to be converted');
        }

        // Update quote status to converted
        quote.status = QuoteStatus.CONVERTED;
        await this.quotesRepository.save(quote);

        // Create the actual order record using OrdersService
        const order = await this.ordersService.create(
            quote.id,
            `payment_${Date.now()}`, // Generate a simple payment intent ID
            paymentMethod,
            shippingAddress
        );

        return order;
    }

    async findByUser(userId: string): Promise<Quote[]> {
        return this.quotesRepository.find({
            where: { user: { id: userId } },
            relations: ['items'],
            order: { created_at: 'DESC' }
        });
    }
}
