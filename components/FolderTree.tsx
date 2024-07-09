"use client"

import { useState } from 'react'
import { Folder, FolderOpen, File, Edit3, EditIcon, ChevronRight, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import LoadingSpinner from './LoadingSpinner';

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => res.json());

interface Document {
  id: string
  title: string
  updatedAt: string
}

interface Folder {
  id: string
  name: string
  parentId: string
  createdAt: string
  updatedAt: string
  ownerId: string
  subfolders: Folder[]
  documents: Document[]
}

const FolderTree = ({ userId }: { userId: string }) => {
  const { data: folders, error } = useSWR<Folder[]>(`/api/folders?userId=${userId}`, fetcher, {
    refreshInterval: 60000, // Revalidate every 60 seconds
  });

  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({})
  const [isHover, setIsHover] = useState<{ [key: string]: boolean }>({})
  const [editIcons, setEditIcons] = useState<{ [key: string]: boolean }>({})

  const router = useRouter()

  if (error) return <div>Failed to load</div>
  if (!folders) return <LoadingSpinner/>

  const toggleFolder = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  }

  //const toggleFile = (id: string) => {
  //  router.push(`/documents/${id}`)
  //}

  const handleMouseEnter = (id: string) => {
    setIsHover(prev => ({ ...prev, [id]: true }));
  }

  const handleMouseLeave = (id: string) => {
    setIsHover(prev => ({ ...prev, [id]: false }));
  }

  const toggleEditIcon = (id: string) => {
    setEditIcons(prev => ({ ...prev, [id]: !prev[id] }));
    router.push(`/documents/${id}`)
  }

  const renderFolder = (folder: Folder) => {
    return (
      <li key={folder.id} className="ml-4">
        <div
          onClick={() => toggleFolder(folder.id)}
          className="flex items-center cursor-pointer hover:text-blue-500 transition-colors duration-200 p-2"
        >
          {expanded[folder.id] ? (
            <ChevronDown size={16} className="text-blue-400" />
          ) : (
            <ChevronRight size={16} />
          )}
          {expanded[folder.id] ? (
            <FolderOpen size={16} className='text-blue-400' />
          ) : (
            <Folder size={16} />
          )}
          <span className="ml-2">{folder.name} ({folder.documents.length})</span>
        </div>
        {expanded[folder.id] && (
          <>
            {folder.subfolders.length > 0 && (
              <ul className="ml-4">{folder.subfolders.map(renderFolder)}</ul>
            )}
            {folder.documents.length > 0 && (
              <ul className="ml-4">
                {folder.documents.map((document) => (
                  <li
                    key={document.id}
                    className="flex justify-between items-center hover:bg-gray-200 rounded-lg p-2 cursor-pointer"
                    onMouseEnter={() => handleMouseEnter(document.id)}
                    onMouseLeave={() => handleMouseLeave(document.id)}
                    onClick={() => toggleEditIcon(document.id)}
                  >
                    <div className='flex items-center'>
                      <File size={16} />
                      <span className="ml-2">{document.title}</span>
                      {isHover[document.id] && (
                        <div className="ml-2 cursor-pointer">
                          {editIcons[document.id] ? <Edit3 size={16} /> : <EditIcon size={16} />}
                        </div>
                      )}
                    </div>
                    <div>{}</div>
                    <div>
                      <p className="pl-8 text-[9px] text-gray-400 dark:text-dark-text no-underline">
                        Last updated: {new Date(document.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </li>
    )
  }

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Folders</h2>
      <ul className="space-y-2">{folders.map(renderFolder)}</ul>
    </div>
  )
}

export default FolderTree
