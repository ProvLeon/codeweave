import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const projects = await prisma.project.findMany({
      where: { ownerId: userId },
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { title, description, ownerId, folderName, documentsCount } = await request.json();

  if (!title || !description || !ownerId || !folderName || documentsCount === undefined) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  try {
    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        ownerId,
        folderName,
        documentsCount,
      },
    });
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { id, title, description, folderName, documentsCount } = await request.json();

  if (!id || !title || !description || !folderName || documentsCount === undefined) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

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

export async function DELETE(request: Request) {
  const { id } = await request.json();

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


