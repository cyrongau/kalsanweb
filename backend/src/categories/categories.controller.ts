import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    findAll() {
        return this.categoriesService.findAll();
    }

    @Get(':slug')
    findBySlug(@Param('slug') slug: string) {
        return this.categoriesService.findBySlug(slug);
    }

    @Post()
    create(@Body() data: Partial<Category>) {
        return this.categoriesService.create(data);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() data: Partial<Category>) {
        return this.categoriesService.update(id, data);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.categoriesService.delete(id);
    }
}
