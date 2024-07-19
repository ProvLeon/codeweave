import { getSessionServer } from '@/lib/Session'
import Header from './Header'

export default async function HeaderWrapper() {
  const session = await getSessionServer()
  return (session?.user && <Header session={session} />)
}
