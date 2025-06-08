import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { fetchSuggestionAttachments } from '../../services/suggestionAttachmentService';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import './SuggestionAttachments.css';

function SuggestionAttachments({ suggestionId }) {
    const [attachments, setAttachments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadAttachments = async () => {
            if (!suggestionId) {
                setError('Invalid suggestion ID');
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);
            
            try {
                const data = await fetchSuggestionAttachments(suggestionId);
                setAttachments(data);
            } catch (err) {
                setError(err.message || 'Failed to load attachments');
            } finally {
                setIsLoading(false);
            }
        };

        loadAttachments();
    }, [suggestionId]);

    const renderContent = () => {
        if (isLoading) {
            return <p className="no-content-message" role="status">Učitavanje dokumenata...</p>;
        }
        if (error) {
            return <p className="no-content-message error" role="alert">Greška pri učitavanju dokumenata.</p>;
        }
        if (attachments.length > 0) {
            return (
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
                                    <span className="attachment-description">{att.description}</span>
                                )}
                                <span className="attachment-meta">
                                    {(att.fileSize / 1024 / 1024).toFixed(2)} MB
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            );
        }
        return <p className="no-content-message">Nema priloženih dokumenata za ovaj prijedlog.</p>;
    };

    return (
        <section className="suggestion-attachments">
            <h2>Priloženi dokumenti</h2>
            <div className="attachments-list-container">
                {renderContent()}
            </div>
        </section>
    );
}

SuggestionAttachments.propTypes = {
    suggestionId: PropTypes.number.isRequired,
};

export default SuggestionAttachments;