import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    // No need to validate here, we're doing that in AuthService
    return this.repository.create(createUserDto);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ email });
  }

  async validateCreateUserDto(email: string) {
    const existingUser = await this.repository.findOneByEmail(email);
    if (existingUser) {
      throw new UnprocessableEntityException('Email already exists.');
    }
    return true;
  }

  findAll(filterQuery: any) {
    return this.repository.findAll(filterQuery);
  }

  findOne(id: number) {
    return this.repository.findOne({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.repository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.repository.remove(id);
  }
}
