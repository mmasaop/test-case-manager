import React, { useEffect, useState } from 'react';
import { FileNode } from '@/lib/fileSystem';
import { Download, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AttachmentViewerProps {
  file: {
    path: string;
    content?: string;
    handle: FileSystemFileHandle;
  };
}

export function AttachmentViewer({ file }: AttachmentViewerProps) {
  const [content, setContent] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'text' | 'archive' | 'other'>('other');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filename = file.path.split('/').pop() || '';

  useEffect(() => {
    const loadFile = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const ext = filename.split('.').pop()?.toLowerCase();
        
        // ファイルタイプを判定
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) {
          setFileType('image');
          const fileObj = await file.handle.getFile();
          const url = URL.createObjectURL(fileObj);
          setImageUrl(url);
        } else if (['txt', 'log', 'json', 'xml', 'csv', 'yaml', 'yml'].includes(ext || '')) {
          setFileType('text');
          const fileObj = await file.handle.getFile();
          const text = await fileObj.text();
          setContent(text);
        } else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext || '')) {
          setFileType('archive');
        } else {
          setFileType('other');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'ファイルの読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    loadFile();

    // クリーンアップ
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [file, filename]);

  const handleDownload = async () => {
    try {
      const fileObj = await file.handle.getFile();
      const url = URL.createObjectURL(fileObj);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('ダウンロードに失敗しました');
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-muted-foreground">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-destructive">{error}</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* ヘッダー */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {fileType === 'image' ? (
              <ImageIcon className="h-5 w-5" />
            ) : (
              <FileText className="h-5 w-5" />
            )}
            <h2 className="text-lg font-semibold">{filename}</h2>
          </div>
          <Button
            onClick={handleDownload}
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            ダウンロード
          </Button>
        </div>
      </div>

      {/* コンテンツエリア */}
      <div className="flex-1 overflow-auto p-4">
        {fileType === 'image' && imageUrl && (
          <div className="flex items-center justify-center h-full">
            <img
              src={imageUrl}
              alt={filename}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}

        {fileType === 'text' && content && (
          <pre className="whitespace-pre-wrap font-mono text-sm">{content}</pre>
        )}

        {fileType === 'archive' && (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <FileText className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground">このファイルはプレビューできません</p>
            <Button onClick={handleDownload} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              ダウンロード
            </Button>
          </div>
        )}

        {fileType === 'other' && (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <FileText className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground">このファイル形式はサポートされていません</p>
            <Button onClick={handleDownload} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              ダウンロード
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}