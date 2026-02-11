import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { Order } from '../orders/order.entity';
import { Quote } from '../quotes/quote.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
        @InjectRepository(Quote)
        private quotesRepository: Repository<Quote>,
    ) { }

    async create(email: string, password: string, role: UserRole = UserRole.CUSTOMER, team?: string, name?: string, phone?: string): Promise<User> {
        const existingUser = await this.usersRepository.findOneBy({ email });
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const password_hash = await bcrypt.hash(password, 10);
        const user = this.usersRepository.create({
            email,
            password_hash,
            role,
            team,
            name,
            phone,
        });

        const savedUser = await this.usersRepository.save(user);
        const { password_hash: _, ...result } = savedUser;
        return result as User;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password_hash', 'role', 'team', 'garage_details', 'name', 'phone', 'avatar_url', 'nationality', 'addresses', 'favorites'],
        });
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async update(id: string, data: any): Promise<User> {
        if (data.password) {
            data.password_hash = await bcrypt.hash(data.password, 10);
            delete data.password;
        }
        await this.usersRepository.update(id, data);
        return this.findById(id) as Promise<User>;
    }

    async findById(id: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ id });
    }

    async extractVehiclesFromOrders(userId: string): Promise<any[]> {
        const vehicles = [];
        const vehicleMap = new Map();

        // Get user's orders with product details
        const orders = await this.ordersRepository.find({
            where: { user: { id: userId } },
            relations: ['quote', 'quote.items', 'quote.items.product'],
        });

        // Extract brands from ordered products
        for (const order of orders) {
            if (order.quote?.items) {
                for (const item of order.quote.items) {
                    const product = item.product;
                    if (product) {
                        // Use brand name or category name as vehicle make
                        const make = product.brand?.name || product.category?.name || 'Unknown';
                        const key = make.toLowerCase();

                        if (!vehicleMap.has(key)) {
                            vehicleMap.set(key, {
                                id: `vehicle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                                make: make,
                                source: 'order',
                                addedAt: order.created_at,
                            });
                        }
                    }
                }
            }
        }

        // Get user's quotes to extract VINs from notes
        const quotes = await this.quotesRepository.find({
            where: { user: { id: userId } },
        });

        // Extract VINs from quote notes (VIN is 17 characters)
        for (const quote of quotes) {
            if (quote.guest_notes) {
                const vinMatch = quote.guest_notes.match(/\b[A-HJ-NPR-Z0-9]{17}\b/);
                if (vinMatch) {
                    const vin = vinMatch[0];
                    // Try to associate VIN with existing vehicle or create new entry
                    const existingVehicle = Array.from(vehicleMap.values())[0];
                    if (existingVehicle && !existingVehicle.vin) {
                        existingVehicle.vin = vin;
                    } else {
                        vehicleMap.set(`vin_${vin}`, {
                            id: `vehicle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                            make: 'Unknown',
                            vin: vin,
                            source: 'quote',
                            addedAt: quote.created_at,
                        });
                    }
                }
            }
        }

        return Array.from(vehicleMap.values());
    }
}
