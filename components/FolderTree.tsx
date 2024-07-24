import { useEffect, useState } from 'react';
import { Folder, FolderOpen, File, Edit3, EditIcon, ChevronRight, ChevronDown, CircleSlashedIcon, TrashIcon, Plus } from 'lucide-react';
//import { useRouter } from 'next/navigation';
import { useProject } from '@/contexts/ProjectContext';
import LoadingSpinner from './LoadingSpinner';
//import CreateFileUi from './CreateFileUi';
import { Folder as FolderType, Document as DocumentType } from '@/types';

interface FolderTreeProps {
  userId: string;
  onDocumentSelect: (document: DocumentType) => void;
  className?: string;
  projectId: string | string[];
}

const FolderTree = ({ userId, onDocumentSelect, className, projectId }: FolderTreeProps) => {
  const { folders, setFolders, refreshFolders } = useProject();
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [isHover, setIsHover] = useState<{ [key: string]: boolean }>({});
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [newDocumentTitle, setNewDocumentTitle] = useState<string>('');
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState<string>('');
  //const [localDocuments, setLocalDocuments] = useState<{ [key: string]: Document }>({});

  //const router = useRouter();

  if (!folders) return <LoadingSpinner />;

  const toggleFolder = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleMouseEnter = (id: string) => {
    setIsHover(prev => ({ ...prev, [id]: true }));
  };

  const handleMouseLeave = (id: string) => {
    setIsHover(prev => ({ ...prev, [id]: false }));
  };

  const getNextFolderName = (baseName: string) => {
    let maxNumber = 0;
    folders.forEach((folder: FolderType) => {
      const match = folder.name.match(new RegExp(`${baseName}(\\d+)`));
      if (match) {
        const number = parseInt(match[1], 10);
        if (number > maxNumber) {
          maxNumber = number;
        }
      }
    });
    return `${baseName}${maxNumber + 1}`;
  };

  const getNextDocumentTitle = (baseTitle: string, folderId: string) => {
    let maxNumber = 0;
    const folder = folders.find(folder => folder.id === folderId);
    folder?.documents.forEach(document => {
      const match = document.title.match(new RegExp(`${baseTitle}(\\d+)`));
      if (match) {
        const number = parseInt(match[1], 10);
        if (number > maxNumber) {
          maxNumber = number;
        }
      }
    });
    return `${baseTitle}${maxNumber + 1}`;
  };

  const createFolder = async () => {
    const newFolderName = await getNextFolderName("Folder");
    const response = await fetch("/api/folders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newFolderName,
        projectId: projectId,
        ownerId: userId,
      }),
    });

    if (response.ok) {
      const newFolder = await response.json();
      setFolders(prev => [...prev, newFolder]);
      refreshFolders();
    }
  };

  const createDocument = async (folderId: string) => {
    const newDocumentTitle = await getNextDocumentTitle("Document", folderId);
    const response = await fetch("/api/documents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newDocumentTitle,
        content: "",
        folderId: folderId,
        ownerId: userId,
      }),
    });

    if (response.ok) {
      const newDocument = await response.json();
      //console.log("newDocument", newDocument);
      setFolders(prev => {
        const updatedFolders = prev.map(folder => {
          if (folder.id === folderId) {
            return { ...folder, documents: [...folder.documents, newDocument.document] };
          }
          return folder;
        });
        return updatedFolders;
      });
      //setLocalDocuments(prev => ({ ...prev, [newDocument.id]: newDocument }));
      setNewDocumentTitle(newDocumentTitle);
      refreshFolders();
    }
  };

  const deleteDocument = async (document: DocumentType) => {
    if (window.confirm(`Are you sure you want to delete ${document.title}?`)) {
      try {
        const response = await fetch(`/api/documents/${document.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setFolders(prev => {
            const updatedFolders = prev.map(folder => {
              if (folder.id === document.folderId) {
                return { ...folder, documents: folder.documents.filter(doc => doc.id !== document.id) };
              }
              return folder;
            });
            return updatedFolders;
          });
          refreshFolders();
        } else {
          const data = await response.json();
          console.error('Failed to delete document:', data.error);
        }
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };

  const deleteFolder = async (folder: FolderType) => {
    if (window.confirm(`Are you sure you want to delete ${folder.name} and all its contents?`)) {
      try {
        const response = await fetch(`/api/folders/${folder.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setFolders(prev => prev.filter(f => f.id !== folder.id));
          refreshFolders();
        } else {
          const data = await response.json();
          console.error('Failed to delete folder:', data.error);
        }
      } catch (error) {
        console.error('Error deleting folder:', error);
      }
    }
  };

  const handleFolderDoubleClick = (folder: FolderType) => {
    setEditingFolderId(folder.id);
    setNewFolderName(folder.name);
  };

  const handleDocumentDoubleClick = (document: DocumentType) => {
    setEditingDocumentId(document.id);
    setNewDocumentTitle(document.title);
  };

  const handleFolderNameChange = async (folderId: string) => {
    setFolders(prev => prev.map(folder => folder.id === folderId ? { ...folder, name: newFolderName } : folder));
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
    setFolders(prev => prev.map(folder => folder.id === folderId ? { ...folder, name: newFolderName } : folder));
    refreshFolders();
  };

  const handleDocumentTitleChange = async (documentId: string) => {
    //setLocalDocuments(prev => ({ ...prev, [documentId]: { ...prev[documentId], title: newDocumentTitle } }));
    setFolders(prev => {
      const updatedFolders = prev.map(folder => {
        if (folder.documents.some(doc => doc.id === documentId)) {
          return {
            ...folder,
            documents: folder.documents.map(doc => doc.id === documentId ? { ...doc, title: newDocumentTitle } : doc)
          };
        }
        return folder;
      });
      return updatedFolders;
    });
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
    refreshFolders();
  };

  const inviteCollaborator = async (documentId: string) => {
    const response = await fetch(`/api/documents/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ documentId, inviteEmail }),
    });

    if (response.ok) {
      alert('User invited successfully');
    } else {
      alert('Failed to invite user');
    }
  };
  const handleDocumentClick = (document: DocumentType) => {
    setSelectedDocumentId(document.id);
    onDocumentSelect(document);
  };

  const renderFolder = (folder: FolderType) => {
    return (
      <li key={folder.id} className="ml-4">
        <div
          onClick={() => toggleFolder(folder.id)}
          onDoubleClick={() => handleFolderDoubleClick(folder)}
          onMouseEnter={() => handleMouseEnter(folder.id)}
          onMouseLeave={() => handleMouseLeave(folder.id)}
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
              className="ml-2 bg-transparent border-b border-blue-500 focus:outline-none"
            />
          ) : (
            <span className="ml-2">{folder.name} ({folder.documents.length})</span>
          )}
          {isHover[folder.id] && (
            <>
          <Plus size={16} className="ml-2 cursor-pointer" onClick={() => createDocument(folder.id)} />
            <TrashIcon size={16} className="ml-2 cursor-pointer text-red-400" onClick={() => deleteFolder(folder)} />
            </>
          )}
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
                      <div className='flex items-center gap-2 relative'>
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
                        <div className='flex items-center gap-2 absolute right-0 top-0'>
                        {/*{isHover[document.id] && (
                          <div className="ml-2 cursor-pointer">
                            { <Edit3 size={16} /> }
                          </div>
                        )}*/}
                        {isHover[document.id] && (
                          <TrashIcon size={16} className="ml-2 cursor-pointer text-red-400" onClick={() => deleteDocument(document)} />
                        )}
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
      </div>
      <ul className="space-y-2">{Array.isArray(folders) && folders.map(renderFolder)}</ul>
    </div>
  )
}

export default FolderTree;
