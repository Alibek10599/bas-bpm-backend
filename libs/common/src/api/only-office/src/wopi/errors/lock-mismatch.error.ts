export class LockMismatchError extends Error {
  constructor(
    public lockId: string,
    public message: string = 'lock mismatch',
    public status: number = 409,
  ) {
    super();
  }
}
