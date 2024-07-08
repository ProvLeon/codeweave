// app/dashboard/SessionContext.tsx
"use client"

import React, { createContext, useContext } from 'react'
import { Session } from 'next-auth'
import { useSession } from "next-auth/react"

type SessionContextType = {
  session: Session | null
  status: "loading" | "authenticated" | "unauthenticated"
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  return (
    <SessionContext.Provider value={{ session, status }}>
      {status === "loading" ? <div>Loading...</div> : children}
    </SessionContext.Provider>
  )
}

export function useSessionContext() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useSessionContext must be used within a SessionProvider')
  }
  return context
}
