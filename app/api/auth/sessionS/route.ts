import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react'; // Use getSession from next-auth/react
//import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Request received for session');
    const session = await getSession();
    if (!session) {
      console.log('No session found');
      return res.status(401).json({ error: 'Unauthorized' });
    }
    console.log('Session found:', session);
    res.status(200).json(session);
  } catch (error) {
    console.error('Session error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
