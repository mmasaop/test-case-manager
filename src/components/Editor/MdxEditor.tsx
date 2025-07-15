import React, { useCallback, useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { EditorView } from '@codemirror/view';
import { useFileSystemContext } from '@/contexts/FileSystemContext';
import { MdxPreview } from './MdxPreview';
import { EditorToolbar } from './EditorToolbar';
import { Breadcrumb } from './Breadcrumb';

export function MdxEditor() {
  const { currentFile, saveFile, isLoading, rootHandle } = useFileSystemContext();
  const [content, setContent] = React.useState('');
  const [hasChanges, setHasChanges] = React.useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const codeMirrorRef = useRef<any>(null);

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

  const handlePaste = useCallback(async (e: React.ClipboardEvent | ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items || !currentFile || !rootHandle) return;

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        
        const file = item.getAsFile();
        if (!file) continue;

        // 画像ファイルの保存処理
        const timestamp = new Date().getTime();
        const extension = file.type.split('/')[1] || 'png';
        const fileName = `image-${timestamp}.${extension}`;
        
        // 現在のファイルのディレクトリパスを取得
        const currentDir = currentFile.path.substring(0, currentFile.path.lastIndexOf('/'));
        
        try {
          // 現在のディレクトリハンドルを取得
          const pathParts = currentDir.split('/').filter(Boolean);
          let dirHandle = rootHandle;
          
          for (const part of pathParts) {
            dirHandle = await dirHandle.getDirectoryHandle(part);
          }

          // 画像ファイルを保存
          const fileHandle = await dirHandle.getFileHandle(fileName, { create: true });
          const writable = await fileHandle.createWritable();
          await writable.write(file);
          await writable.close();

          // MDXに画像参照を挿入
          const imageMarkdown = `![${fileName}](./${fileName})`;
          
          // CodeMirrorのビューを取得してカーソル位置に挿入
          if (codeMirrorRef.current?.view) {
            const view = codeMirrorRef.current.view;
            const pos = view.state.selection.main.head;
            view.dispatch({
              changes: { from: pos, to: pos, insert: imageMarkdown },
              selection: { anchor: pos + imageMarkdown.length }
            });
          } else {
            // フォールバック：末尾に追加
            const newContent = content + '\n\n' + imageMarkdown;
            setContent(newContent);
            setHasChanges(true);
          }
          
        } catch (error) {
          console.error('Failed to save image:', error);
          alert('画像の保存に失敗しました');
        }
        
        break;
      }
    }
  }, [content, currentFile, rootHandle]);

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
    EditorView.domEventHandlers({
      paste: (event) => {
        handlePaste(event as any);
        return false; // Allow default paste for text
      }
    }),
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
      <div className="flex-1 flex divide-x overflow-hidden" ref={editorRef}>
        {/* エディタ */}
        <div className="flex-1 overflow-auto">
          <CodeMirror
            ref={codeMirrorRef}
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