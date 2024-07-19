"use client"
import { useSession } from "next-auth/react";

export function useClientSession() {
  const {data: session, status} = useSession()
  return {session, status}
}
