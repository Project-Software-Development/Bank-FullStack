import { useAuth } from '../context/AuthContext';
import bankLogo from '../assets/pds-bank-logo.png';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user, signOut } = useAuth();

  return (
    <div className="dashboard-root">
      <header className="dashboard-header">
        <div className="dashboard-logo">
          <img src={bankLogo} alt="PDS Bank" className="dashboard-logo__image" />
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
