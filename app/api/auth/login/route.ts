import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  const {email, password} = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Missing required fields"})
  }

  const user = await prisma.user.findUnique({
    where: {email}
  });

  if (!user) {
    return NextResponse.json({ error: "Invalid email or password"})
  }

  const isPasswordValid = await compare(password, user.password)
  if (!isPasswordValid) {
    return NextResponse.json({ error: "Invalid email or password" })
  }

  const token = signToken({ userId: user.id })

  return NextResponse.json({ token })
}
