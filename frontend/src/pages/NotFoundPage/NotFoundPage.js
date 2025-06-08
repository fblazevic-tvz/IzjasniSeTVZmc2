import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundIcon = () => (
  <svg 
    className="not-found-icon"
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
  </svg>
);

function NotFoundPage() {
  return (
    <main className="not-found-page">
      <NotFoundIcon />

      <div className="not-found-text-section">
        <h1 className="not-found-main-headline">404</h1>
        <h2 className="not-found-secondary-headline">Stranica nije pronađena</h2>
        <p className="not-found-paragraph">
          Izgleda da stranica koju tražite ne postoji ili je premještena.
          Možda se želite vratiti na početnu stranicu?
        </p>
      </div>

      <Link to="/" className="not-found-button button-primary">
        Vrati se na početnu
      </Link>
    </main>
  );
}

export default NotFoundPage;