import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchProposalAttachments } from '../../services/proposalAttachmentService';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import './ProposalParticipate.css';

function ProposalParticipate({ proposalId }) {
    const [attachments, setAttachments] = useState([]);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadAttachments = async () => {
            if (!proposalId) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);
            
            try {
                const data = await fetchProposalAttachments(proposalId);
                setAttachments(data);
            } catch (err) {
                setError(err.message || 'Failed to load attachments');
            } finally {
                setIsLoading(false);
            }
        };

        loadAttachments();
    }, [proposalId]);

     const handleCreateSuggestion = (e) => {
        if (!isAuthenticated) {
            e.preventDefault();
            navigate('/login', { 
                state: { from: `/create-suggestion?proposalId=${proposalId}` } 
            });
        }
    };

    return (
        <section className="proposal-participate">
            <div className="participate-header">
                <h2>Sudjeluj u Natječaju</h2>
                <p className="participate-description">
                    Imate ideju koja može unaprijediti naš grad?{<br></br>}
                    Podijelite je s nama! Podnesite novi prijedlog za ovaj natječaj.
                </p>
                <Link
                    to={`/create-suggestion?proposalId=${proposalId}`} 
                    className="button-primary participate-button"
                    onClick={handleCreateSuggestion}
                    style={!proposalId ? { pointerEvents: 'none', opacity: 0.65 } : {}}
                >
                    Podnesi novi prijedlog
                </Link>
            </div>

            <section className="attachments-section">
                <h3>Povezani Dokumenti</h3>
                {isLoading ? (
                    <p className="no-content-message" role="status">Učitavanje dokumenata...</p>
                ) : error ? (
                    <p className="no-content-message error" role="alert">Greška pri učitavanju dokumenata.</p>
                ) : attachments.length > 0 ? (
                    <ul className="attachments-list">
                        {attachments.map(att => (
                            <li key={att.id} className="attachment-item">
                                <ArticleOutlinedIcon className="attachment-icon" aria-hidden="true" />
                                <div className="attachment-details">
                                    <a 
                                        href={att.downloadUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="attachment-link"
                                    >
                                        {att.fileName}
                                    </a>
                                    {att.description && (
                                        <span className="attachment-desc">{att.description}</span>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="no-content-message">Nema priloženih dokumenata za ovaj natječaj.</p>
                )}
            </section>
        </section>
    );
}

ProposalParticipate.propTypes = {
    proposalId: PropTypes.number.isRequired, 
};

export default ProposalParticipate;