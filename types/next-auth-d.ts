import NextAuthConfig from "next-auth";
//import {NextAuthOptions} from "next-auth"

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
      dob: string
      contact: string
    }
  }
}
