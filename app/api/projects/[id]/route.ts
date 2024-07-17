import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { title, description, folderName, documentsCount } = await request.json();
  const { id } = params;

  //if (!title || !description || !folderName || documentsCount === undefined) {
  //  return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  //}

  try {
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        folderName,
        documentsCount,
      },
    });
    return NextResponse.json(updatedProject);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
  }

  try {
    await prisma.project.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
