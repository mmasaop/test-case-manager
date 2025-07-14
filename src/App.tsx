import { MainLayout } from './components/Layout/MainLayout';
import { Sidebar } from './components/Layout/Sidebar';
import { EditorPlaceholder } from './components/Editor/EditorPlaceholder';
import { MdxEditor } from './components/Editor/MdxEditor';
import { FileSystemProvider } from './contexts/FileSystemContext';
import { useFileSystemContext } from './contexts/FileSystemContext';

function AppContent() {
  const { currentFile } = useFileSystemContext();
  
  return (
    <MainLayout
      sidebar={<Sidebar />}
    >
      {currentFile ? <MdxEditor /> : <EditorPlaceholder />}
    </MainLayout>
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