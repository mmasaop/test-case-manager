// File System Access API のヘルパー関数

export interface FileNode {
  name: string;
  handle: FileSystemHandle;
  type: 'file' | 'directory';
  children?: FileNode[];
  path: string;
  imageFiles?: FileNode[];
}

// ブラウザがFile System Access APIをサポートしているかチェック
export function isFileSystemAccessSupported(): boolean {
  return 'showDirectoryPicker' in window;
}

// 特定のパスのディレクトリハンドルを取得（開発用）
export async function getDirectoryHandleFromPath(path: string): Promise<FileSystemDirectoryHandle | null> {
  try {
    // Chrome/Edgeの拡張機能やローカル開発環境でのみ動作
    // 通常のWebアプリでは動作しません
    if ('showDirectoryPicker' in window) {
      // デバッグ用：最後に開いたディレクトリを保存
      const lastOpenedPath = localStorage.getItem('lastOpenedPath');
      
      if (lastOpenedPath === path) {
        // 同じパスの場合は、ユーザーに再度選択してもらう
        const handle = await window.showDirectoryPicker({
          mode: 'readwrite',
          startIn: 'documents',
        });
        
        // パスを保存
        localStorage.setItem('lastOpenedPath', path);
        return handle;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Failed to get directory handle from path:', error);
    return null;
  }
}

// ディレクトリを選択
export async function selectDirectory(): Promise<FileSystemDirectoryHandle | null> {
  try {
    const dirHandle = await window.showDirectoryPicker({
      mode: 'readwrite',
    });
    return dirHandle;
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      // ユーザーがキャンセルした
      return null;
    }
    throw err;
  }
}

// ディレクトリを再帰的に読み込み
export async function readDirectory(
  dirHandle: FileSystemDirectoryHandle,
  path: string = ''
): Promise<FileNode[]> {
  const entries: FileNode[] = [];
  const currentDirImages: FileNode[] = [];

  for await (const [name, handle] of dirHandle) {
    const fullPath = path ? `${path}/${name}` : name;
    
    if (handle.kind === 'file') {
      // 画像ファイルの検出
      if (name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        currentDirImages.push({
          name,
          handle,
          type: 'file',
          path: fullPath,
        });
      }
      // MDXファイルのみを対象にする（meta.mdxとREADME.mdは除外）
      else if ((name.endsWith('.mdx') || name.endsWith('.md')) && 
          name.toLowerCase() !== 'meta.mdx' && 
          name.toLowerCase() !== 'meta.md' &&
          name.toLowerCase() !== 'readme.mdx' &&
          name.toLowerCase() !== 'readme.md') {
        entries.push({
          name,
          handle,
          type: 'file',
          path: fullPath,
        });
      }
    } else if (handle.kind === 'directory') {
      // 隠しディレクトリをスキップ
      if (!name.startsWith('.')) {
        const children = await readDirectory(handle as FileSystemDirectoryHandle, fullPath);
        const dirNode: FileNode = {
          name,
          handle,
          type: 'directory',
          children,
          path: fullPath,
        };
        
        // 現在のディレクトリ直下の画像を確認
        for await (const [childName, childHandle] of handle as FileSystemDirectoryHandle) {
          if (childHandle.kind === 'file' && childName.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
            if (!dirNode.imageFiles) {
              dirNode.imageFiles = [];
            }
            dirNode.imageFiles.push({
              name: childName,
              handle: childHandle,
              type: 'file',
              path: `${fullPath}/${childName}`,
            });
          }
        }
        
        entries.push(dirNode);
      }
    }
  }

  return entries.sort((a, b) => {
    // ディレクトリを先に、その後ファイル
    if (a.type !== b.type) {
      return a.type === 'directory' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
}

// ファイルの内容を読み込み
export async function readFile(fileHandle: FileSystemFileHandle): Promise<string> {
  const file = await fileHandle.getFile();
  return await file.text();
}

// ファイルに書き込み
export async function writeFile(
  fileHandle: FileSystemFileHandle,
  content: string
): Promise<void> {
  const writable = await fileHandle.createWritable();
  await writable.write(content);
  await writable.close();
}

// ファイルパスからハンドルを取得
export async function getFileHandle(
  rootHandle: FileSystemDirectoryHandle,
  path: string
): Promise<FileSystemFileHandle | null> {
  const parts = path.split('/');
  let currentHandle: FileSystemHandle = rootHandle;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    
    if (i === parts.length - 1) {
      // 最後の部分はファイル名
      try {
        return await (currentHandle as FileSystemDirectoryHandle).getFileHandle(part);
      } catch {
        return null;
      }
    } else {
      // ディレクトリをたどる
      try {
        currentHandle = await (currentHandle as FileSystemDirectoryHandle).getDirectoryHandle(part);
      } catch {
        return null;
      }
    }
  }

  return null;
}