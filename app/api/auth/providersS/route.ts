import { NextApiRequest, NextApiResponse } from 'next';
//import { providers } from 'next-auth/client';
import { getProviders } from 'next-auth/react';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const availableProviders = await getProviders();
  res.status(200).json(availableProviders);
};
