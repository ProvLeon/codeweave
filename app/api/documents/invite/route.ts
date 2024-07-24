import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { documentId, userId } = req.body;

    try {
      const collaborator = await prisma.documentCollaborator.create({
        data: {
          documentId,
          userId,
        },
      });

      res.status(200).json(collaborator);
    } catch (error) {
      res.status(500).json({ error: 'Failed to invite collaborator' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
