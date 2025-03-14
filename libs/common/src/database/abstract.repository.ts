import { Repository, FindOptionsWhere, DeepPartial } from 'typeorm';
import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractEntity } from './abstract.entity';

export abstract class AbstractRepository<TEntity extends AbstractEntity> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly repository: Repository<TEntity>) {}

  async create(createDto: DeepPartial<TEntity>): Promise<TEntity> {
    const entity = this.repository.create(createDto);
    return await this.repository.save(entity);
  }

  async findOne(where: FindOptionsWhere<TEntity>): Promise<TEntity> {
    const entity = await this.repository.findOne({ where });
    if (!entity) this.handleNotFoundError(where);
    return entity;
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<TEntity>,
    update: DeepPartial<TEntity>,
  ): Promise<TEntity> {
    const entity = await this.findOne(where);
    Object.assign(entity, update);
    return await this.repository.save(entity);
  }

  async find(where?: FindOptionsWhere<TEntity>): Promise<TEntity[]> {
    return await this.repository.find({ where });
  }

  async findOneAndDelete(where: FindOptionsWhere<TEntity>): Promise<any> {
    const entity = await this.findOne(where);
    await this.repository.remove(entity);
    return {
      message: 'Entity deleted successfully',
      data: entity,
    };
  }

  private handleNotFoundError(where: FindOptionsWhere<TEntity>) {
    this.logger.warn(`Entity not found for query: ${JSON.stringify(where)}`);
    throw new NotFoundException('Entity not found');
  }
}
