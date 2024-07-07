import NextAuth from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "./auth";



export const GET = async (req: NextRequest) => {
  const res = await NextAuth(authOptions);
  return res.handlers.GET(req);
};

export const POST = async (req: NextRequest) => {
  const res = await NextAuth(authOptions);
  return res.handlers.POST(req);
}
