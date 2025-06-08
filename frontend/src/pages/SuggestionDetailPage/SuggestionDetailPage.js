import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchSuggestionById } from '../../services/suggestionService';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import SuggestionDetailInfo from '../../components/SuggestionDetailInfo/SuggestionDetailInfo';
import SuggestionAttachments from '../../components/SuggestionAttachments/SuggestionAttachments';
import SuggestionComments from '../../components/SuggestionComments/SuggestionComments';
import { formatDateCroatian } from '../../utils/formatters';
import './SuggestionDetailPage.css';

function SuggestionDetailPage() {
    const { suggestionId } = useParams();
    const navigate = useNavigate();

    const [suggestion, setSuggestion] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('details');

    useEffect(() => {
        if (!suggestionId || isNaN(parseInt(suggestionId, 10))) {
            setError("Nevažeći ID prijedloga.");
            setIsLoading(false);
            return;
        }
        const loadSuggestion = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchSuggestionById(suggestionId);
                setSuggestion(data);
            } catch (err) {
                setError(err.message || `Dohvaćanje prijedloga ${suggestionId} nije uspjelo.`);
            }
            finally {
                setIsLoading(false);
            }
        };
        loadSuggestion();
    }, [suggestionId]);

    const suggestionName = isLoading ? "Učitavanje..." : (suggestion?.name || "Prijedlog bez naziva");

    return (
        <main className="suggestion-detail-page">
            <div className="back-link-container">
                <button onClick={() => navigate(-1)} className="back-link-button">← Natrag</button>
            </div>

            {error && !isLoading && (
                <div className="alert alert-danger detail-error" role="alert">
                    Greška: {error} <br />
                    <Link to="/suggestions">Vrati se na popis prijedloga</Link>
                </div>
            )}

            <header className="detail-page-header">
                <div className="header-content">
                    <h1 className="header-headline">{suggestionName}</h1>
                    {!isLoading && suggestion && (
                        <p className="header-meta">
                            Podneseno: {formatDateCroatian(suggestion.createdAt)}
                        </p>
                    )}
                </div>
                <div className="header-image-area">
                    <div className="suggestion-card-image-container">
                        <img
                            src="/suggestion.jpg"
                            alt={`Vizualni prikaz za prijedlog: ${suggestionName}`}
                            className="suggestion-card-image"
                            loading="lazy"
                        />
                    </div>
                </div>
            </header>

            {isLoading && !error && <LoadingSpinner />}

            {!isLoading && !error && suggestion && (
                <div className="suggestion-content-area">
                    <div className="suggestion-tabs" role="tablist" aria-label="Informacije o prijedlogu">
                        <button id="tab-details" className={`tab-button ${activeTab === 'details' ? 'active' : ''}`} role="tab" aria-selected={activeTab === 'details'} aria-controls="panel-details" onClick={() => setActiveTab('details')}>Detalji</button>
                        <button id="tab-attachments" className={`tab-button ${activeTab === 'attachments' ? 'active' : ''}`} role="tab" aria-selected={activeTab === 'attachments'} aria-controls="panel-attachments" onClick={() => setActiveTab('attachments')}>Dokumenti</button>
                        <button id="tab-comments" className={`tab-button ${activeTab === 'comments' ? 'active' : ''}`} role="tab" aria-selected={activeTab === 'comments'} aria-controls="panel-comments" onClick={() => setActiveTab('comments')}>Komentari ({suggestion?.comments?.length || 0})</button>
                    </div>
                    
                    {activeTab === 'details' && <section id="panel-details" role="tabpanel" tabIndex="0" aria-labelledby="tab-details"><SuggestionDetailInfo suggestion={suggestion} /></section>}
                    {activeTab === 'attachments' && <section id="panel-attachments" role="tabpanel" tabIndex="0" aria-labelledby="tab-attachments"><SuggestionAttachments suggestionId={suggestion.id} /></section>}
                    {activeTab === 'comments' && <section id="panel-comments" role="tabpanel" tabIndex="0" aria-labelledby="tab-comments"><SuggestionComments suggestionId={suggestion.id} initialComments={suggestion.comments || []} /></section>}
                </div>
            )}
        </main>
    );
}

export default SuggestionDetailPage;