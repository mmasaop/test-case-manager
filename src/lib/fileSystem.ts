// File System Access API のヘルパー関数

export interface FileNode {
  name: string;
  handle: FileSystemHandle;
  type: 'file' | 'directory';
  children?: FileNode[];
  path: string;
}

// ブラウザがFile System Access APIをサポートしているかチェック
export function isFileSystemAccessSupported(): boolean {
  return 'showDirectoryPicker' in window;
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

  for await (const [name, handle] of dirHandle) {
    const fullPath = path ? `${path}/${name}` : name;
    
    if (handle.kind === 'file') {
      // MDXファイルのみを対象にする
      if (name.endsWith('.mdx') || name.endsWith('.md')) {
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
        entries.push({
          name,
          handle,
          type: 'directory',
          children,
          path: fullPath,
        });
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