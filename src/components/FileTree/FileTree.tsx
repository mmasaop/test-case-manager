import React, { useState } from 'react';
import { FileNode } from '@/lib/fileSystem.ts';
import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileTreeProps {
  nodes: FileNode[];
  onFileClick: (path: string) => void;
  level?: number;
}

export function FileTree({ nodes, onFileClick, level = 0 }: FileTreeProps) {
  return (
    <div className="select-none">
      {nodes.map((node) => (
        <FileTreeNode
          key={node.path}
          node={node}
          onFileClick={onFileClick}
          level={level}
        />
      ))}
    </div>
  );
}

interface FileTreeNodeProps {
  node: FileNode;
  onFileClick: (path: string) => void;
  level: number;
}

function FileTreeNode({ node, onFileClick, level }: FileTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);

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
          "transition-colors duration-150"
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
        <span className="truncate">{node.name}</span>
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