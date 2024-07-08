import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from './ui/card'

interface Document {
  id: string
  title: string
  updatedAt: string
}

interface DocumentListProps {
  documents: Document[]
}

export default function DocumentList({ documents }: DocumentListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc) => (
        <Link href={`/documents/${doc.id}`} key={doc.id}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-light-heading dark:text-dark-heading">{doc.title}</CardTitle>
              <CardDescription>
                Last updated: {new Date(doc.updatedAt).toLocaleString()}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  )
}
