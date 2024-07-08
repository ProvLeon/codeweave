'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from './ui/button'

interface Document {
  id: string
  title: string
  updatedAt: string
}

export default function DocumentList({ userId }: { userId: string }) {
  const [documents, setDocuments] = useState<Document[]>([])

  useEffect(() => {
    const fetchDocuments = async () => {
      const response = await fetch(`/api/documents?userId=${userId}`)
      const data = await response.json()
      setDocuments(data)
    }
    fetchDocuments()
  }, [userId])

  return (
    <div>
      <h2 className="text-2xl font-semibold text-light-heading dark:text-dark-heading mb-4">Your Documents</h2>
      <ul className="space-y-4">
        {documents.map((doc) => (
          <li key={doc.id} className="flex justify-between items-center p-4 bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border rounded-md">
            <div>
              <h3 className="text-lg font-medium text-light-heading dark:text-dark-heading">{doc.title}</h3>
              <p className="text-sm text-light-text dark:text-dark-text">Last updated: {new Date(doc.updatedAt).toLocaleString()}</p>
            </div>
            <Button asChild>
              <Link href={`/document/${doc.id}`}>Open</Link>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
