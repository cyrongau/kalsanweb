import { Controller, Get, Post, Patch, Delete, Param, Query, Body } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    findAll(
        @Query('category') category?: string,
        @Query('brand') brand?: string,
        @Query('condition') condition?: string,
        @Query('q') q?: string,
        @Query('sort') sort?: string
    ) {
        return this.productsService.findAll({ category, brand, condition, q, sort });
    }

    @Get('search')
    search(@Query('q') q: string) {
        return this.productsService.search(q);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Get('brand/:brandId')
    findByBrand(@Param('brandId') brandId: string) {
        return this.productsService.findByBrand(brandId);
    }

    @Get('brand/slug/:slug')
    findByBrandSlug(@Param('slug') slug: string) {
        return this.productsService.findByBrandSlug(slug);
    }

    @Post()
    create(@Body() data: any) {
        return this.productsService.create(data);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() data: any) {
        return this.productsService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productsService.delete(id);
    }
}
