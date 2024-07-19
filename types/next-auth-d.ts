import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      firstName: string
      lastName: string
      imageUrl: string
      userName: string
      DOB: string | Date
    }
  }
}
