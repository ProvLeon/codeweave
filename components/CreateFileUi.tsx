"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from './ui/input';

interface Folder {
  id: string;
  name: string;
  documents: Document[];
  subfolders: Folder[];
}

interface Document {
  id: string;
  title: string;
  updatedAt: string;
}

const CreateFileUi = ({ userId }: { userId: string }) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [documentTitle, setDocumentTitle] = useState<string>('');
  const [documentContent, setDocumentContent] = useState<string>('');
  const router = useRouter();

  const fetchFolders = async () => {
    const response = await fetch(`/api/folders?userId=${userId}`);
    const data = await response.json();
    if (response.ok) {
      setFolders(data);
    } else {
      setFolders([]);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, [userId]);

  const createDocument = async () => {
    if (!selectedFolderId || !documentTitle || !documentContent) {
      alert('Please select a folder and fill in the document title and content.');
      return;
    }

    await fetch("/api/documents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: documentTitle,
        content: documentContent,
        folderId: selectedFolderId,
      }),
    });
    router.refresh();
  };

  const renderFolderOptions = (folder: Folder) => {
    return (
      <option key={folder.id} value={folder.id}>
        {folder.name}
      </option>
    );
  };

  return (
    <div className="container mx-auto p-4 bg-light-background dark:bg-dark-background rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-light-heading dark:text-dark-heading">Create Document</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Folder</label>
        <select
          value={selectedFolderId || ''}
          onChange={(e) => setSelectedFolderId(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="" disabled>Select a folder</option>
          {folders.map(renderFolderOptions)}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Document Title</label>
        <Input
          type="text"
          value={documentTitle}
          onChange={(e) => setDocumentTitle(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Document Content</label>
        <textarea
          value={documentContent}
          onChange={(e) => setDocumentContent(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        />
      </div>
      <button
        onClick={createDocument}
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Create Document
      </button>
    </div>
  );
};

export default CreateFileUi;

