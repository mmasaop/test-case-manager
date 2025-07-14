import { MainLayout } from './components/Layout/MainLayout';
import { Sidebar } from './components/Layout/Sidebar';
import { EditorPlaceholder } from './components/Editor/EditorPlaceholder';

function App() {
  return (
    <MainLayout
      sidebar={<Sidebar />}
    >
      <EditorPlaceholder />
    </MainLayout>
  );
}

export default App;