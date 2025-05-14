import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginatedList, toPaginated } from '@app/common/pagination';
import { User } from './user.entity';

@Injectable()
export class UsersRepository {
  private readonly logger = new Logger(UsersRepository.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log(`Creating user with email: ${createUserDto.email}`);
    return this.userRepository.save({
      ...createUserDto,
      role: { id: createUserDto.roleId },
      privileges: createUserDto.privilegeIds.map((e) => ({ id: e })),
    });
  }

  async findOne(filter: FindOptionsWhere<User>): Promise<User | null> {
    this.logger.log(`Finding user with filter: ${JSON.stringify(filter)}`);
    return this.userRepository.findOneBy(filter);
  }

  async findAll(filter?: any): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  async findAllPaginated(filter?: any): Promise<PaginatedList<User>> {
    return this.userRepository
      .findAndCount({
        take: filter?.limit || 10,
        skip: filter?.offset || 0,
      })
      .then((res) => toPaginated(...res));
  }

  async findOneById(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.save({
      id,
      ...updateUserDto,
      role: updateUserDto.roleId ? { id: updateUserDto.roleId } : undefined,
      privileges: updateUserDto.privilegeIds?.map((e) => ({ id: e })),
    });
    return this.findOneById(id);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
