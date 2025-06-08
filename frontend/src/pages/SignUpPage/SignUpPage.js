import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../services/authService';
import './SignUpPage.css';

function SignUpPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!username.trim() || !email.trim() || !password) {
      setError('Korisničko ime, email i lozinka su obavezni.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Molimo unesite važeću email adresu.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Lozinke se ne podudaraju.');
      return;
    }

    setLoading(true);

    try {
      await registerUser({ username: username, email: email, password: password });
      setSuccess('Registracija uspješna! Sada se možete prijaviti.');

      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigate('/login');
      }, 1000);

    } catch (err) {
      setError(err.message || 'Registracija nije uspjela. Molimo pokušajte ponovno.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="signup-page-container">
      <section className="signup-form-box" aria-labelledby="signup-heading">
        <h2 id="signup-heading">Registracija</h2>
        <form onSubmit={handleSubmit} noValidate aria-busy={loading}>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          {success && <div className="alert alert-success" role="status">{success}</div>}

          <div className="form-group">
            <label htmlFor="username">Korisničko ime</label>
            <input
              type="text"
              id="username"
              className="form-control"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading || success}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || success}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Lozinka</label>
            <input
              type="password"
              id="password"
              className="form-control"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || success}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Potvrdite lozinku</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading || success}
            />
          </div>
          <button
            type="submit"
            className="button-primary signup-button"
            disabled={loading || success}
          >
            {loading ? 'Stvaranje korisničkog računa...' : 'Registracija'}
          </button>
        </form>
        <footer className="form-footer">
          <div className="login-link">
            Već imate račun? <Link to="/login">Prijavite se</Link>
          </div>
          <div className="navigation-options">
            <Link to="/" className="home-link">← Natrag na početnu</Link>
          </div>
        </footer>
      </section>
    </main>
  );
}

export default SignUpPage;