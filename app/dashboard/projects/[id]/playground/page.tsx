import Playground from '@/components/Playground'
import { auth } from "@/app/api/auth/[...nextauth]/route"
import React from 'react'
import { redirect } from 'next/navigation'

const PlaygroundContent = async () => {
  const session = await auth()
  if (!session) {
    return redirect('/sign-up')
  }
  return (
    <div>
      <Playground session={session}/>
    </div>
  )
}

export default PlaygroundContent
