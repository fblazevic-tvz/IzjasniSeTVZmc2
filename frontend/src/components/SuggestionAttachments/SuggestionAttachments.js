import React from 'react';
import PropTypes from 'prop-types';
import './SuggestionAttachments.css'; // Create or reuse styles

function SuggestionAttachments({ suggestionId, attachments }) { // Accept attachments array

    // Use passed attachments or placeholder if needed
    const displayAttachments = [
        { id: 1, name: `Attachment_for_suggestion_${suggestionId}_1.pdf`, url: '#' },
        { id: 2, name: `Plan_suggestion_${suggestionId}.jpg`, url: '#' },
    ];

    return (
        <div className="suggestion-attachments"> {/* Specific class */}
            <h2>Priloženi Dokumenti</h2>

            <div className="attachments-list-container">
                {displayAttachments.length > 0 ? (
                    <ul className="attachments-list">
                        {displayAttachments.map(att => (
                            <li key={att.id} className="attachment-item">
                                <span className="attachment-icon">📎</span>
                                <a href={att.url || '#'} target="_blank" rel="noopener noreferrer" className="attachment-link">
                                    {att.name || 'Attachment'} {/* Use name from data */}
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Nema priloženih dokumenata za ovaj prijedlog.</p>
                )}
            </div>
        </div>
    );
}

SuggestionAttachments.propTypes = {
    suggestionId: PropTypes.number,
    attachments: PropTypes.arrayOf(PropTypes.shape({ // Expect attachments array
        id: PropTypes.number.isRequired,
        name: PropTypes.string, // Adjust based on your Attachment entity
        url: PropTypes.string, // Adjust based on your Attachment entity
    })),
};

export default SuggestionAttachments;