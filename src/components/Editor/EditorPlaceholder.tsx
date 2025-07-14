import React from 'react';

export function EditorPlaceholder() {
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