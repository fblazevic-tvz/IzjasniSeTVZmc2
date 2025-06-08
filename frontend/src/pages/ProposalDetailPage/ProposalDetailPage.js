import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProposalById } from '../../services/proposalService';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ProposalDetailInfo from '../../components/ProposalDetailInfo/ProposalDetailInfo';
import ProposalParticipate from '../../components/ProposalParticipate/ProposalParticipate';
import ProposalSuggestions from '../../components/ProposalSuggestions/ProposalSuggestions';
import ProposalNotices from '../../components/ProposalNotices/ProposalNotices';
import { formatDateCroatian, formatProposalStatusCroatian } from '../../utils/formatters';
import './ProposalDetailPage.css';

function ProposalDetailPage() {
    const { proposalId } = useParams();

    const [proposal, setProposal] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('details');
    const [refreshNoticesKey, setRefreshNoticesKey] = useState(0);

    useEffect(() => {
        if (!proposalId) {
            setError("Proposal ID not found in URL.");
            setIsLoading(false);
            return;
        }

        const loadProposal = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchProposalById(proposalId);
                setProposal(data);
            } catch (err) {
                setError(err.message || `Failed to load proposal ${proposalId}.`);
            } finally {
                setIsLoading(false);
            }
        };

        loadProposal();
    }, [proposalId]);

    const handleNoticeCreated = (newNotice) => {
        setRefreshNoticesKey(prev => prev + 1);
        setActiveTab('notices');
    };

    const proposalName = isLoading ? "Učitavanje..." : (proposal?.name || "Natječaj nije pronađen");

    return (
        <main className="proposal-detail-page">
            <div className="back-link-container">
                <Link to="/proposals" className="back-link">← Natrag na sve natječaje</Link>
            </div>

            {error && !isLoading && (
                <div className="alert alert-danger detail-error" role="alert">
                    Greška: {error} <br />
                    <Link to="/proposals">Vrati se na popis</Link>
                </div>
            )}

            <header className="detail-page-header">
                <div className="header-content">
                    <h1 className="header-headline">{proposalName}</h1>
                    {!isLoading && proposal && (
                        <p className="header-meta">
                            Objavljeno: {formatDateCroatian(proposal.createdAt)} | Status: {formatProposalStatusCroatian(proposal.status)}
                        </p>
                    )}
                </div>
                <div className="header-image-area">
                    <div className="proposal-card-image-container">
                        <img
                            src="/proposal.jpg"
                            alt={`Vizualni prikaz za natječaj: ${proposalName}`}
                            className="proposal-card-image"
                            loading="lazy"
                        />
                    </div>
                </div>
            </header>

            {isLoading && !error && <LoadingSpinner />}

            {!isLoading && !error && proposal && (
                <div className="proposal-content-area">
                    <div className="proposal-tabs" role="tablist" aria-label="Informacije o natječaju">
                        <button id="tab-details" className={`tab-button ${activeTab === 'details' ? 'active' : ''}`} role="tab" aria-selected={activeTab === 'details'} aria-controls="panel-details" onClick={() => setActiveTab('details')}>Natječaj</button>
                        <button id="tab-participate" className={`tab-button ${activeTab === 'participate' ? 'active' : ''}`} role="tab" aria-selected={activeTab === 'participate'} aria-controls="panel-participate" onClick={() => setActiveTab('participate')}>Sudjeluj</button>
                        <button id="tab-suggestions" className={`tab-button ${activeTab === 'suggestions' ? 'active' : ''}`} role="tab" aria-selected={activeTab === 'suggestions'} aria-controls="panel-suggestions" onClick={() => setActiveTab('suggestions')}>Prijedlozi</button>
                        <button id="tab-notices" className={`tab-button ${activeTab === 'notices' ? 'active' : ''}`} role="tab" aria-selected={activeTab === 'notices'} aria-controls="panel-notices" onClick={() => setActiveTab('notices')}>Obavijesti</button>
                    </div>
                    
                    {activeTab === 'details' && <section id="panel-details" role="tabpanel" tabIndex="0" aria-labelledby="tab-details"><ProposalDetailInfo proposal={proposal} onNoticeCreated={handleNoticeCreated} /></section>}
                    {activeTab === 'participate' && <section id="panel-participate" role="tabpanel" tabIndex="0" aria-labelledby="tab-participate"><ProposalParticipate proposalId={proposal.id} /></section>}
                    {activeTab === 'suggestions' && <section id="panel-suggestions" role="tabpanel" tabIndex="0" aria-labelledby="tab-suggestions"><ProposalSuggestions proposalId={proposal.id} /></section>}
                    {activeTab === 'notices' && <section id="panel-notices" role="tabpanel" tabIndex="0" aria-labelledby="tab-notices"><ProposalNotices key={refreshNoticesKey} proposalId={proposal.id} /></section>}
                </div>
            )}
        </main>
    );
}

export default ProposalDetailPage;