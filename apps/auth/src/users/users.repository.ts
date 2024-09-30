import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@app/common';

@Injectable()
export class UsersRepository {
  protected readonly logger = new Logger(UsersRepository.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(email: string, password: string): Promise<UserEntity> {
    const user = this.userRepository.create({ email, password });
    return this.userRepository.save(user);
  }

  // Add any other repository methods here (find, update, delete, etc.)
}
