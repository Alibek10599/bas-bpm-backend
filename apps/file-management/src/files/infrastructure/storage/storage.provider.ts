export interface StorageProvider {
  /**
   * @return fileId - string
   * */
  save(file: File): Promise<string>;

  /**
   * get file by id
   * */
  get(fileId: string): Promise<Buffer>;
}
