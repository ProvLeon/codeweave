// types.d.ts
import { JWT } from "next-auth/jwt";


export interface CustomNextAuthOptions {
  providers: any[];
  callbacks: {
    session: (params: { session: any; token: JWT }) => Promise<any>;
    jwt: (params: { token: JWT; user: any }) => Promise<JWT>;
  };
  pages: {
    signIn: string;
  };
}
