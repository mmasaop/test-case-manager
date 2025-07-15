import { useEffect, useState } from 'react';
import { useFileSystemContext } from '@/contexts/FileSystemContext';

export function useImageLoader(content: string, currentFilePath: string | undefined) {
  const { rootHandle } = useFileSystemContext();
  const [imageUrls, setImageUrls] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    if (!content || !currentFilePath || !rootHandle) return;

    const loadImages = async () => {
      const imageRegex = /!\[.*?\]\((\.\/[^)]+)\)/g;
      const matches = Array.from(content.matchAll(imageRegex));
      
      const newImageUrls = new Map<string, string>();

      for (const match of matches) {
        const relativePath = match[1];
        const imageName = relativePath.replace('./', '');
        
        try {
          // 現在のファイルのディレクトリパスを取得
          const currentDir = currentFilePath.substring(0, currentFilePath.lastIndexOf('/'));
          const imagePath = currentDir ? `${currentDir}/${imageName}` : imageName;
          
          // ファイルハンドルを取得
          const pathParts = imagePath.split('/').filter(part => part);
          let dirHandle = rootHandle;
          
          // ディレクトリを辿る
          for (let i = 0; i < pathParts.length - 1; i++) {
            dirHandle = await dirHandle.getDirectoryHandle(pathParts[i]);
          }
          
          // ファイルを取得
          const fileHandle = await dirHandle.getFileHandle(pathParts[pathParts.length - 1]);
          const file = await fileHandle.getFile();
          const url = URL.createObjectURL(file);
          
          newImageUrls.set(relativePath, url);
        } catch (error) {
          console.error(`Failed to load image: ${relativePath}`, error);
        }
      }

      setImageUrls(newImageUrls);
    };

    loadImages();

    // クリーンアップ
    return () => {
      imageUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [content, currentFilePath, rootHandle]);

  return imageUrls;
}