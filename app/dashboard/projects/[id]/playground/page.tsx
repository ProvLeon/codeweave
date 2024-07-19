import Playground from '@/components/Playground'
import { getSessionServer } from '@/lib/Session'
import React from 'react'
import { redirect } from 'next/navigation'

const PlaygroundContent = async () => {
  const session = await getSessionServer()
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
