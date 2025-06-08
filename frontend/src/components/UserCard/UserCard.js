import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './UserCard.css';
import { useNavigate } from 'react-router-dom';
import { formatDateCroatian, formatRoleCroatian } from '../../utils/formatters';
import { changeUserStatus } from '../../services/userService';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import GavelIcon from '@mui/icons-material/Gavel';

function UserCard({ user, onUserStatusChanged }) {
    const navigate = useNavigate();
    const [isChangingStatus, setIsChangingStatus] = useState(false);
    const [statusError, setStatusError] = useState('');
    const {
        id,
        userName = "Nije dostupno",
        email = "Nije dostupno",
        role = "User",
        createdAt = null,
        accountStatus = "Active",
        avatarUrl = null
    } = user || {};

    const isActive = accountStatus === "Active";
    const isBanned = accountStatus === "Banned";

    const getAvatarUrl = () => {
        if (avatarUrl) {
            if (avatarUrl.startsWith('/')) {
                const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7003/api';
                const baseUrl = apiBaseUrl.replace('/api', '');
                return `${baseUrl}${avatarUrl}`;
            }
            return avatarUrl;
        }
        return null;
    };

    const goToDetails = () => {
        if (id) {
            navigate(`/dashboard/users/${id}`);
        }
    };

    const handleStatusToggle = async (e) => {
        e.stopPropagation();
        setIsChangingStatus(true);
        setStatusError('');

        try {
            const newStatus = isActive ? "Banned" : "Active";
            await changeUserStatus(id, newStatus);
            
            if (onUserStatusChanged) {
                onUserStatusChanged(id, newStatus);
            }
        } catch (err) {
            setStatusError(err.message || "Promjena statusa nije uspjela.");
        } finally {
            setIsChangingStatus(false);
        }
    };

    const fullAvatarUrl = getAvatarUrl();

    return (
        <article className="user-card">
            <header className="user-card-header">
                <figure className="user-card-avatar">
                    {fullAvatarUrl ? (
                        <img 
                            src={fullAvatarUrl} 
                            alt={`${userName} avatar`}
                            className="user-card-avatar-image"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                if (e.target.nextSibling) {
                                    e.target.nextSibling.style.display = 'block';
                                }
                            }}
                        />
                    ) : null}
                    <div 
                        className="user-icon-placeholder-card"
                        style={fullAvatarUrl ? { display: 'none' } : {}}
                    ></div>
                </figure>
                <div className={`user-status-badge ${isActive ? 'active' : 'inactive'}`}>
                    {isActive ? 'Aktivan' : 'Suspendiran'}
                </div>
            </header>

            <div className="user-card-content">
                <div className="user-card-info">
                    <h3 className="user-card-name">{userName}</h3>
                    <p className="user-card-email">{email}</p>
                    <div className="user-card-meta">
                        <span className={`user-role-badge ${role.toLowerCase()}`}>
                            {formatRoleCroatian(role)}
                        </span>
                    </div>
                </div>

                <p className="user-card-dates">
                    <span>Datum registracije: {formatDateCroatian(createdAt)}</span>
                </p>
                
                {statusError && (
                    <p className="status-error-message" role="alert">{statusError}</p>
                )}
            </div>

            <footer className="user-card-buttons-group">
                <button onClick={goToDetails} className="user-card-button-primary">
                    Detalji
                </button>
                <Tooltip title={isActive ? "Suspendiraj korisnika" : "Ukloni ban"}>
                    <span>
                        <IconButton
                            onClick={handleStatusToggle}
                            disabled={isChangingStatus}
                            className={`user-status-toggle-button ${isBanned ? 'banned' : ''}`}
                            size="medium"
                        >
                            <GavelIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </footer>
        </article>
    );
}

UserCard.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.number.isRequired,
        userName: PropTypes.string,
        email: PropTypes.string,
        role: PropTypes.string,
        createdAt: PropTypes.string,
        accountStatus: PropTypes.string,
        avatarUrl: PropTypes.string,
    }).isRequired,
    onUserStatusChanged: PropTypes.func,
};

export default UserCard;