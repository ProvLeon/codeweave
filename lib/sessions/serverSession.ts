import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function getSessionServer() {
  const session = await auth();
  return session;
}
