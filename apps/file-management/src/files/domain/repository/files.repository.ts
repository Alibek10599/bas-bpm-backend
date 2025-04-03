import { CreateFile } from './types/create-file';
import { UpdateFile } from './types/update-file';
import { FindAllFilesFilter } from './types/find-all-files-filter';
import { PaginatedList } from '@app/common/pagination';
import { File } from '../../infrastructure/database/postgres/entities/file.entity';

export interface FilesRepository {
  findOneById(id: string): Promise<File>;
  findAll(filter: FindAllFilesFilter): Promise<File[]>;
  findAllPaginated(filter: FindAllFilesFilter): Promise<PaginatedList<File>>;
  createFile(createFile: CreateFile): Promise<File>;
  updateFile(id: string, updateFile: UpdateFile): Promise<File>;
}
