import { Request, Response, NextFunction } from 'express';
import { raw } from 'body-parser';

export function rawBodyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  raw({ type: '*/*' })(req, res, next);
}
