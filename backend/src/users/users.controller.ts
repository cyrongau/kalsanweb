import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() data: Partial<User>) {
        return this.usersService.update(id, data);
    }

    @Get(':id/vehicles/extract')
    @UseGuards(JwtAuthGuard)
    async extractVehicles(@Param('id') id: string) {
        return this.usersService.extractVehiclesFromOrders(id);
    }

    @Put(':id/vehicles')
    @UseGuards(JwtAuthGuard)
    async updateVehicles(@Param('id') id: string, @Body() body: { vehicles: any[] }) {
        return this.usersService.update(id, { garage_details: body.vehicles });
    }
}
