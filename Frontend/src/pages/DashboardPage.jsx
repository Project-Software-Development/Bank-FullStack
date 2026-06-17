import { useAuth } from '../context/AuthContext';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user, signOut } = useAuth();

  return (
    <div className="dashboard-root">
      <header className="dashboard-header">
        <div className="dashboard-logo">
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
            <rect x="3" y="13" width="4" height="10" rx="1" fill="currentColor" />
            <rect x="9" y="9" width="4" height="14" rx="1" fill="currentColor" />
            <rect x="15" y="5" width="4" height="18" rx="1" fill="currentColor" />
            <rect x="21" y="11" width="4" height="12" rx="1" fill="currentColor" />
            <rect x="1" y="24" width="26" height="2" rx="1" fill="currentColor" />
            <path d="M14 1L26 7H2L14 1Z" fill="currentColor" />
          </svg>
          <span>Banco Litoral</span>
        </div>
        <div className="dashboard-user">
          <span>{user?.nome}</span>
          <button onClick={signOut} className="btn-logout">Sair</button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-card">
          <p className="welcome-tag">Bem-vindo de volta</p>
          <h1>Olá, {user?.nome?.split(' ')[0]}!</h1>
          <p className="welcome-sub">
            Conta <strong>{user?.tipo}</strong> — Status:{' '}
            <span className="status-badge">{user?.statusConta}</span>
          </p>
        </div>
        <div className="session-card">
          <h2>Dados da sessão autenticada</h2>
          <dl>
            <div>
              <dt>Nome</dt>
              <dd>{user?.nome}</dd>
            </div>
            <div>
              <dt>E-mail</dt>
              <dd>{user?.email}</dd>
            </div>
            <div>
              <dt>CPF</dt>
              <dd>{user?.cpf}</dd>
            </div>
            <div>
              <dt>Tipo</dt>
              <dd>{user?.tipo}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{user?.statusConta}</dd>
            </div>
          </dl>
        </div>
      </main>
    </div>
  );
}
