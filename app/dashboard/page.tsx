// app/dashboard/DashboardContent.tsx
"use client"
import DashboardClient from "@/components/DashboardClient"
import { useClientSession, getSessionServer } from "@/lib/Session"
import { redirect } from "next/navigation"

export default  function DashboardContent() {
  const {session, status} = useClientSession()
  if (status === "unauthenticated") {
    console.log({ "error": session })
    redirect("/sign-in")
  }

  return (
    session?.user
    &&
    <div>
      <DashboardClient session={session} />
    </div>
  )
}
