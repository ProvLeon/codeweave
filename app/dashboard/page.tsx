// app/dashboard/DashboardContent.tsx
//"use client"

import { auth } from "@/app/api/auth/[...nextauth]/route"
import CodeEditor from "@/components/CodeEditor"
import DocumentList from "@/components/DocumentList"
import FolderTree from "@/components/FolderTree"
import { Button } from "@/components/ui/button"
//import { FolderTree } from "lucide-react"
//import { getSession } from "next-auth/react"
import { redirect } from "next/navigation"

export default async function DashboardContent() {
  //const session = await getSession()
  const session = await auth()
  if (!session) {
    console.log({"error": session})
    redirect("/sign-in")
  }



  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-light-heading dark:text-dark-heading mb-6">
        Welcome, {session?.user.name}
      </h1>
      {/*<FolderTree children={<DocumentList userId={session?.user?.id as string} />} className="w-full"/>*/}
      {/*<DocumentList userId={session?.user?.id as string} />*/}
      {/*</FolderTree>*/}
      <FolderTree userId={session.user.id}/>
      <CodeEditor documentId={session.user.id} initialValue="Hello"/>
    </div>
  )
}
