import { useState, useCallback } from 'react';
import {
  FileNode,
  isFileSystemAccessSupported,
  selectDirectory,
  readDirectory,
  readFile,
  writeFile,
  getFileHandle,
} from '@/lib/fileSystem';

export interface UseFileSystemReturn {
  isSupported: boolean;
  rootHandle: FileSystemDirectoryHandle | null;
  files: FileNode[];
  currentFile: {
    path: string;
    content: string;
    handle: FileSystemFileHandle;
  } | null;
  isLoading: boolean;
  error: string | null;
  openDirectory: () => Promise<void>;
  openFile: (path: string) => Promise<void>;
  saveFile: (content: string) => Promise<void>;
  refreshFiles: () => Promise<void>;
}

export function useFileSystem(): UseFileSystemReturn {
  const [rootHandle, setRootHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [files, setFiles] = useState<FileNode[]>([]);
  const [currentFile, setCurrentFile] = useState<{
    path: string;
    content: string;
    handle: FileSystemFileHandle;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSupported = isFileSystemAccessSupported();

  const openDirectory = useCallback(async () => {
    if (!isSupported) {
      setError('File System Access API is not supported in this browser');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const handle = await selectDirectory();
      if (!handle) {
        setIsLoading(false);
        return;
      }

      setRootHandle(handle);
      const fileTree = await readDirectory(handle);
      setFiles(fileTree);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open directory');
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const openFile = useCallback(async (path: string) => {
    if (!rootHandle) {
      setError('No directory selected');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fileHandle = await getFileHandle(rootHandle, path);
      if (!fileHandle) {
        throw new Error('File not found');
      }

      const content = await readFile(fileHandle);
      setCurrentFile({
        path,
        content,
        handle: fileHandle,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open file');
    } finally {
      setIsLoading(false);
    }
  }, [rootHandle]);

  const saveFile = useCallback(async (content: string) => {
    if (!currentFile) {
      setError('No file is currently open');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await writeFile(currentFile.handle, content);
      setCurrentFile({
        ...currentFile,
        content,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save file');
    } finally {
      setIsLoading(false);
    }
  }, [currentFile]);

  const refreshFiles = useCallback(async () => {
    if (!rootHandle) return;

    setIsLoading(true);
    setError(null);

    try {
      const fileTree = await readDirectory(rootHandle);
      setFiles(fileTree);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh files');
    } finally {
      setIsLoading(false);
    }
  }, [rootHandle]);

  return {
    isSupported,
    rootHandle,
    files,
    currentFile,
    isLoading,
    error,
    openDirectory,
    openFile,
    saveFile,
    refreshFiles,
  };
}