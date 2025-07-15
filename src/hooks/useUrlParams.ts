import { useEffect, useState } from 'react';

export function useUrlParams() {
  const [folderPath, setFolderPath] = useState<string | null>(null);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const path = params.get('folder');
    
    if (path) {
      // URLデコードしてパスを取得
      setFolderPath(decodeURIComponent(path));
    }
  }, []);
  
  return { folderPath };
}