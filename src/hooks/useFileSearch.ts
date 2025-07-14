import { useState, useMemo, useCallback } from 'react';
import { FileNode } from '@/lib/fileSystem';

export function useFileSearch(files: FileNode[], rootHandle: FileSystemDirectoryHandle | null) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCache, setSearchCache] = useState<Map<string, string>>(new Map());

  // ファイルの内容を取得してキャッシュ
  const getFileContent = useCallback(async (fileNode: FileNode): Promise<string> => {
    if (searchCache.has(fileNode.path)) {
      return searchCache.get(fileNode.path)!;
    }

    try {
      const handle = fileNode.handle as FileSystemFileHandle;
      const file = await handle.getFile();
      const content = await file.text();
      setSearchCache(prev => new Map(prev).set(fileNode.path, content));
      return content;
    } catch (error) {
      console.error('Failed to read file:', error);
      return '';
    }
  }, [searchCache]);

  // ノードが検索クエリにマッチするかチェック
  const matchesSearch = useCallback(async (node: FileNode, query: string): Promise<boolean> => {
    const lowerQuery = query.toLowerCase();
    
    // ファイル名でマッチ
    if (node.name.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    // MDXファイルの場合は内容も検索
    if (node.type === 'file' && (node.name.endsWith('.mdx') || node.name.endsWith('.md'))) {
      const content = await getFileContent(node);
      return content.toLowerCase().includes(lowerQuery);
    }

    return false;
  }, [getFileContent]);

  // フィルタリングされたファイルツリーを生成
  const filterNodes = useCallback(async (nodes: FileNode[], query: string): Promise<FileNode[]> => {
    if (!query) return nodes;

    const filteredNodes: FileNode[] = [];

    for (const node of nodes) {
      if (node.type === 'file') {
        const matches = await matchesSearch(node, query);
        if (matches) {
          filteredNodes.push(node);
        }
      } else if (node.type === 'directory' && node.children) {
        const filteredChildren = await filterNodes(node.children, query);
        if (filteredChildren.length > 0) {
          filteredNodes.push({
            ...node,
            children: filteredChildren,
          });
        }
      }
    }

    return filteredNodes;
  }, [matchesSearch]);

  // 検索クエリが変更されたときにキャッシュをクリア
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    if (!query) {
      setSearchCache(new Map());
    }
  }, []);

  return {
    searchQuery,
    setSearchQuery: handleSearchChange,
    filterNodes,
  };
}