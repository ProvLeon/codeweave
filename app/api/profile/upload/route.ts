import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(process.cwd(), 'public/uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const filename = `${Date.now().toString()}-${file.name}`; // Ensure filename is a string
    const filepath = path.join(uploadDir, filename);

    // Example: Update user's profile in database
    const userId = formData.get('userId') as string;
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Fetch the current profile to get the existing image URL
    const currentProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (currentProfile?.imageUrl) {
      const oldFilePath = path.join(uploadDir, path.basename(currentProfile.imageUrl));
      if (fs.existsSync(oldFilePath)) {
        await fs.promises.unlink(oldFilePath);
      }
    }

    await fs.promises.writeFile(filepath, Buffer.from(buffer));

    // Constructing file URL
    //const baseUrl = process.env.BASE_URL || 'http://localhost:3000'; // Ensure BASE_URL is set in your environment variables
    const imageUrl = `/uploads/${filename}`;

    const profile = await prisma.profile.update({
      where: { userId },
      data: { imageUrl },
    });

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json({ error: 'Error processing the upload' }, { status: 500 });
  }
}

// Remove the Edge runtime configuration
// export const runtime = 'edge';
