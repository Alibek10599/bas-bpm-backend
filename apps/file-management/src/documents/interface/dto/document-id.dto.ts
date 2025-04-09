import { IsNotEmpty, IsString } from 'class-validator';

export class DocumentIdDto {
  @IsString()
  @IsNotEmpty()
  documentId: string;
}
