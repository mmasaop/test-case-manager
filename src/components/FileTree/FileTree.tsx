import React, { useState, useEffect } from 'react';
import { FileNode } from '@/lib/fileSystem';
import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen, Image } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFileSystemContext } from '@/contexts/FileSystemContext';

interface FileTreeProps {
  nodes: FileNode[];
  onFileClick: (path: string) => void;
  level?: number;
  isSearching?: boolean;
}

export function FileTree({ nodes, onFileClick, level = 0, isSearching = false }: FileTreeProps) {
  const { currentFile } = useFileSystemContext();
  const currentPath = currentFile?.path || '';

  return (
    <div className="select-none">
      {nodes.map((node) => (
        <FileTreeNode
          key={node.path}
          node={node}
          onFileClick={onFileClick}
          level={level}
          currentPath={currentPath}
          isSearching={isSearching}
        />
      ))}
    </div>
  );
}

interface FileTreeNodeProps {
  node: FileNode;
  onFileClick: (path: string) => void;
  level: number;
  currentPath: string;
  isSearching: boolean;
}

function FileTreeNode({ node, onFileClick, level, currentPath, isSearching }: FileTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const [testTitle, setTestTitle] = useState<string | null>(null);
  const [groupName, setGroupName] = useState<string | null>(null);

  // 現在のファイルまたはその親フォルダかどうかをチェック
  const isCurrentFile = node.type === 'file' && node.path === currentPath;
  const isParentOfCurrent = node.type === 'directory' && currentPath.startsWith(node.path + '/');

  // テストケースのタイトルまたはグループ名を取得
  useEffect(() => {
    const fetchMetadata = async () => {
      if (node.type === 'directory') {
        // meta.mdxからグループ名を取得
        const metaFile = node.children?.find(child => child.name === 'meta.mdx' || child.name === 'meta.md');
        if (metaFile && metaFile.type === 'file') {
          try {
            const handle = metaFile.handle as FileSystemFileHandle;
            const file = await handle.getFile();
            const content = await file.text();
            // 最初の#見出しを取得
            const titleMatch = content.match(/^#\s+(.+)$/m);
            if (titleMatch) {
              setGroupName(titleMatch[1]);
            }
          } catch (error) {
            console.error('Failed to read group name:', error);
          }
        }
        
        // 連番フォルダの場合、case.mdxファイルからタイトルを取得
        if (/^\d{4}$/.test(node.name)) {
          const caseFile = node.children?.find(child => child.name === 'case.mdx' || child.name === 'case.md');
          if (caseFile && caseFile.type === 'file') {
            try {
              const handle = caseFile.handle as FileSystemFileHandle;
              const file = await handle.getFile();
              const content = await file.text();
              // 最初の#見出しを取得
              const titleMatch = content.match(/^#\s+(.+)$/m);
              if (titleMatch) {
                setTestTitle(titleMatch[1]);
              }
            } catch (error) {
              console.error('Failed to read test title:', error);
            }
          }
        }
      }
    };
    fetchMetadata();
  }, [node]);

  // case.mdxファイルを持つディレクトリかチェック
  const hasCaseMdx = node.type === 'directory' && 
    node.children?.some(child => child.type === 'file' && child.name === 'case.mdx');
  
  const handleClick = () => {
    if (node.type === 'directory') {
      setIsExpanded(!isExpanded);
      
      // case.mdxがある場合は自動的に開く
      if (hasCaseMdx) {
        const caseFile = node.children?.find(child => child.name === 'case.mdx');
        if (caseFile) {
          onFileClick(caseFile.path);
        }
      }
    } else {
      onFileClick(node.path);
    }
  };

  const paddingLeft = `${level * 12 + 8}px`;

  // フォルダ名のラベルマッピング
  const folderLabels: { [key: string]: string } = {
    'auth': '認証機能',
    'login': 'ログイン',
    'registration': '登録',
    'profile': 'プロフィール',
    'settings': '設定',
  };

  // 数字フォルダかどうかをチェック
  const isNumberedFolder = /^\d{4}$/.test(node.name);
  
  const displayName = folderLabels[node.name] ? `${folderLabels[node.name]}(${node.name})` : node.name;

  return (
    <>
      <div
        className={cn(
          "flex items-center gap-1 py-1 px-2 hover:bg-accent hover:text-accent-foreground cursor-pointer text-sm",
          "transition-colors duration-150",
          isCurrentFile && "bg-primary/10 text-primary font-medium",
          isParentOfCurrent && "bg-primary/5"
        )}
        style={{ paddingLeft }}
        onClick={handleClick}
      >
        {node.type === 'directory' && (
          <>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0" />
            )}
            {hasCaseMdx ? (
              <FileText className="h-4 w-4 shrink-0 text-purple-600" />
            ) : isExpanded ? (
              <FolderOpen className="h-4 w-4 shrink-0 text-blue-600" />
            ) : (
              <Folder className="h-4 w-4 shrink-0 text-blue-600" />
            )}
          </>
        )}
        {node.type === 'file' && (
          <>
            <div className="w-4" /> {/* スペーサー */}
            <FileText className="h-4 w-4 shrink-0 text-gray-600" />
          </>
        )}
        <span className="flex-1 min-w-0">
          <span 
            className="break-words"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {isNumberedFolder && testTitle ? (
              <>
                <span className="text-xs text-muted-foreground mr-2">{displayName}</span>
                <span className="text-sm text-foreground">{testTitle}</span>
              </>
            ) : (
              <>
                {displayName}
                {groupName && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({groupName})
                  </span>
                )}
                {testTitle && !isNumberedFolder && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    - {testTitle}
                  </span>
                )}
              </>
            )}
          </span>
        </span>
      </div>

      {node.type === 'directory' && isExpanded && (
        <>
          {/* 画像ファイルの表示 */}
          {node.imageFiles && node.imageFiles.length > 0 && (
            <div style={{ paddingLeft: `${(level + 1) * 12 + 8}px` }} className="py-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Image className="h-3 w-3" />
                <span>画像ファイル:</span>
                {node.imageFiles.map((img, idx) => (
                  <span key={img.path} className="text-xs">
                    {img.name}{idx < node.imageFiles!.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* 子ノードの表示（通常時はcase.mdxを除外、検索時は表示） */}
          {node.children && (
            <FileTree
              nodes={hasCaseMdx && !isSearching ? 
                node.children.filter(child => child.name !== 'case.mdx') : 
                node.children}
              onFileClick={onFileClick}
              level={level + 1}
              isSearching={isSearching}
            />
          )}
        </>
      )}
    </>
  );
}