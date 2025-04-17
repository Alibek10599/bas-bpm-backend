export interface StorageProvider {
  /**
   * @return fileId - string
   * */
  save(file: { name: string; buffer: Buffer }): Promise<string>;

  /**
   * get file by id
   * */
  get(fileId: string): Promise<Buffer>;
}
