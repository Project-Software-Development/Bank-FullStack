import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';

function AppContent() {
  const { user, loading } = useAuth();
  const [authScreen, setAuthScreen] = useState('login');

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f4f6fb',
        fontFamily: 'system-ui, sans-serif',
        color: '#6b7a99',
        fontSize: '0.9rem'
      }}>
        Carregando...
      </div>
    );
  }

  if (user) {
    return <HomePage />;
  }

  return authScreen === 'register' ? (
    <RegisterPage onBackToLogin={() => setAuthScreen('login')} />
  ) : (
    <LoginPage onOpenRegister={() => setAuthScreen('register')} />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
