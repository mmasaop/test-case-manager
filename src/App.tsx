import { MainLayout } from './components/Layout/MainLayout';
import { Sidebar } from './components/Layout/Sidebar';
import { EditorPlaceholder } from './components/Editor/EditorPlaceholder';
import { FileSystemProvider } from './contexts/FileSystemContext';

function App() {
  return (
    <FileSystemProvider>
      <MainLayout
        sidebar={<Sidebar />}
      >
        <EditorPlaceholder />
      </MainLayout>
    </FileSystemProvider>
  );
}

export default App;