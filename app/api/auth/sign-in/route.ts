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
    where: {email},
    include: {
      profile: true
    }
  });

  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401})
  }

  const isPasswordValid = await compare(password, user.password)
  if (!isPasswordValid) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401})
  }

  const token = signToken(user.id)

  return NextResponse.json({ token, user}, { status: 200 })
}
