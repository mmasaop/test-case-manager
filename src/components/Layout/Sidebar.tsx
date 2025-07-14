import React from 'react';

export function Sidebar() {
  return (
    <div className="p-4 space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">テストケース管理</h2>
        <p className="text-sm text-muted-foreground">
          MDXファイルの編集・閲覧
        </p>
      </div>

      <div className="space-y-2">
        <button
          className="w-full px-4 py-2 text-sm font-medium text-left rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          onClick={() => {
            // TODO: フォルダ選択機能の実装
            console.log('フォルダを選択');
          }}
        >
          📁 フォルダを開く
        </button>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-sm font-medium mb-2">ファイル一覧</h3>
        <div className="text-sm text-muted-foreground">
          フォルダを選択してください
        </div>
      </div>
    </div>
  );
}