import { Navigate, Route, Routes } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { CatalogPage } from './pages/CatalogPage';
import { Layout } from './components/Layout';
import { useSession } from './features/session/useSession';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { payhipCode, customerEmail } = useSession();
  if (!payhipCode || !customerEmail) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const App = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<LandingPage />} />
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

export default App;
