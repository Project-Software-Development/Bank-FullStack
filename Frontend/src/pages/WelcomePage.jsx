import bankLogo from '../assets/pds-bank-logo.png';
import './WelcomePage.css';

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function WelcomePage({ onContinue }) {
  return (
    <div className="welcome-root">
      <div className="welcome-bg-lines" aria-hidden="true">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="bg-line" style={{ '--i': i }} />
        ))}
      </div>

      <div className="welcome-content">
        <div className="welcome-logo">
          <img src={bankLogo} alt="PDS Bank" className="welcome-logo__image" />
        </div>

        <div className="welcome-text">
          <h1>Bem-vindo ao PDS Bank</h1>
          <p>O local perfeito para cuidar da sua vida financeira,<br />com segurança e simplicidade.</p>
        </div>

        <button type="button" className="welcome-btn" onClick={onContinue}>
          Começar jornada
          <ArrowIcon />
        </button>
      </div>
    </div>
  );
}
