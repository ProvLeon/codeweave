import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to CodeWeave</h1>
      <p className="text-xl mb-8">
        Real-time collaborative code editing and execution across multiple programming languages.
      </p>
      <div className="space-x-4">
        <Link href="/register">
          <Button size="lg">Get Started</Button>
        </Link>
        <Link href="/login">
          <Button size="lg" variant="outline">Login</Button>
        </Link>
      </div>
    </div>
  )
}
