import React from 'react';

export function DebugPanel() {
  const [folderPath, setFolderPath] = React.useState('');
  
  const handleNavigate = () => {
    if (folderPath) {
      const encodedPath = encodeURIComponent(folderPath);
      window.location.href = `/?folder=${encodedPath}`;
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-lg shadow-lg p-4 w-96">
      <h3 className="text-sm font-semibold mb-2">デバッグパネル</h3>
      <div className="space-y-2">
        <div>
          <label className="text-xs text-muted-foreground">フォルダパス指定</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={folderPath}
              onChange={(e) => setFolderPath(e.target.value)}
              placeholder="/home/user/test-cases"
              className="flex-1 px-2 py-1 text-sm border rounded"
            />
            <button
              onClick={handleNavigate}
              className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              移動
            </button>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          <p>使用例:</p>
          <code className="block bg-muted px-2 py-1 rounded mt-1">
            /?folder=/home/masao/src/test-case-manager/test-cases2
          </code>
        </div>
      </div>
    </div>
  );
}