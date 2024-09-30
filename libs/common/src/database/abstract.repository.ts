import { Repository, DeepPartial, FindOptionsWhere, UpdateResult } from 'typeorm';
import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractEntity } from './abstract.entity'; // Replace with your base entity class

export abstract class AbstractRepository<TDocument extends AbstractEntity> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly repository: Repository<TDocument>) {}

  async create(createDto: DeepPartial<TDocument>): Promise<TDocument> {
    const createdEntity = this.repository.create(createDto);  // Initialize entity
    return this.repository.save(createdEntity);  // Save entity and return it
  }

  async findOne(filterQuery: FindOptionsWhere<TDocument>): Promise<TDocument> {
    const entity = await this.repository.findOne({ where: filterQuery });
    if (!entity) this.handleNotFoundError(filterQuery);
    return entity;
  }

  async findOneAndUpdate(
    filterQuery: FindOptionsWhere<TDocument>,
    update: DeepPartial<TDocument>,
  ): Promise<TDocument> {
    const entity = await this.repository.findOne({ where: filterQuery });
    if (!entity) this.handleNotFoundError(filterQuery);

    await this.repository.update(filterQuery, update);  // Perform the update
    return this.repository.findOne({ where: filterQuery });  // Return updated entity
  }

  async find(filterQuery?: FindOptionsWhere<TDocument>): Promise<TDocument[]> {
    const entities = await this.repository.find({ where: filterQuery });
    if (!entities.length) this.handleNotFoundError(filterQuery);
    return entities;
  }

  async findOneAndDelete(filterQuery: FindOptionsWhere<TDocument>): Promise<any> {
    const entity = await this.repository.findOne({ where: filterQuery });
    if (!entity) this.handleNotFoundError(filterQuery);

    await this.repository.remove(entity);  // Remove the entity
    return {
      message: 'Entity deleted successfully',
      data: entity,
    };
  }

  private handleNotFoundError(filterQuery: FindOptionsWhere<TDocument>) {
    this.logger.warn(`Entity not found for filter query: ${JSON.stringify(filterQuery)}`);
    throw new NotFoundException('Entity not found');
  }
}
