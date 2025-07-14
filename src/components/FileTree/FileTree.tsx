import React, { useState, useEffect } from 'react';
import { FileNode } from '@/lib/fileSystem';
import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFileSystemContext } from '@/contexts/FileSystemContext';

interface FileTreeProps {
  nodes: FileNode[];
  onFileClick: (path: string) => void;
  level?: number;
}

export function FileTree({ nodes, onFileClick, level = 0 }: FileTreeProps) {
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
}

function FileTreeNode({ node, onFileClick, level, currentPath }: FileTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const [testTitle, setTestTitle] = useState<string | null>(null);

  // 現在のファイルまたはその親フォルダかどうかをチェック
  const isCurrentFile = node.type === 'file' && node.path === currentPath;
  const isParentOfCurrent = node.type === 'directory' && currentPath.startsWith(node.path + '/');

  // テストケースのタイトルを取得（連番フォルダの場合）
  useEffect(() => {
    const fetchTestTitle = async () => {
      if (node.type === 'directory' && /^\d{4}$/.test(node.name)) {
        // 連番フォルダの場合、case.mdxファイルからタイトルを取得
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
    };
    fetchTestTitle();
  }, [node]);

  const handleClick = () => {
    if (node.type === 'directory') {
      setIsExpanded(!isExpanded);
    } else {
      onFileClick(node.path);
    }
  };

  const paddingLeft = `${level * 12 + 8}px`;

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
            {isExpanded ? (
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
        <span className="truncate flex-1">
          {node.name}
          {testTitle && (
            <span className="ml-2 text-xs text-muted-foreground">
              - {testTitle}
            </span>
          )}
        </span>
      </div>

      {node.type === 'directory' && isExpanded && node.children && (
        <FileTree
          nodes={node.children}
          onFileClick={onFileClick}
          level={level + 1}
        />
      )}
    </>
  );
}