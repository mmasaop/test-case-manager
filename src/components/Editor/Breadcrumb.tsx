import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useFileSystemContext } from '@/contexts/FileSystemContext';

interface BreadcrumbProps {
  onNavigate?: (path: string) => void;
}

export function Breadcrumb({ onNavigate }: BreadcrumbProps) {
  const { currentFile, rootHandle } = useFileSystemContext();
  
  if (!currentFile || !rootHandle) {
    return null;
  }

  // パスを分割してパンくずリストを生成
  const pathParts = currentFile.path.split('/');
  const breadcrumbs: { name: string; path: string }[] = [];
  
  // ルートフォルダ
  breadcrumbs.push({
    name: rootHandle.name,
    path: '',
  });

  // 各パス部分を追加
  let currentPath = '';
  pathParts.forEach((part, index) => {
    if (index < pathParts.length - 1) {
      // フォルダ
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      breadcrumbs.push({
        name: part,
        path: currentPath,
      });
    } else {
      // ファイル
      breadcrumbs.push({
        name: part,
        path: currentFile.path,
      });
    }
  });

  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground overflow-x-auto">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.path}>
          {index === 0 ? (
            <button
              onClick={() => onNavigate?.(crumb.path)}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Home className="h-3 w-3" />
              <span>{crumb.name}</span>
            </button>
          ) : index < breadcrumbs.length - 1 ? (
            <>
              <ChevronRight className="h-3 w-3" />
              <button
                onClick={() => onNavigate?.(crumb.path)}
                className="hover:text-foreground transition-colors"
              >
                {crumb.name}
              </button>
            </>
          ) : (
            <>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground font-medium">{crumb.name}</span>
            </>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}