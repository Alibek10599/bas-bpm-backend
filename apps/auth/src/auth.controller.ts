import {
  Body,
  Controller,
  Post,
  Res,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import { Response } from 'express';
import { AuthGuard } from '@app/common/auth/auth-guard.service';
import { UsersService } from './users/users.service';
import { PinoLogger } from 'nestjs-pino';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AuthController.name);
  }

  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error',
  })
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.register(createUserDto, response);
  }

  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid credentials',
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(loginDto, response);
  }

  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns the current user profile',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
  })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
