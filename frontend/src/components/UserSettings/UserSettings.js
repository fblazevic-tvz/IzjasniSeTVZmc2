import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { uploadUserAvatar } from '../../services/userService';
import './UserSettings.css';

function UserSettings({ user }) {
  const { updateUserAvatar } = useAuth();
  const [userData, setUserData] = useState(user);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Molimo odaberite važeću sliku (JPEG, PNG, GIF ili WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Slika mora biti manja od 5MB');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccessMessage('');

    try {
      const response = await uploadUserAvatar(user.id, file);
      
      setUserData(prev => ({ ...prev, avatarUrl: response.avatarUrl }));
      updateUserAvatar(response.avatarUrl);
      setSuccessMessage('Slika profila uspješno ažurirana!');
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Greška pri učitavanju slike');
    } finally {
      setIsUploading(false);
    }
  };

  const getAvatarUrl = () => {
    if (userData.avatarUrl && userData.avatarUrl.startsWith('/')) {
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7003/api';
      const baseUrl = apiBaseUrl.replace('/api', '');
      return `${baseUrl}${userData.avatarUrl}`;
    }
    return userData.avatarUrl || null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('hr-HR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const avatarUrl = getAvatarUrl();
  const avatarAltText = `Slika profila za korisnika ${userData.userName}`;

  return (
    <div className="user-settings-panel">
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {successMessage && <div className="alert alert-success" role="status">{successMessage}</div>}

      <section className="avatar-section" aria-labelledby="avatar-heading">
        <h3 id="avatar-heading">Slika profila</h3>
        <div className="avatar-upload-container">
          <figure className="current-avatar">
            {avatarUrl ? (
              <img 
                src={avatarUrl}
                alt={avatarAltText} 
                className="avatar-preview"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              <div className="avatar-placeholder" aria-label="Nema slike profila">
                <span>{userData.userName ? userData.userName.charAt(0).toUpperCase() : '?'}</span>
              </div>
            )}
            <figcaption className="visually-hidden">Trenutna slika profila.</figcaption>
          </figure>
          <div className="avatar-upload-controls">
            
            <label htmlFor="avatar-upload" className={`button-primary upload-button ${isUploading ? 'disabled' : ''}`}>
              {isUploading ? 'Učitavanje...' : 'Promijeni sliku'}
            </label>
            <input
              type="file"
              id="avatar-upload"
              className="visually-hidden"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleAvatarUpload}
              disabled={isUploading}
              aria-describedby="upload-hint-text"
            />
            <p id="upload-hint-text" className="upload-hint">Maksimalna veličina: 5MB. Podržani formati: JPEG, PNG, GIF, WebP</p>
          </div>
        </div>
      </section>

      <section className="user-info-section" aria-labelledby="user-info-heading">
        <h3 id="user-info-heading" className="visually-hidden">Osnovni podaci o korisniku</h3>
        <dl className="info-grid">
          <div className="info-item">
            <dt>Korisničko ime:</dt>
            <dd>{userData.userName || 'N/A'}</dd>
          </div>
          
          <div className="info-item">
            <dt>Email:</dt>
            <dd>{userData.email || 'N/A'}</dd>
          </div>
          
          <div className="info-item">
            <dt>Uloga:</dt>
            <dd>
              {userData.role === 'Admin' && 'Administrator'}
              {userData.role === 'Moderator' && 'Moderator'}
              {userData.role === 'Regular' && 'Korisnik'}
            </dd>
          </div>
          
          <div className="info-item">
            <dt>Status računa:</dt>
            <dd>
              <span className={`status-badge ${userData.accountStatus === 'Active' ? 'status-active' : 'status-banned'}`}>
                {userData.accountStatus === 'Active' ? 'Aktivan' : 'Blokiran'}
              </span>
            </dd>
          </div>
          
          <div className="info-item">
            <dt>Datum registracije:</dt>
            <dd>{formatDate(userData.createdAt)}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

export default UserSettings;