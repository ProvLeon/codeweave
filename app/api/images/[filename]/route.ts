import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const uploadDir = path.join(process.cwd(), 'public/uploads');

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const filename = path.basename(url.pathname);
  const filePath = path.join(uploadDir, filename);

  try {
    const fileBuffer = await fs.readFile(filePath);
    const headers = new Headers();

    // Determine content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream'; // Default content type
    if (ext === '.png') contentType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.webp') contentType = 'image/webp';

    headers.set('Content-Type', contentType);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    return new NextResponse(fileBuffer, { status: 200, headers });
  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  }
}
