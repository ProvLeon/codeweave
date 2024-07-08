// app/dashboard/DashboardContent.tsx
"use client"

import { useSessionContext } from "./SessionContext"
import DocumentList from "@/components/DocumentList"
import { redirect } from "next/navigation"

export default function DashboardContent() {
  const { session, status } = useSessionContext()

  if (status === "unauthenticated") {
    redirect("/login")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-light-heading dark:text-dark-heading mb-6">
        Welcome, {session?.user?.name}
      </h1>
      <DocumentList userId={session?.user?.id as string} />
    </div>
  )
}
