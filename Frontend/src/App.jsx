import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';

function AppContent() {
  const { user, loading } = useAuth();
  const [authScreen, setAuthScreen] = useState('login');
  const [prefilledLogin, setPrefilledLogin] = useState('');
  const [loginNotice, setLoginNotice] = useState('');

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

  const loginViewKey = `${prefilledLogin}|${loginNotice}`;

  return authScreen === 'register' ? (
    <RegisterPage
      onBackToLogin={() => setAuthScreen('login')}
      onRegisterSuccess={(email) => {
        setPrefilledLogin(email);
        setLoginNotice('Cadastro concluído! Faça login com seus dados.');
        setAuthScreen('login');
      }}
    />
  ) : (
    <LoginPage
      key={loginViewKey}
      onOpenRegister={() => {
        setLoginNotice('');
        setPrefilledLogin('');
        setAuthScreen('register');
      }}
      initialIdentifier={prefilledLogin}
      noticeMessage={loginNotice}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
