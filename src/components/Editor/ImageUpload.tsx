import React, { useRef } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { useFileSystemContext } from '@/contexts/FileSystemContext';

interface ImageUploadProps {
  onImageInsert: (markdown: string) => void;
}

export function ImageUpload({ onImageInsert }: ImageUploadProps) {
  const { currentFile, rootHandle } = useFileSystemContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentFile || !rootHandle) return;

    try {
      // 現在のファイルのディレクトリを取得
      const currentDir = currentFile.path.substring(0, currentFile.path.lastIndexOf('/'));
      const pathParts = currentDir.split('/');
      
      let dirHandle = rootHandle;
      for (const part of pathParts) {
        if (part) {
          dirHandle = await dirHandle.getDirectoryHandle(part);
        }
      }

      // 画像ファイルを保存
      const fileHandle = await dirHandle.getFileHandle(file.name, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(file);
      await writable.close();

      // Markdownの画像構文を挿入
      const markdown = `![${file.name}](./${file.name})`;
      onImageInsert(markdown);

      // ファイル入力をリセット
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Failed to save image:', error);
      alert('画像の保存に失敗しました');
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="p-1.5 hover:bg-accent hover:text-accent-foreground rounded transition-colors"
        title="画像を挿入"
      >
        <ImageIcon className="w-4 h-4" />
      </button>
    </>
  );
}