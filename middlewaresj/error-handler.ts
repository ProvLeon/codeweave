// middleware/error-handler.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default function errorHandler(
  err: any,
  req: NextApiRequest,
  res: NextApiResponse,
  next: (err?: any) => void
) {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
}
