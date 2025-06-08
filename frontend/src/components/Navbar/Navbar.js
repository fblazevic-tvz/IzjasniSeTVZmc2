import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getAvatarUrl = () => {
    if (user?.avatarUrl) {
      if (user.avatarUrl.startsWith('/')) {
        const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7003/api';
        const baseUrl = apiBaseUrl.replace('/api', '');
        return `${baseUrl}${user.avatarUrl}`;
      }
      return user.avatarUrl;
    }
    return null;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const navbar = event.target.closest('header.navbar-container');
      const isClickInsideNavbar = navbar !== null;
      
      if (!isClickInsideNavbar && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const goToLogin = () => {
    navigate('/login', {state: {from: location}});
    setIsMobileMenuOpen(false);
  };

  const goToRegister = () => {
    navigate('/signup', { state: {from: location}});
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const avatarUrl = getAvatarUrl();

  return (
    <header className="navbar-container">
      <NavLink to="/" className="navbar-logo-link" onClick={handleNavLinkClick}>
        <div className="navbar-logo">
          <img
              src="/logo.png" 
              alt="IzjasniSe Logo"
              className="navbar-logo-image" 
          />
        </div>
      </NavLink>

      <nav className={`navbar-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <NavLink
              to="/proposals"
              className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
              onClick={handleNavLinkClick}
            >
              Natječaji
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/suggestions"
              className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
              onClick={handleNavLinkClick}
            >
              Prijedlozi
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/notices"
              className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
              onClick={handleNavLinkClick}
            >
              Obavijesti
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
              onClick={handleNavLinkClick}
            >
              O nama
            </NavLink>
          </li>
          
          {isAuthenticated && <li className="nav-spacer"></li>}
          
          {isAuthenticated && (
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                onClick={handleNavLinkClick}
              >
                Upravljačka ploča
              </NavLink>
            </li>
          )}
          
          {!isAuthenticated && (
            <li className="mobile-auth-buttons">
              <button onClick={goToLogin} className="login-button">
                Prijavi se
              </button>
              <button onClick={goToRegister} className="register-button">
                Registriraj se
              </button>
            </li>
          )}

          {isAuthenticated && (
            <li className="mobile-auth-buttons">
              <button onClick={handleLogout} className="logout-button">
                Odjavi se
              </button>
            </li>
          )}
        </ul>
      </nav>

      <div className="navbar-actions">
        {isAuthenticated ? (
          <div className="user-actions">
            <figure className="user-avatar" onClick={() => navigate('/dashboard/settings')}>
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={user?.username || 'User avatar'} 
                  className="user-avatar-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) {
                      e.target.nextSibling.style.display = 'block';
                    }
                  }}
                />
              ) : null}
              <div 
                className="user-icon-placeholder" 
                style={avatarUrl ? { display: 'none' } : {}}
              ></div>
            </figure>
            <button onClick={handleLogout} className="logout-button">Odjavi se</button>
          </div>
        ) : (
          <div className="auth-buttons">
            <button onClick={goToLogin} className="login-button">
              Prijavi se
            </button>
            <button onClick={goToRegister} className="register-button">
              Registriraj se
            </button>
          </div>
        )}
      </div>

      <button 
        className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={toggleMobileMenu}
        aria-label="Toggle navigation menu"
        aria-expanded={isMobileMenuOpen}
      >
        <div className="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
    </header>
  );
}

export default Navbar;