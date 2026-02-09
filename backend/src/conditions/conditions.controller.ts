import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ConditionsService } from './conditions.service';
import { Condition } from './condition.entity';

@Controller('conditions')
export class ConditionsController {
    constructor(private readonly conditionsService: ConditionsService) { }

    @Get()
    findAll() {
        return this.conditionsService.findAll();
    }

    @Get(':slug')
    findBySlug(@Param('slug') slug: string) {
        return this.conditionsService.findBySlug(slug);
    }

    @Post()
    create(@Body() data: Partial<Condition>) {
        return this.conditionsService.create(data);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() data: Partial<Condition>) {
        return this.conditionsService.update(id, data);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.conditionsService.delete(id);
    }
}
