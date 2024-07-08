'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DocumentList from '@/components/DocumentList'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [documents, setDocuments] = useState([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchDocuments()
    }
  }, [status, router])

  const fetchDocuments = async () => {
    const response = await fetch('/api/documents')
    if (response.ok) {
      const data = await response.json()
      setDocuments(data)
    }
  }

  const createNewDocument = async () => {
    const response = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Untitled Document', content: '' }),
    })

    if (response.ok) {
      const newDocument = await response.json()
      router.push(`/documents/${newDocument.id}`)
    }
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-light-heading dark:text-dark-heading">Dashboard</h1>
      <Button onClick={createNewDocument} className="bg-active hover:bg-success text-white">
        Create New Document
      </Button>
      <DocumentList documents={documents} />
    </div>
  )
}
