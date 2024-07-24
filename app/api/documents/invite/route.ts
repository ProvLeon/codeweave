import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
    const { documentId, userId } = await req.json();

    try {
      const collaborator = await prisma.documentCollaborator.create({
        data: {
          documentId,
          userId,
        },
      });

      return NextResponse.json(collaborator, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to invite collaborator' }, { status: 500 });
    }
}
