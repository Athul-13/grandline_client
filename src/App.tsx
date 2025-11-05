import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAppDispatch } from './store/hooks';
import { checkAuthAsync } from './store/slices/auth_slice';
import { UserRoutes } from './routes/user_routes';
import { AdminRoutes } from './routes/admin_routes';

function App() {
  const dispatch = useAppDispatch();

  // Check authentication status on app load
  useEffect(() => {
    dispatch(checkAuthAsync());
  }, [dispatch]);

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: 'var(--color-bg-card)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-primary)',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: 'white',
            },
          },
        }}
      />
      <Routes>
        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        
        {/* User routes */}
        <Route path="/*" element={<UserRoutes />} />
      </Routes>
    </>
  );
}

export default App;
