import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";
import { authConfig } from "./auth.config";
//import { JWT } from "next-auth/jwt";

const getUser = async (userDetails: {email: string, password: string}): Promise<any> => {
  if (!userDetails?.email || !userDetails?.password) {
    return null;
  }

  const user = typeof userDetails.email === 'string' && await prisma.user.findUnique({
    where: { email: userDetails.email }
  });


  if (!user) {
    return null;
  }

  const isPasswordValid = typeof userDetails.password === 'string' && await compare(userDetails.password, user.password);

  if (!isPasswordValid) {
    return null;
  }
  return { id: user.id, email: user.email, name: `${user.firstName} ${user.lastName}`, firstName: user.firstName, lastName: user.lastName, DOB: user.dob };
}

export const authOptions = {
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log({"credentials": credentials})
        if (!credentials) {
          return null;
        }
        const user = await getUser({
          email: credentials.email as string,
          password: credentials.password as string
        });
        return user ?? null;
        //
      }
    })
  ],

};

export const {auth, signIn, signOut, handlers: { GET, POST}} = NextAuth(authOptions);

//export { handler as GET, handler as POST };
