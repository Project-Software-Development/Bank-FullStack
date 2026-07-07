import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/authService';
import bankLogo from '../assets/pds-bank-logo.png';
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
    <div className="bank-logo">
      <img src={bankLogo} alt="PDS Bank" className="bank-logo__image" />
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