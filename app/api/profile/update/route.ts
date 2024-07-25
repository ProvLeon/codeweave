import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(req: NextRequest) {
    const { userId, firstName, lastName, dob } = await req.json();

    if (!userId || !firstName || !lastName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          firstName,
          lastName,
          dob: new Date(dob),
        },
      });

      return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
      console.error('Error updating user:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
