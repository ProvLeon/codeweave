import NextAuth, {NextAuthConfig} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";

export const authOptions : NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "john@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toString() }
        })

        if (!user) {
          return null;
        }
        const isPasswordValid = typeof credentials.password === "string" && await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }
        return { id: user.id, email: user.email, name: `${user.firstName} ${user.lastName}` };
      }
    })
  ],
  callbacks: {
    async session({ session, token }: { session: any, token: any }) {
      if (token) {
        session.user.id = token.id
      }
      return session
    },
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        token.id = user.id
      }
      return token
    }
  },
  pages: {
    signIn: '/login'
  }
}

export default NextAuth(authOptions)
