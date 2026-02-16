import { Controller, Get, Param, Patch, Body, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderStatus } from './order.entity';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Get('stats/count')
    getCount() {
        return this.ordersService.getUnreadCount();
    }

    @Get('user/:userId')
    findAllByUser(@Param('userId') userId: string) {
        return this.ordersService.findAllByUser(userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ordersService.findOne(id);
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id') id: string,
        @Body() body: { status: OrderStatus; trackingNumber?: string },
    ) {
        return this.ordersService.updateStatus(id, body.status, body.trackingNumber);
    }

    @Patch(':id/read')
    markAsRead(@Param('id') id: string) {
        return this.ordersService.markAsRead(id);
    }

    @Get()
    findAll(@Query('page') page: string, @Query('limit') limit: string) {
        return this.ordersService.findAll(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 10
        );
    }
}
