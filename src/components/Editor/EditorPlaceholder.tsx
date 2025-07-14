import React from 'react';
import { useFileSystemContext } from '@/contexts/FileSystemContext';

export function EditorPlaceholder() {
  const { currentFile, isLoading } = useFileSystemContext();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/20">
        <div className="text-center space-y-4 p-8">
          <div className="text-6xl animate-pulse">⏳</div>
          <h2 className="text-xl font-semibold">読み込み中...</h2>
        </div>
      </div>
    );
  }

  if (currentFile) {
    return (
      <div className="h-full flex flex-col">
        <div className="border-b p-4">
          <h3 className="text-lg font-semibold">{currentFile.path}</h3>
        </div>
        <div className="flex-1 p-4 overflow-auto">
          <pre className="text-sm font-mono whitespace-pre-wrap">{currentFile.content}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center bg-muted/20">
      <div className="text-center space-y-4 p-8">
        <div className="text-6xl">📝</div>
        <h2 className="text-2xl font-semibold">エディタ</h2>
        <p className="text-muted-foreground max-w-md">
          左側のサイドバーからフォルダを開き、編集したいMDXファイルを選択してください。
        </p>
        <div className="pt-4 space-y-2 text-sm text-muted-foreground">
          <p>対応機能:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>MDX形式のファイル編集</li>
            <li>リアルタイムプレビュー</li>
            <li>画像・添付ファイルの参照</li>
            <li>Zennライクなエディタ体験</li>
          </ul>
        </div>
      </div>
    </div>
  );
}