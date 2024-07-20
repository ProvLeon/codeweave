import React, { createContext, useContext, useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { Folder } from '@/types';

interface ProjectContextProps {
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  refreshFolders: () => void;
}

const ProjectContext = createContext<ProjectContextProps | undefined>(undefined);

export const ProjectProvider: React.FC<React.PropsWithChildren<{ userId: string; projectId: string | string[] }>> = ({ children, userId, projectId }) => {
  const { data: folders, error } = useSWR<Folder[]>(`/api/folders?userId=${userId}&projectId=${projectId}`, fetcher, {
    refreshInterval: 60000,
  });

  const [localFolders, setLocalFolders] = useState<Folder[]>([]);

  useEffect(() => {
    if (folders) {
      setLocalFolders(folders);
    }
  }, [folders]);

  const refreshFolders = () => {
    mutate(`/api/folders?userId=${userId}&projectId=${projectId}`);
  };

  return (
    <ProjectContext.Provider value={{ folders: localFolders, setFolders: setLocalFolders, refreshFolders }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

const fetcher = (url: string) => fetch(url).then(res => res.json());
