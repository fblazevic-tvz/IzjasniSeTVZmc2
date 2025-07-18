import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchSuggestions } from '../../services/suggestionService';
import { fetchCities } from '../../services/cityService';
import SuggestionList from '../../components/SuggestionList/SuggestionList';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './AllSuggestionsPage.css';

const ITEMS_PER_PAGE = 8;

function AllSuggestionsPage() {
  const [allSuggestions, setAllSuggestions] = useState([]);
  const [cities, setCities] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [minCost, setMinCost] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [selectedCityId, setSelectedCityId] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [suggestionsData, citiesData] = await Promise.all([
          fetchSuggestions(),
          fetchCities()
        ]);
        
        const sortedSuggestions = suggestionsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAllSuggestions(sortedSuggestions);
        setCities(citiesData);
        setCurrentPage(1);
      } catch (err) {
        setError(err.message || 'Failed to load initial data.');
        setAllSuggestions([]);
        setCities([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const processedSuggestions = useMemo(() => {
    let tempSuggestions = allSuggestions;

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      tempSuggestions = tempSuggestions.filter(suggestion =>
        suggestion.name?.toLowerCase().includes(lowerSearchTerm) ||
        suggestion.description?.toLowerCase().includes(lowerSearchTerm)
      );
    }
    if (minCost && !isNaN(parseFloat(minCost))) {
      const cost = parseFloat(minCost);
      tempSuggestions = tempSuggestions.filter(suggestion =>
        suggestion.estimatedCost >= cost
      );
    }
    if (locationTerm) {
      const lowerLocationTerm = locationTerm.toLowerCase();
      tempSuggestions = tempSuggestions.filter(suggestion =>
        suggestion.location?.name?.toLowerCase().includes(lowerLocationTerm) ||
        suggestion.location?.address?.toLowerCase().includes(lowerLocationTerm)
      );
    }
    if (selectedCityId && selectedCityId !== '') {
      const cityId = parseInt(selectedCityId, 10);
      tempSuggestions = tempSuggestions.filter(suggestion =>
        suggestion.location?.city?.id === cityId
      );
    }

    const sorted = [...tempSuggestions].sort((a, b) => {
      switch (sortOrder) {
        case 'votes-desc':
          return (b.votes?.length || 0) - (a.votes?.length || 0);
        case 'votes-asc':
          return (a.votes?.length || 0) - (b.votes?.length || 0);
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return sorted;
  }, [allSuggestions, searchTerm, minCost, locationTerm, selectedCityId, sortOrder]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, minCost, locationTerm, selectedCityId, sortOrder]);

  const handleVoteToggledInCard = useCallback((suggestionId, newVoteCount, newHasVotedState) => {
    setAllSuggestions(prevSuggestions => {
      return prevSuggestions.map(s => {
        if (s.id === suggestionId) {
          const updatedVotesArray = Array(newVoteCount >= 0 ? newVoteCount : 0).fill(null);
          return { ...s, votes: updatedVotesArray };
        }
        return s;
      });
    });
  }, []);

  const totalPages = Math.ceil(processedSuggestions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentSuggestions = processedSuggestions.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <nav className="pagination-nav" aria-label="Navigacija stranicama">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="pagination-button prev-next">« Prethodni</button>
        {pageNumbers.map(number => (
          <button 
            key={number} 
            onClick={() => handlePageChange(number)} 
            disabled={currentPage === number} 
            className={`pagination-button page-number ${currentPage === number ? 'active' : ''}`}
            aria-current={currentPage === number ? 'page' : undefined}
          >
            {number}
          </button>
        ))}
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="pagination-button prev-next">Sljedeći »</button>
      </nav>
    );
  };

  const handleSearchChange = (event) => setSearchTerm(event.target.value);
  const handleMinCostChange = (event) => setMinCost(event.target.value);
  const handleLocationChange = (event) => setLocationTerm(event.target.value);
  const handleCityChange = (event) => setSelectedCityId(event.target.value);
  const handleSortChange = (event) => setSortOrder(event.target.value);

  return (
    <main>
      <h1 className="all-suggestions-title">Svi prijedlozi</h1>

      <form className="filter-controls-container">
        <div className="filter-group">
          <label htmlFor="search-term" className="filter-label">Pretraga (Naziv/Opis):</label>
          <input
            type="text"
            id="search-term"
            className="filter-input form-control"
            placeholder="Unesite pojam..."
            value={searchTerm}
            onChange={handleSearchChange}
            disabled={isLoading}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="min-cost" className="filter-label">Minimalna Cijena (EUR):</label>
          <input
            type="number"
            id="min-cost"
            className="filter-input form-control"
            placeholder="npr. 100"
            min="0"
            value={minCost}
            onChange={handleMinCostChange}
            disabled={isLoading}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="location-term" className="filter-label">Lokacija (Naziv/Adresa):</label>
          <input
            type="text"
            id="location-term"
            className="filter-input form-control"
            placeholder="Unesite lokaciju..."
            value={locationTerm}
            onChange={handleLocationChange}
            disabled={isLoading}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="city-select" className="filter-label">Grad:</label>
          <select
            id="city-select"
            className="filter-select form-control"
            value={selectedCityId}
            onChange={handleCityChange}
            disabled={isLoading || cities.length === 0}
          >
            <option value="">-- Svi gradovi --</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>
                {city.name} ({city.postcode})
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="sort-order" className="filter-label">Sortiraj po:</label>
          <select
            id="sort-order"
            className="filter-select form-control"
            value={sortOrder}
            onChange={handleSortChange}
            disabled={isLoading}
          >
            <option value="newest">Najnovije</option>
            <option value="votes-desc">Najviše glasova</option>
          </select>
        </div>
      </form>

      {isLoading && <LoadingSpinner />}
      {error && <div className="alert alert-danger" role="alert">Error loading data: {error}</div>}

      {!isLoading && !error && (
        <>
          {currentSuggestions.length > 0 ? (
            <>
              <SuggestionList suggestions={currentSuggestions} onVoteToggled={handleVoteToggledInCard} />
              {renderPagination()}
            </>
          ) : (
            <p className="no-suggestions-message">Nema prijedloga koji odgovaraju zadanim filterima.</p>
          )}
        </>
      )}
    </main>
  );
}

export default AllSuggestionsPage;