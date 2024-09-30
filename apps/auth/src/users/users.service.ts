import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '@app/common';
import { FindOneOptions, FindOptionsWhere } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    await this.validateCreateUserDto(createUserDto);
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.repository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.repository.save(user);
  }

  private async validateCreateUserDto(createUserDto: CreateUserDto): Promise<void> {
    const existingUser = await this.repository.findOne({
      where: { email: createUserDto.email },
    });
    
    if (existingUser) {
      throw new UnprocessableEntityException('Email already exists.');
    }
  }

  async verifyUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.repository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    return user;
  }

  async findAll(query: any): Promise<UserEntity[]> {
    return this.repository.find({ where: query });
  }

  async findOne(id: string): Promise<UserEntity> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    const result = await this.repository.update(id, updateUserDto);

    if (result.affected === 0) {
      throw new UnprocessableEntityException('User not found');
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.repository.delete(id);

    if (result.affected === 0) {
      throw new UnprocessableEntityException('User not found');
    }
  }
}
