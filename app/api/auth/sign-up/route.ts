import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {hash} from 'bcryptjs';

export async function POST(req: Request) {
  const { email, password, firstName, lastName, userName } = await req.json();

  if (!email || !password || !firstName || !lastName || !userName) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  const hashedPassword = await hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      password: hashedPassword
    },
    include: {
      profile: true
    },

  });

  await prisma.profile.create({
    data: {
      userId: user.id,
      username: userName
    }
  });

  return NextResponse.json({ message: "User registered successfully" }, { status: 200 });
}
