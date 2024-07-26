import prisma from "@/lib/prisma";
import type {NextAuthConfig}  from "next-auth";
import { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";

export const authConfig = {
  callbacks: {
    async session({ session, token }: {session: Session, token: JWT}) {
      try {
        console.log('Session callback called with token:', token);
        if (token.name && token.email && typeof token.id === 'string') {
          // get user
          const user = await prisma.user.findUnique({
            where: { id: token.id },
          });
          if (user?.dob) {
            console.log('User:', new Date(user.dob).toISOString().split('T')[0].split('-').join('/'));
          }
          // get profile
          const profile = await prisma.profile.findUnique({
            where: { userId: token.id },
          });
          // set session
          session.user.id = token.id || '';
          session.user.name = token.name;
          session.user.firstName = user?.firstName || '';
          session.user.lastName = user?.lastName || '';
          session.user.dob = user?.dob ? user.dob.toISOString() : '';
          session.user.email = token.email;
          session.user.imageUrl = profile?.imageUrl || '';
          session.user.userName = profile?.username || '';
        }
        return session;
      } catch (error) {
        console.error('Error in session callback:', error);
        return session;
      }
    },
    async jwt({ token, user }: {token: JWT, user: User}) {
      try {
        console.log('JWT callback called with user:', user);

        if (user) {
          token.id = user.id;
        }

        return token;
      } catch (error) {
        console.error('Error in JWT callback:', error);
        return token;
    }}
  },
  pages: {
    signIn: "/signin",
    signOut: "/signout",
    error: "/api/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  //debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [],
  trustHost: true,
} satisfies NextAuthConfig
