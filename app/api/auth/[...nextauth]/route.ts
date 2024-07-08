import NextAuth, {Session, User} from "next-auth"
import { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import { compare } from "bcryptjs"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user) {
          return null
        }
        const isPasswordValid = await compare(String(credentials.password), user.password)

        if (!isPasswordValid) {
          return null
        }
        return { id: user.id, email: user.email, name: `${user.firstName} ${user.lastName}` }
      }
    })
  ],
  callbacks: {
    async session({ session, token }: {session: Session, token: JWT}) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
      }
      return session
    },
    async jwt({ token, user }: {token: JWT, user: User}) {
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

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
