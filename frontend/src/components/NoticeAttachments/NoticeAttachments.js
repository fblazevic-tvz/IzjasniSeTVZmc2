import React from 'react';
import PropTypes from 'prop-types';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import './NoticeAttachments.css'; 

function NoticeAttachments({ noticeId }) {
      const attachments = [
        { id: 1, name: `Dodatni_detalji_obavijest_${noticeId}.pdf`, url: '#' },
        { id: 2, name: `Povezani_dokument_${noticeId}.docx`, url: '#' },
    ];

    return (
        <section className="notice-attachments">
            <h2>Priloženi dokumenti</h2>

            <div className="attachments-list-container">
                {attachments.length > 0 ? (
                    <ul className="attachments-list">
                        {attachments.map(att => (
                            <li key={att.id} className="attachment-item">
                                <ArticleOutlinedIcon className="attachment-icon" aria-hidden="true" />
                                <div className="attachment-details">
                                    <a href={att.url} target="_blank" rel="noopener noreferrer" className="attachment-link">
                                        {att.name}
                                    </a>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="no-content-message">Nema priloženih dokumenata za ovu obavijest.</p>
                )}
            </div>
        </section>
    );
}

NoticeAttachments.propTypes = {
    noticeId: PropTypes.number, 
};

export default NoticeAttachments;