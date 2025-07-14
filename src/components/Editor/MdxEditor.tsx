import React, { useCallback, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { EditorView } from '@codemirror/view';
import { useFileSystemContext } from '@/contexts/FileSystemContext';
import { MdxPreview } from './MdxPreview';
import { EditorToolbar } from './EditorToolbar';
import { Breadcrumb } from './Breadcrumb';

export function MdxEditor() {
  const { currentFile, saveFile, isLoading } = useFileSystemContext();
  const [content, setContent] = React.useState('');
  const [hasChanges, setHasChanges] = React.useState(false);

  useEffect(() => {
    if (currentFile) {
      setContent(currentFile.content);
      setHasChanges(false);
    }
  }, [currentFile]);

  const handleChange = useCallback((value: string) => {
    setContent(value);
    setHasChanges(true);
  }, []);

  const handleSave = useCallback(async () => {
    if (currentFile && hasChanges) {
      await saveFile(content);
      setHasChanges(false);
    }
  }, [currentFile, content, hasChanges, saveFile]);

  // Ctrl+S / Cmd+S でファイル保存
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  if (!currentFile) {
    return null;
  }

  const extensions = [
    markdown(),
    EditorView.theme({
      '&': {
        fontSize: '14px',
      },
      '.cm-content': {
        padding: '16px',
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
      },
      '.cm-focused .cm-cursor': {
        borderLeftColor: '#000',
      },
      '.cm-line': {
        padding: '0 2px 0 4px',
      },
    }),
    EditorView.lineWrapping,
  ];

  return (
    <div className="h-full flex flex-col bg-background">
      {/* ヘッダー */}
      <div className="border-b p-2 space-y-2">
        <div className="flex items-center justify-between">
          <Breadcrumb />
          <div className="flex items-center gap-2">
            <EditorToolbar />
            <button
              onClick={handleSave}
              disabled={!hasChanges || isLoading}
              className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              保存 (Ctrl+S)
            </button>
          </div>
        </div>
        {hasChanges && (
          <div className="text-xs text-muted-foreground px-2">
            ※ 未保存の変更があります
          </div>
        )}
      </div>

      {/* エディタとプレビューエリア */}
      <div className="flex-1 flex divide-x overflow-hidden">
        {/* エディタ */}
        <div className="flex-1 overflow-auto">
          <CodeMirror
            value={content}
            height="100%"
            extensions={extensions}
            onChange={handleChange}
            className="h-full"
            theme="light"
          />
        </div>

        {/* プレビュー */}
        <div className="flex-1 overflow-auto">
          <MdxPreview content={content} />
        </div>
      </div>
    </div>
  );
}