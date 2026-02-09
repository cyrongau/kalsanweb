import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderStatus } from './order.entity';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Get('stats/count')
    getCount() {
        return this.ordersService.getUnreadCount();
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
    findAll() {
        return this.ordersService.findAll();
    }
}
