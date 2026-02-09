import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { User } from '../users/user.entity';

@Controller('quotes')
export class QuotesController {
    constructor(private readonly quotesService: QuotesService) { }

    @Post()
    create(@Body() body: { userId: string; items: { productId: string; quantity: number }[]; guestName?: string; guestEmail?: string; guestPhone?: string; guestNotes?: string }) {
        // userId would normally come from the request user (auth)
        return this.quotesService.create({ id: body.userId } as User, body.items, {
            name: body.guestName,
            email: body.guestEmail,
            phone: body.guestPhone,
            notes: body.guestNotes,
        });
    }

    @Get('stats/count')
    getCount() {
        return this.quotesService.getUnreadCount();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.quotesService.findOne(id);
    }

    @Patch(':id/prices')
    setPrices(@Param('id') id: string, @Body() body: { items: { itemId: string; unitPrice: number }[] }) {
        return this.quotesService.setPrices(id, body.items);
    }

    @Patch(':id/read')
    markAsRead(@Param('id') id: string) {
        return this.quotesService.markAsRead(id);
    }

    @Get()
    findAll() {
        return this.quotesService.findAll();
    }

    @Post(':id/finalize')
    finalize(@Param('id') id: string) {
        return this.quotesService.convertToOrder(id);
    }
}
