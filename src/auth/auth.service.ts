import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ResponseUser } from './dto/responseUser.dto';

@Injectable()
export class AuthService {
    JWT_SECRET: any;
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService
    ) {
        this.JWT_SECRET = config.get('JWT_SECRET')
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto

        // searching for user by email
        const user = await this.prisma.users.findUnique({
            where: {
                email: email
            },
        })

        // if user not exists throw "forbidden" error
        if (!user) throw new ForbiddenException('email or password is incorrect')

        // verify user password 
        const verify = bcrypt.compareSync(password, user.password)

        // if user password wrong throw "forbidden" error
        if (!verify) throw new ForbiddenException('email or password is incorrect')

        // generating jwt token
        const token = await this.jwt.signAsync({
            email: email
        }, {
            secret: this.JWT_SECRET
        })

        const userDto: ResponseUser = {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name,
            gender: user.gender,
            profile_picture: user.profile_picture,
            profile_banner: user.profile_banner,
            token: token,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }

        return userDto
    }

    async register(registerDto: RegisterDto) {
        const { email, password, username } = registerDto

        // searching for user by email
        const user_email = await this.prisma.users.findUnique({
            where: {
                email: email,
            }
        })

        // if user exists throw "forbidden" error
        if (user_email) throw new ForbiddenException('email already exists')

        // searching for user by username
        const user_username = await this.prisma.users.findUnique({
            where: {
                username: username,
            }
        })

        // if user exists throw "forbidden" error
        if (user_username) throw new ForbiddenException('username already exists')

        // hashing password with bcrypt
        const salt = bcrypt.genSaltSync(13)
        const hash = bcrypt.hashSync(password, salt)

        // creating user
        const user = await this.prisma.users.create({
            data: {
                username: username,
                email: email,
                password: hash,
            },
        })

        // generating jwt token
        const token = await this.jwt.signAsync({
            email: email
        }, {
            secret: this.JWT_SECRET
        })

        const userDto: ResponseUser = {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name,
            gender: user.gender,
            profile_picture: user.profile_picture,
            profile_banner: user.profile_banner,
            token: token,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }

        return userDto
    }
}
