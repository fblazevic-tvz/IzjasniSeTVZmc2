import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { formatDateCroatian, formatCurrencyEuroCroatian } from '../../utils/formatters'; 
import './SuggestionDetailInfo.css'; 

function SuggestionDetailInfo({ suggestion }) {
    if (!suggestion) {
        return <p>Podaci o prijedlogu nisu dostupni.</p>;
    }

    const {
        description = "Nema dostupnog opisa.",
        estimatedCost = null,
        status = null,
        createdAt = null,
        author = null, 
        location = null,
        proposal = null, 
        votes = [],
    } = suggestion;

    const authorName = author?.userName || "Anonimno";
    const locationName = location?.name || location?.address || "Nepoznata lokacija";
    const locationCityName = location?.city?.name || ""; 
    const proposalName = proposal?.name || "Nepoznat natječaj";
    const voteCount = votes?.length || 0;

    return (
        <div className="suggestion-detail-layout"> 
            <main className="suggestion-content-main">
                <h3>Opis prijedloga</h3>
                <p className="suggestion-content-text">{description}</p>
                 <footer className="suggestion-meta">
                     Podneseno: {formatDateCroatian(createdAt)} | Autor: {authorName}
                 </footer>
            </main>

            <aside className="suggestion-info-sidebar">
                <h4>Informacije o prijedlogu</h4>
                 <dl className="sidebar-info-item">
                    <dt className="sidebar-info-label">Procijenjeni trošak:</dt>
                    <dd className="sidebar-info-value budget">{formatCurrencyEuroCroatian(estimatedCost)}</dd>
                </dl>
                 <dl className="sidebar-info-item">
                    <dt className="sidebar-info-label">Broj glasova:</dt>
                    <dd className="sidebar-info-value votes">{voteCount}</dd>
                </dl>
                <dl className="sidebar-info-item">
                    <dt className="sidebar-info-label">Lokacija:</dt>
                    <dd className="sidebar-info-value location">{locationName}{locationCityName ? `, ${locationCityName}` : ''}</dd>
                </dl>

                {proposal?.id && (
                    <section className="related-proposal-info">
                         <h5>Povezani natječaj</h5>
                         <p>
                             <Link to={`/proposals/${proposal.id}`} className="sidebar-link-to-proposal">
                                 {proposalName}
                             </Link>
                         </p>
                    </section>
                 )}
            </aside>
        </div>
    );
}

SuggestionDetailInfo.propTypes = {
    suggestion: PropTypes.object, 
};

export default SuggestionDetailInfo;