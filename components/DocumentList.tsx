'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { Card } from './ui/card'

interface Document {
  id: string
  title: string
  updatedAt: string
}

export default function DocumentList({ userId }: { userId: string }) {
  const [documents, setDocuments] = useState<Document[]>([])

  const fetchDocuments = async () => {
    console.log({"userId": userId})
    const response = await fetch(`/api/documents?userId=${userId}`)
    const data = await response.json()
    //console.log({"data":data})
    if (response.ok) {
      setDocuments(data)
      console.log(data)
    } else {
      setDocuments([])
    }
  }
  useEffect(() => {
    fetchDocuments()
  }, [userId, fetchDocuments])

  const createDocument = async () => {
    await fetch("/api/documents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //"Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        title: "New Document",
        content: "This is a new document",
        folderId: "668cb122124883044228d64e",
      }),
    })
    await fetchDocuments()
  }

  const createFolder = async () => {
    await fetch("/api/folders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //"Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name: "New Folder",
      }),
    })
  }

  return (
    <div className='container mx-auto py-8'>
      <Card className='w-full bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border rounded-md p-4' >

      <div className='flex justify-between items-center mb-4'>
      <h2 className="text-2xl font-semibold text-light-heading dark:text-dark-heading mb-4">Your Documents</h2>
      <Button variant="outline" onClick={createDocument} className="">Create Document</Button>
      <Button variant="outline" onClick={createFolder} className="">Create Folder</Button>
      </div>
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
        </Card>
    </div>
  )
}
