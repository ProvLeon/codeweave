// components/FolderTree.tsx
"use client"

import { useEffect, useState } from 'react'
import { Folder, FolderOpen, File, Edit3, EditIcon, ChevronRight, ChevronDown, CircleSlashedIcon, TrashIcon, FileIcon, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import LoadingSpinner from './LoadingSpinner';
import CreateFileUi from './CreateFileUi';
//import { Input } from './ui/input';

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => res.json());

interface Document {
  id: string
  title: string
  content: string
  folderId: string
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

  const [newfolders, setNewFolders] = useState<Folder[]>([]);

  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({})
  const [isHover, setIsHover] = useState<{ [key: string]: boolean }>({})
  const [editIcons, setEditIcons] = useState<{ [key: string]: boolean }>({})
  const [showCreateFileUi, setShowCreateFileUi] = useState(false)
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [newDocumentTitle, setNewDocumentTitle] = useState<string>('');
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  const router = useRouter()
  useEffect(() => {
    if (folders) {
      setNewFolders(folders);
    }
  }, [folders]);

  if (error) {

    //router.push('/sign-in')
    return (
    <div className='rounded-l-lg p-4 h-full flex flex-col justify-center items-center dark:bg-slate-800 bg-slate-200'>
      <h1 className='flex text-2xl font-bold mb-4 text-light-heading dark:text-light-background gap-2'>
        No Data
        <CircleSlashedIcon size={30} className="text-light-heading dark:text-light-background" />
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

  const createFolder = async () => {
    const response = await fetch("/api/folders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "New Folder",
      }),
    });
    if (response.ok) {
      router.refresh();
    }
  }

  const createDocument = async (folderId: string) => {
    const response = await fetch("/api/documents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "New Document",
        content: "",
        folderId: folderId,
      }),
    });
    if (response.ok) {
      router.refresh();
    }
  }

  const deleteDocument = async (document: Document) => {
    if (window.confirm(`Are you sure you want to delete ${document.title}?`)) {
      try {
        const response = await fetch(`/api/documents/${document.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          router.refresh();
        } else {
          const data = await response.json();
          console.error('Failed to delete document:', data.error);
        }
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };

  const handleFolderDoubleClick = (folder: Folder) => {
    setEditingFolderId(folder.id);
    setNewFolderName(folder.name);
  };

  const handleDocumentDoubleClick = (document: Document) => {
    setEditingDocumentId(document.id);
    setNewDocumentTitle(document.title);
  };

  const handleFolderNameChange = async (folderId: string) => {
    await fetch(`/api/folders/${folderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newFolderName,
      }),
    });
    setEditingFolderId(null);
    router.refresh();
  };

  const handleDocumentTitleChange = async (documentId: string) => {
    await fetch(`/api/documents/${documentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newDocumentTitle,
      }),
    });
    setEditingDocumentId(null);
    router.refresh();
  };

  const handleDocumentClick = (document: Document) => {
    setSelectedDocumentId(document.id);
    onDocumentSelect(document);
  };

  const renderFolder = (folder: Folder) => {
    return (
      <li key={folder.id} className="ml-4">
        <div
          onClick={() => toggleFolder(folder.id)}
          onDoubleClick={() => handleFolderDoubleClick(folder)}
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
          {editingFolderId === folder.id ? (
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onBlur={() => handleFolderNameChange(folder.id)}
              className="ml-2 outline-nonebg-transparent border-b border-blue-500 focus:outline-none"
            />
          ) : (
            <span className="ml-2">{folder.name} ({folder.documents.length})</span>
          )}
          <Plus size={16} className="ml-2 cursor-pointer" onClick={() => createDocument(folder.id)} />
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
                    className={`flex justify-between items-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 rounded-lg p-2 cursor-pointer ${selectedDocumentId === document.id ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                    onMouseEnter={() => handleMouseEnter(document.id)}
                    onMouseLeave={() => handleMouseLeave(document.id)}
                    onClick={() => handleDocumentClick(document)}
                    onDoubleClick={() => handleDocumentDoubleClick(document)}
                  >
                    <div>
                      <div className='flex items-center gap-2'>
                        <File size={16} />
                        {editingDocumentId === document.id ? (
                          <input
                            type="text"
                            value={newDocumentTitle}
                            onChange={(e) => setNewDocumentTitle(e.target.value)}
                            onBlur={() => handleDocumentTitleChange(document.id)}
                            className="ml-2 bg-transparent border-b border-blue-500 focus:outline-none"
                          />
                        ) : (
                          <span className="ml-2">{document.title}</span>
                        )}
                        {isHover[document.id] && (
                          <div className="ml-2 cursor-pointer">
                            {editIcons[document.id] ? <Edit3 size={16} /> : <EditIcon size={16} />}
                          </div>
                        )}
                        <div onClick={() => deleteDocument(document)} className="ml-2 cursor-pointer">
                          <TrashIcon size={16} className="text-red-400" />
                        </div>
                      </div>
                      <div>
                        <p className="pl-8 text-[9px] text-gray-400 dark:text-dark-text no-underline">
                          Last updated: {new Date(document.updatedAt).toLocaleString()}
                        </p>
                      </div>
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
      <div>
        <h2 className="text-2xl font-bold mb-4 text-light-heading dark:text-dark-heading flex items-center">
          Folders
          <Plus size={24} className="ml-2 cursor-pointer" onClick={createFolder} />
        </h2>
        {/*<FileIcon size={30} className="mb-4 cursor-pointer" onClick={() => setShowCreateFileUi(true)}/>*/}
        {/*{showCreateFileUi && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <CreateFileUi userId={userId} />
              <button
                onClick={() => setShowCreateFileUi(false)}
                className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Close
              </button>
            </div>
          </div>
        )}*/}
      </div>
      <ul className="space-y-2">{folders.map(renderFolder)}</ul>
    </div>
  )
}

export default FolderTree
