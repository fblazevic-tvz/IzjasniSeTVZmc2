import React from 'react';
import PropTypes from 'prop-types';
import ProposalCard from '../ProposalCard/ProposalCard';
import './ProposalList.css';

function ProposalList({ proposals, showActions = false, onEdit, onDelete }) {
  if (!proposals || proposals.length === 0) {
    return <p className="no-proposals-message">No proposals found at the moment.</p>;
  }

  return (
    <ul className="proposal-list-container"> 
      {proposals.map((proposal) => (
        <li key={proposal.id}>
          <ProposalCard 
            proposal={proposal}
            showActions={showActions}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  );
}

ProposalList.propTypes = {
    proposals: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
    })).isRequired,
    showActions: PropTypes.bool,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
};

export default ProposalList;