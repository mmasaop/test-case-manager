import React, { createContext, useContext, ReactNode } from 'react';
import { useFileSystem, UseFileSystemReturn } from '@/hooks/useFileSystem';

const FileSystemContext = createContext<UseFileSystemReturn | null>(null);

export function FileSystemProvider({ children }: { children: ReactNode }) {
  const fileSystem = useFileSystem();
  
  return (
    <FileSystemContext.Provider value={fileSystem}>
      {children}
    </FileSystemContext.Provider>
  );
}

export function useFileSystemContext() {
  const context = useContext(FileSystemContext);
  if (!context) {
    throw new Error('useFileSystemContext must be used within FileSystemProvider');
  }
  return context;
}