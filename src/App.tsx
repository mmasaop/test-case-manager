import { MainLayout } from './components/Layout/MainLayout';
import { Sidebar } from './components/Layout/Sidebar';
import { EditorPlaceholder } from './components/Editor/EditorPlaceholder';
import { MdxEditor } from './components/Editor/MdxEditor';
import { AttachmentViewer } from './components/AttachmentViewer/AttachmentViewer';
import { FileSystemProvider } from './contexts/FileSystemContext';
import { useFileSystemContext } from './contexts/FileSystemContext';
import { DebugPanel } from './components/DebugPanel';

function AppContent() {
  const { currentFile } = useFileSystemContext();
  const showDebug = new URLSearchParams(window.location.search).has('debug');
  
  // ファイルタイプを判定
  const isAttachment = currentFile && !currentFile.path.endsWith('.mdx') && !currentFile.path.endsWith('.md');
  
  return (
    <>
      <MainLayout
        sidebar={<Sidebar />}
      >
        {currentFile ? (
          isAttachment ? (
            <AttachmentViewer file={currentFile} />
          ) : (
            <MdxEditor />
          )
        ) : (
          <EditorPlaceholder />
        )}
      </MainLayout>
      {showDebug && <DebugPanel />}
    </>
  );
}

function App() {
  return (
    <FileSystemProvider>
      <AppContent />
    </FileSystemProvider>
  );
}

export default App;