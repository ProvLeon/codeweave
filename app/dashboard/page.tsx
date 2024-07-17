// app/dashboard/DashboardContent.tsx

import { auth } from "@/app/api/auth/[...nextauth]/route"
import DashboardClient from "@/components/DashboardClient"
import { redirect } from "next/navigation"

export default async function DashboardContent() {
  const session = await auth()
  if (!session) {
    console.log({ "error": session })
    redirect("/sign-in")
  }

  return (
    <div>
    <DashboardClient session={session} />
    </div>
  )
}
