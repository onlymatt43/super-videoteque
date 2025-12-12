import { Navigate, Route, Routes } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { CatalogPage } from './pages/CatalogPage';
import { QuestionsPage } from './pages/QuestionsPage';
import { AdminPage } from './pages/AdminPage';
import { Layout } from './components/Layout';
import { useSession } from './features/session/useSession';
import { useHideCursor } from './hooks/useHideCursor';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { payhipCode, customerEmail } = useSession();
  if (!payhipCode || !customerEmail) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const App = () => {
  useHideCursor();
  
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/questions" element={<QuestionsPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route
          path="/catalog"
          element={
            <ProtectedRoute>
              <CatalogPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

export default App;
