import { create } from 'zustand';
import { FileNode } from '@/lib/fileSystem';

interface FileStore {
  rootHandle: FileSystemDirectoryHandle | null;
  files: FileNode[];
  currentFile: {
    path: string;
    content: string;
    handle: FileSystemFileHandle;
  } | null;
  selectedPath: string | null;
  
  setRootHandle: (handle: FileSystemDirectoryHandle | null) => void;
  setFiles: (files: FileNode[]) => void;
  setCurrentFile: (file: FileStore['currentFile']) => void;
  setSelectedPath: (path: string | null) => void;
  clearAll: () => void;
}

export const useFileStore = create<FileStore>((set) => ({
  rootHandle: null,
  files: [],
  currentFile: null,
  selectedPath: null,
  
  setRootHandle: (handle) => set({ rootHandle: handle }),
  setFiles: (files) => set({ files }),
  setCurrentFile: (file) => set({ currentFile: file, selectedPath: file?.path || null }),
  setSelectedPath: (path) => set({ selectedPath: path }),
  clearAll: () => set({
    rootHandle: null,
    files: [],
    currentFile: null,
    selectedPath: null,
  }),
}));