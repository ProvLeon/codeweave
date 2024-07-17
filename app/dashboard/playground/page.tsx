import Playground from '@/components/Playground'
import { auth } from "@/app/api/auth/[...nextauth]/route"
import React from 'react'

const PlaygroundContent = async () => {
  const session = await auth()
  return (
    <div>
      <Playground session={session}/>
    </div>
  )
}

export default PlaygroundContent
