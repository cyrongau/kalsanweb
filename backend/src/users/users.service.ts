import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(email: string, password: string, role: UserRole = UserRole.CUSTOMER, team?: string): Promise<User> {
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
        });

        const savedUser = await this.usersRepository.save(user);
        const { password_hash: _, ...result } = savedUser;
        return result as User;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password_hash', 'role', 'team', 'garage_details'],
        });
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async update(id: string, data: Partial<User>): Promise<User> {
        await this.usersRepository.update(id, data);
        return this.findById(id) as Promise<User>;
    }

    async findById(id: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ id });
    }
}
