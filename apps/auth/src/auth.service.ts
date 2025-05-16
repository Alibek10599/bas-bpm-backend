import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UsersService } from './users/users.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import * as crypto from 'crypto';
import { AccessRedisService } from '@app/common/redis/accesses-redis';
import { AccessesModel } from '@app/common';
import { accessModel } from '@app/common/constants/access-model';
import { ApiTokensService } from './api-tokens/application/api-tokens.service';
import { TokenPayload } from '@app/common/types/token-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly accessRedisService: AccessRedisService,
    private readonly apiTokensService: ApiTokensService,
  ) {}

  async login(loginDto: CreateUserDto, response?: Response) {
    try {
      // Validate required fields
      if (!loginDto.email || !loginDto.password) {
        throw new BadRequestException('Email and password are required');
      }

      // Find user by email
      const user = await this.userService.findByEmail(loginDto.email);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const accesses = user.privileges.map((e) => e.accesses);
      const access = this.combineAccesses(accesses);
      await this.accessRedisService.setUserAccesses(user.id, access);

      // Verify password with simple hash
      const hashedPassword = this.hashPassword(loginDto.password);
      if (user.password !== hashedPassword) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate token
      const tokenPayload = {
        userId: user.id,
        email: user.email,
      };

      const expiresIn =
        this.configService.get<number>('JWT_EXPIRATION_TIME') || 3600;
      const expires = new Date();
      expires.setSeconds(expires.getSeconds() + expiresIn);

      const token = this.jwtService.sign(tokenPayload, {
        expiresIn: expiresIn,
      });

      // Set cookie if response object is provided
      if (response) {
        response.cookie('Authentication', token, {
          httpOnly: true,
          secure: this.configService.get('NODE_ENV') === 'production',
          expires,
          sameSite: 'lax',
        });
      }

      // Return user info and token
      return {
        access_token: token,
        user: this.sanitizeUser(user),
        expires_at: expires.toISOString(),
      };
    } catch (error) {
      // Error handling remains the same
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Login failed');
    }
  }

  async register(createUserDto: CreateUserDto, response?: Response) {
    try {
      // Validations (keep existing code)
      if (!createUserDto.email || !createUserDto.password) {
        throw new BadRequestException('Email and password are required');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(createUserDto.email)) {
        throw new BadRequestException('Invalid email format');
      }

      if (createUserDto.password.length < 8) {
        throw new BadRequestException('Password must be at least 8 characters');
      }

      // Check if user exists
      const existingUser = await this.userService.findByEmail(
        createUserDto.email,
      );
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      // Hash password
      const hashedPassword = this.hashPassword(createUserDto.password);

      // Create user with hashed password
      const user = await this.userService.create({
        email: createUserDto.email,
        password: hashedPassword,
      } as CreateUserDto);

      // Instead of reusing login, create tokens directly
      const tokenPayload = {
        userId: user.id,
        email: user.email,
      };

      const expiresIn =
        this.configService.get<number>('JWT_EXPIRATION_TIME') || 3600;
      const expires = new Date();
      expires.setSeconds(expires.getSeconds() + expiresIn);

      const token = this.jwtService.sign(tokenPayload, {
        expiresIn: expiresIn,
      });

      if (response) {
        response.cookie('Authentication', token, {
          httpOnly: true,
          secure: this.configService.get('NODE_ENV') === 'production',
          expires,
          sameSite: 'lax',
        });
      }

      // Return user info without password
      return {
        access_token: token,
        user: {
          id: user.id,
          email: user.email,
        },
        expires_at: expires.toISOString(),
      };
    } catch (error) {
      console.error(`Registration error: ${error.message}`, error.stack);

      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Registration failed');
    }
  }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        return null;
      }

      const hashedPassword = this.hashPassword(password);
      if (user.password !== hashedPassword) {
        return null;
      }

      return this.sanitizeUser(user);
    } catch (error) {
      return null;
    }
  }

  private sanitizeUser(user: any) {
    const { password, ...result } = user;
    return result;
  }

  async verifyToken(token: string): Promise<TokenPayload> {
    if (token.split('.').length === 3) {
      return {
        ...this.jwtService.verify(token),
        type: 'user',
      };
    }
    const apiToken = await this.apiTokensService.findOneByToken(token);
    await this.accessRedisService.setApiAccesses(
      apiToken.id,
      apiToken.accesses,
    );
    return {
      type: 'api',
      tokenId: apiToken.id,
      userId: apiToken.actorId,
      tenantId: apiToken.tenantId,
    };
  }

  private hashPassword(password: string): string {
    return crypto
      .createHash('sha256')
      .update(password + this.configService.get('JWT_SECRET')) // use JWT_SECRET as salt
      .digest('hex');
  }

  private combineAccesses(accesses: AccessesModel[]): AccessesModel {
    const combined = accessModel;

    const merge = (target: any, sources: any[]) => {
      for (const key of Object.keys(target)) {
        const values = sources
          .map((s) => s?.[key])
          .filter((v) => v !== undefined);

        if (typeof target[key] === 'boolean') {
          target[key] = values.some((v) => v === true);
        } else if (typeof target[key] === 'object' && target[key] !== null) {
          merge(target[key], values);
        }
      }
    };

    merge(combined, accesses);

    return combined;
  }
}
