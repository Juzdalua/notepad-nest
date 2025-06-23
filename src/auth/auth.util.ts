import * as jwt from 'jsonwebtoken';

export const MakeJwtToken = (userId: number, name: string, email: string) => {
  const expiresIn: string = (process.env.JWT_ACCESS_EXPIRES_IN as string) ?? '1h';
  return jwt.sign({ userId, name, email }, process.env.JWT_SECRET! as string, { expiresIn } as jwt.SignOptions);
};
