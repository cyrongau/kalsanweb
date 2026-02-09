import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { Brand } from './brand.entity';

@Controller('brands')
export class BrandsController {
    constructor(private readonly brandsService: BrandsService) { }

    @Get()
    findAll() {
        return this.brandsService.findAll();
    }

    @Get(':slug')
    findBySlug(@Param('slug') slug: string) {
        return this.brandsService.findBySlug(slug);
    }

    @Post()
    create(@Body() data: Partial<Brand>) {
        return this.brandsService.create(data);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() data: Partial<Brand>) {
        return this.brandsService.update(id, data);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.brandsService.delete(id);
    }
}
