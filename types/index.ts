interface Document {
  id: string;
  title: string;
  content: string;
  folderId: string;
  updatedAt: string;
}


interface Folder {
  id: string;
  name: string;
  parentId: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  subfolders: Folder[];
  documents: Document[];
}

export type { Folder, Document };
