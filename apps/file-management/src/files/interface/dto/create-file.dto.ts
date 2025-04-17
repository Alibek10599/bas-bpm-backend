export class CreateFileDto {
  name: string;
  userId: string;
  tenantId: string;
  type: string;
  buffer: Buffer;
}
