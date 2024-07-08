// app/dashboard/page.tsx
import { redirect } from "next/navigation"
import DocumentList from "@/components/DocumentList"
import { SessionProvider } from "./SessionContext"
import DashboardContent from "./DashboardContent"

export default function Dashboard() {
  return (
    <SessionProvider>
      <DashboardContent />
    </SessionProvider>
  )
}
