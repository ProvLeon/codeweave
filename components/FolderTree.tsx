// components/FolderTree.tsx
"use client"

import { useState } from 'react'
import { Folder, FolderOpen, File, Edit3, EditIcon, ChevronRight, ChevronDown, CircleSlashedIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import LoadingSpinner from './LoadingSpinner';

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => res.json());

interface Document {
  id: string
  title: string
  content: string
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

interface FolderTreeProps {
  userId: string;
  onDocumentSelect: (document: Document) => void;
  className?: string;
}

const FolderTree = ({ userId, onDocumentSelect, className }: FolderTreeProps) => {
  const { data: folders, error } = useSWR<Folder[]>(`/api/folders?userId=${userId}`, fetcher, {
    refreshInterval: 60000, // Revalidate every 60 seconds
  });

  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({})
  const [isHover, setIsHover] = useState<{ [key: string]: boolean }>({})
  const [editIcons, setEditIcons] = useState<{ [key: string]: boolean }>({})

  const router = useRouter()

  if (error) {

    //router.push('/sign-in')
    return (
    <div className='rounded-l-lg p-4 h-full flex flex-col justify-center items-center bg-slate-800'>
      <h1 className='flex text-2xl font-bold mb-4 text-light-heading dark:text-light-background gap-2'>
        No Data
        <CircleSlashedIcon size={30} style={{color: '#ffffff', opacity: '50%'}}/>
      </h1>
      <p className='text-light-text dark:text-dark-text'>No Connection</p>
    </div>)
    }
  if (!folders) return <LoadingSpinner/>

  const toggleFolder = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  }

  const handleMouseEnter = (id: string) => {
    setIsHover(prev => ({ ...prev, [id]: true }));
  }

  const handleMouseLeave = (id: string) => {
    setIsHover(prev => ({ ...prev, [id]: false }));
  }

  const toggleEditIcon = (document: Document) => {
    setEditIcons(prev => ({ ...prev, [document.id]: !prev[document.id] }));
    onDocumentSelect(document);
  }

  const renderFolder = (folder: Folder) => {
    return (
      <li key={folder.id} className="ml-4">
        <div
          onClick={() => toggleFolder(folder.id)}
          className="flex items-center cursor-pointer hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200 p-2"
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
                    className={`flex justify-between items-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 rounded-lg p-2 cursor-pointer ${editIcons[document.id] ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                    onMouseEnter={() => handleMouseEnter(document.id)}
                    onMouseLeave={() => handleMouseLeave(document.id)}
                    onClick={() => toggleEditIcon(document)}
                  >
                    <div>

                    <div className='flex items-center'>
                      <File size={16} />
                      <span className="ml-2">{document.title}</span>
                      {isHover[document.id] && (
                        <div className="ml-2 cursor-pointer">
                          {editIcons[document.id] ? <Edit3 size={16} /> : <EditIcon size={16} />}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="pl-8 text-[9px] text-gray-400 dark:text-dark-text no-underline">
                        Last updated: {new Date(document.updatedAt).toLocaleString()}
                      </p>
                    </div>
                    {/*<div>{}</div>*/}
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
    <div className={`container h-full mx-auto p-4 bg-light-background dark:bg-dark-background rounded-lg shadow-lg bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-600 dark:to-slate-700 ${className}`}>
      <h2 className="text-2xl font-bold mb-4 text-light-heading dark:text-dark-heading">Folders</h2>
      <ul className="space-y-2">{folders.map(renderFolder)}</ul>
    </div>
  )
}

export default FolderTree
