import  getServerSession  from "next-auth";
import { authConfig } from "@/app/api/auth/[...nextauth]/auth.config"; // Import the authConfig

export async function getSessionServer() {
  const {auth}= await getServerSession(authConfig); // Pass the authConfig
  return await auth();
}
