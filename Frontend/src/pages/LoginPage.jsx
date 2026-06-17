import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/authService';
import './LoginPage.css';

function EyeIcon({ open }) {
  return open ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function BankLogo() {
  return (
    <div className="bank-logo" style={{ display: 'inline-flex', alignItems: 'center', gap: '1px' }}>
      <div className="bank-logo__icon" style={{ width: '222px', height: '222px', display: 'flex', alignItems: 'center' }}>
        <svg 
          viewBox="0 0 500 500" 
          width="100%" 
          height="100%" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M219.4 186.2c41.2-40.4 104.9-38.9 119.5-38.3 22.8 1 54.8 11.2 49 19.3-5.2 7.3-33.1 5.9-46.7 13.9-19.1 11.2-31.9 20.3-64.8 20.3h-74.8c4.2-6.2 11.1-10.1 17.8-15.2z" 
            fill="#1A3B5D" 
          />
          
          <rect x="169" y="190.9" width="165.2" height="13.2" rx="2" fill="#1A3B5D" />
          
          <path 
            d="M176.3 210.3h10.8V285h-10.8zm31.3 0h10.8V220s5.5-8.2 17.8-1.5V210.3h-28.6zm41.8 0h14.8v60.9c-4.4-1-9.4-1.6-14.8-1.7V210.3zm29.8 0h14.8v60c2.7.9 6.2 2.3 9.4 4.1.3-1.6.6-3.1.6-4.7V210.3h-24.8zm39.8 0h14.8v51.2c5.9 3.9 10.3 7.8 12.3 10.3V210.3h-27.1z" 
            fill="#1A3B5D" 
          />
          
          <path 
            d="M176.3 285.5c2.6-30 15.3-76.3 31.9-80.1 20.7-4.7 39.4 51 61.4 62.5 24 12.5 45.6-3.1 57.5-1.5 5.2.7 8.2 3.8 8.2 5.9v4.2c-15.9-.6-34 4.8-54 11-40.4 12.5-85 1.5-105-2z" 
            fill="#EAC38B" 
          />
          
      
          <path 
            d="M141 328c34-29.5 68.3-42.5 106.8-42.5 53 0 88.5 26.5 103.5 11 5.9-6.1 1.7-18.3 1.7-18.3s-14.5 28.5-64.5 27.5c-44-.9-75-21-118-4-19 7.5-29.5 26.3-29.5 26.3z" 
            fill="#23B396" 
          />
        </svg>
      </div>
      <div>
        <span className="bank-logo__name" style={{ color: '#EAC38B', fontWeight: '500', fontSize: '50px' }}>
          Banco Litoral
        </span>
      </div>
    </div>
  );
}

export default function LoginPage({ onOpenRegister, initialIdentifier = '', noticeMessage = '' }) {
  const { signIn } = useAuth();
  const [identifier, setIdentifier] = useState(initialIdentifier);
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(noticeMessage);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!identifier.trim() || !senha) return;
    setError('');
    setNotice('');
    setLoading(true);
    try {
      const data = await login(identifier.trim(), senha);
      signIn(data.accessToken, data.user);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao fazer login. Tente novamente.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-root">
      <aside className="login-panel">
        <div className="login-panel__content">
          <BankLogo />
          <div className="login-panel__tagline">
            <h2>Sua vida financeira,<br />no seu controle.</h2>
            <p>Acesso seguro, transações rápidas<br />e saldo sempre à vista.</p>
          </div>
        </div>
        <div className="login-panel__bg-lines" aria-hidden="true">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="bg-line" style={{ '--i': i }} />
          ))}
        </div>
      </aside>

      <main className="login-form-wrapper">
        <div className="login-form-card">
          <div className="login-form-card__header">
            <div className="login-form-card__mobile-logo">
              <BankLogo />
            </div>
            <h1>Entrar na conta</h1>
            <p>Use seu e-mail ou CPF para acessar</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {notice && <div className="notice-banner">{notice}</div>}

            <div className="field-group">
              <label htmlFor="identifier">E-mail ou CPF</label>
              <div className="input-wrapper">
                <input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="maria@email.com ou 123.456.789-00"
                  autoComplete="username"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="field-group">
              <div className="label-row">
                <label htmlFor="senha">Senha</label>
                <button type="button" className="forgot-link">
                  Esqueci minha senha
                </button>
              </div>
              <div className="input-wrapper">
                <input
                  id="senha"
                  type={showPassword ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  tabIndex={-1}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {error && (
              <div className="error-banner" role="alert">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-submit"
              disabled={loading || !identifier.trim() || !senha}
            >
              {loading ? (
                <span className="btn-submit__loader" />
              ) : (
                'Acessar conta'
              )}
            </button>
          </form>

          <p className="login-footer">
            Ainda não tem conta?{' '}
            <button type="button" className="link-btn" onClick={onOpenRegister}>
              Abrir conta grátis
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}