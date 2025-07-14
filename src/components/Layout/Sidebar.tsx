import React from 'react';
import { useFileSystemContext } from '@/contexts/FileSystemContext';
import { FileTree } from '../FileTree/FileTree';

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

      <div className="border-t pt-4 flex-1 overflow-hidden">
        <h3 className="text-sm font-medium mb-2 px-4">ファイル一覧</h3>
        {files.length > 0 ? (
          <div className="overflow-y-auto h-full">
            <FileTree 
              nodes={files} 
              onFileClick={openFile}
            />
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