import React from 'react';
import PropTypes from 'prop-types';
import SuggestionCard from '../SuggestionCard/SuggestionCard'; 
import './SuggestionList.css'; 

function SuggestionList({ suggestions, showActions = false, onEdit, onDelete, onVoteToggled }) {
  if (!suggestions || suggestions.length === 0) {
    return <p className="no-suggestions-message">Nisu pronađeni prijedlozi.</p>; 
  }

  return (
    <ul className="suggestion-list-container"> 
      {suggestions.map((suggestion) => (
        <li key={suggestion.id}>
          <SuggestionCard
            suggestion={suggestion}
            showActions={showActions}
            onEdit={onEdit}
            onDelete={onDelete}
            onVoteToggled={onVoteToggled}
          /> 
        </li>
      ))}
    </ul>
  );
}

SuggestionList.propTypes = {
  suggestions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
  })).isRequired,
  showActions: PropTypes.bool, 
  onEdit: PropTypes.func,      
  onDelete: PropTypes.func, 
  onVoteToggled: PropTypes.func 
};

export default SuggestionList;