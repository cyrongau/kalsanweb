import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/user.entity';
import { Product } from './products/product.entity';
import { Quote } from './quotes/quote.entity';
import { QuoteItem } from './quotes/quote-item.entity';
import { Order } from './orders/order.entity';
import { ProductsModule } from './products/products.module';
import { QuotesModule } from './quotes/quotes.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SettingsModule } from './settings/settings.module';
import { Setting } from './settings/setting.entity';
import { BrandsModule } from './brands/brands.module';
import { Brand } from './brands/brand.entity';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/category.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UploadsController } from './uploads/uploads.controller';
import { Review } from './products/review.entity';
import { ReviewsModule } from './products/reviews.module';
import { MailsModule } from './mails/mails.module';
import { ConditionsModule } from './conditions/conditions.module';
import { Condition } from './conditions/condition.entity';
import { ChatModule } from './chat/chat.module';
import { ChatConversation } from './chat/conversation.entity';
import { ChatMessage } from './chat/message.entity';
import { StatsModule } from './stats/stats.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'kalsan_db',
      entities: [User, Product, Quote, QuoteItem, Order, Setting, Brand, Category, Review, Condition, ChatConversation, ChatMessage],
      synchronize: false, // Only for development
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ProductsModule,
    QuotesModule,
    OrdersModule,
    AuthModule,
    UsersModule,
    SettingsModule,
    BrandsModule,
    CategoriesModule,
    ReviewsModule,
    MailsModule,
    ConditionsModule,
    ChatModule,
    StatsModule,
  ],
  controllers: [AppController, UploadsController],
  providers: [AppService],
})
export class AppModule { }
