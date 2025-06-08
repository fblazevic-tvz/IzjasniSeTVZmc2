import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchUserById } from '../../services/userService';
import Sidebar from '../../components/Sidebar/Sidebar';
import UserSettings from '../../components/UserSettings/UserSettings';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './UserDetailPage.css';

function UserDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId || isNaN(parseInt(userId))) {
      setError('Invalid user ID');
      setIsLoading(false);
      return;
    }

    const loadUserData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchUserById(userId);
        setUserData(data);
      } catch (err) {
        setError(err.message || 'Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [userId]);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main-content user-detail-page">
        <div className="back-link-container">
          <button onClick={() => navigate('/dashboard/users')} className="back-link-button">
            ← Natrag na korisnike
          </button>
        </div>

        <h1 id="user-detail-heading">Detalji korisnika</h1>
        
        {isLoading && <LoadingSpinner />}
        
        {error && !isLoading && (
          <div className="alert alert-danger" role="alert">
            Greška: {error}
            <br />
            <Link to="/dashboard/users">Vrati se na popis korisnika</Link>
          </div>
        )}
        
        {!isLoading && !error && userData && (
          <section className="user-detail-container" aria-labelledby="user-detail-heading">
            <UserSettings user={userData} />
          </section>
        )}
      </main>
    </div>
  );
}

export default UserDetailPage;