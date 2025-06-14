import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { fetchProposalAttachments } from '../../services/proposalAttachmentService';
import './ProposalAttachments.css';

function ProposalAttachments({ proposalId }) {
    const [attachments, setAttachments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadAttachments = async () => {
            if (!proposalId) {
                setError('Invalid proposal ID');
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

    if (isLoading) {
        return (
            <section className="proposal-attachments">
                <h2>Priloženi dokumenti</h2>
                <div className="attachments-list-container">
                    <p role="status">Učitavanje dokumenata...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="proposal-attachments">
                <h2>Priloženi dokumenti</h2>
                <div className="attachments-list-container">
                    <p className="error-message" role="alert">Greška pri učitavanju dokumenata: {error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="proposal-attachments">
            <h2>Priloženi dokumenti</h2>

            <div className="attachments-list-container">
                {attachments.length > 0 ? (
                    <ul className="attachments-list">
                        {attachments.map(att => (
                            <li key={att.id} className="attachment-item">
                                <span className="attachment-icon" aria-hidden="true">📎</span>
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
                                        <span className="attachment-description">{att.description}</span>
                                    )}
                                    <span className="attachment-meta">
                                        {(att.fileSize / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Nema priloženih dokumenata za ovaj natječaj.</p>
                )}
            </div>
        </section>
    );
}

ProposalAttachments.propTypes = {
    proposalId: PropTypes.number.isRequired,
};

export default ProposalAttachments;