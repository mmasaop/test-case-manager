import React, { useState, useEffect } from 'react';
import { useFileSystemContext } from '@/contexts/FileSystemContext';
import { FileTree } from '../FileTree/FileTree';
import { FileSearch } from '../FileTree/FileSearch';
import { useFileSearch } from '@/hooks/useFileSearch';

export function Sidebar() {
  const { 
    isSupported, 
    rootHandle, 
    files, 
    openDirectory, 
    openFile,
    isLoading,
    error 
  } = useFileSystemContext();
  
  const { searchQuery, setSearchQuery, filterNodes } = useFileSearch(files, rootHandle);
  const [filteredFiles, setFilteredFiles] = useState(files);
  const [isSearching, setIsSearching] = useState(false);

  // 検索クエリまたはファイル一覧が変更されたときにフィルタリング
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery) {
        setFilteredFiles(files);
        return;
      }

      setIsSearching(true);
      try {
        const filtered = await filterNodes(files, searchQuery);
        setFilteredFiles(filtered);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [searchQuery, files, filterNodes]);

  const handleOpenFolder = async () => {
    await openDirectory();
  };

  if (!isSupported) {
    return (
      <div className="p-4">
        <div className="text-sm text-destructive">
          このブラウザはFile System Access APIをサポートしていません。
          Chrome/Edge 86+をご使用ください。
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 h-full flex flex-col">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">テストケース管理</h2>
        <p className="text-sm text-muted-foreground">
          MDXファイルの編集・閲覧
        </p>
      </div>

      <div className="space-y-2">
        <button
          className="w-full px-4 py-2 text-sm font-medium text-left rounded-md hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleOpenFolder}
          disabled={isLoading}
        >
          📁 フォルダを開く
        </button>
        
        {rootHandle && (
          <div className="text-xs text-muted-foreground px-4">
            現在のフォルダ: {rootHandle.name}
          </div>
        )}
      </div>

      {error && (
        <div className="text-sm text-destructive px-4">
          エラー: {error}
        </div>
      )}

      <div className="border-t pt-4 flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-2 px-4">
          <h3 className="text-sm font-medium">ファイル一覧</h3>
          {searchQuery && (
            <span className="text-xs text-muted-foreground">
              {filteredFiles.length}件
            </span>
          )}
        </div>
        
        {files.length > 0 && (
          <FileSearch 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}
        
        {files.length > 0 ? (
          <div className="overflow-y-auto flex-1">
            {isSearching ? (
              <div className="text-sm text-muted-foreground px-4 py-2">
                検索中...
              </div>
            ) : searchQuery && filteredFiles.length === 0 ? (
              <div className="text-sm text-muted-foreground px-4 py-2">
                "{searchQuery}" に一致するファイルが見つかりません
              </div>
            ) : (
              <FileTree 
                nodes={filteredFiles} 
                onFileClick={openFile}
              />
            )}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground px-4">
            {rootHandle ? 'MDXファイルが見つかりません' : 'フォルダを選択してください'}
          </div>
        )}
      </div>
    </div>
  );
}