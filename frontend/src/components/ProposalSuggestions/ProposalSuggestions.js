import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { fetchSuggestionsByProposalId } from '../../services/suggestionService';
import SuggestionList from '../SuggestionList/SuggestionList';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import './ProposalSuggestions.css';

function ProposalSuggestions({ proposalId }) {
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!proposalId) return;

        const loadSuggestions = async () => {
            setIsLoading(true);
            setError(null);
            setSuggestions([]);
            try {
                const data = await fetchSuggestionsByProposalId(proposalId);
                const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setSuggestions(sortedData);
            } catch (err) {
                setError(err.message || `Failed to load suggestions for proposal ${proposalId}.`);
            } finally {
                setIsLoading(false);
            }
        };

        loadSuggestions();
    }, [proposalId]);

    return (
        <section className="proposal-suggestions">
            <h2>Povezani prijedlozi</h2>

            {isLoading && <LoadingSpinner />}
            {error && <div className="alert alert-danger" role="alert">Error: {error}</div>}

            {!isLoading && !error && (
                suggestions.length > 0
                    ? <SuggestionList suggestions={suggestions} />
                    : <p className="no-content-message">Nema povezanih prijedloga za ovaj natječaj.</p>
            )}
        </section>
    );
}

ProposalSuggestions.propTypes = {
    proposalId: PropTypes.number,
};

export default ProposalSuggestions;