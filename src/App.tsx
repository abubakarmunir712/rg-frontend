import { useEffect } from 'react';
import { MainLayout } from './components/layout';
import { AppRoutes } from './routes';
import { useAuthStore } from './store/authStore';

function App() {
  const { user, checkAuth, logout } = useAuthStore();

  // Check authentication on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <MainLayout user={user} onLogout={logout}>
      
      <AppRoutes />
    </MainLayout>
  );
}

export default App;
