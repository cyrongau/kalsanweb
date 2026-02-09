import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        // Mock Accounts for Testing
        if (email === 'admin@kalsansparepaarts.com' && pass === 'AdminMock123!') {
            return {
                id: 'mock-admin-id',
                email: 'admin@kalsansparepaarts.com',
                role: 'super_admin'
            };
        }
        if (email === 'customer@kalsanspareparts.com' && pass === 'CustomerMock123!') {
            return {
                id: 'mock-customer-id',
                email: 'customer@kalsanspareparts.com',
                role: 'customer'
            };
        }

        const user = await this.usersService.findByEmail(email);
        if (user && (await bcrypt.compare(pass, user.password_hash))) {
            const { password_hash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        };
    }
}
