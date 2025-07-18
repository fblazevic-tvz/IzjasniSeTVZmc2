import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchSuggestionById, updateSuggestion } from '../../services/suggestionService';
import { fetchSuggestionAttachments, uploadSuggestionAttachments, deleteSuggestionAttachment } from '../../services/suggestionAttachmentService';
import { fetchLocations } from '../../services/locationService';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import './EditSuggestionPage.css';

function EditSuggestionPage() {
  const { suggestionId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuth();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [locationId, setLocationId] = useState('');

  const [existingAttachments, setExistingAttachments] = useState([]);
  const [newAttachments, setNewAttachments] = useState([]);
  const [newFileDescriptions, setNewFileDescriptions] = useState([]);

  const [originalSuggestion, setOriginalSuggestion] = useState(null);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });

  const loadData = useCallback(async () => {
    if (!suggestionId || isNaN(parseInt(suggestionId))) {
      setError('Nevažeći ID prijedloga.');
      setIsLoading(false);
      return;
    }
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/suggestions/edit/${suggestionId}` } });
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const [suggestionData, locationsData, attachmentsData] = await Promise.all([
        fetchSuggestionById(suggestionId),
        fetchLocations(),
        fetchSuggestionAttachments(suggestionId)
      ]);

      const suggestionAuthorId = suggestionData?.authorId;
      const currentUserIdNum = currentUser?.userId ? parseInt(currentUser.userId, 10) : null;

      if (suggestionAuthorId !== currentUserIdNum) {
        setError('Nemate dozvolu za uređivanje ovog prijedloga.');
        setOriginalSuggestion(null);
        setIsLoading(false);
        return;
      }

      setOriginalSuggestion(suggestionData);
      setName(suggestionData.name || '');
      setDescription(suggestionData.description || '');
      setEstimatedCost(suggestionData.estimatedCost?.toString() || '');
      setLocationId(suggestionData.locationId?.toString() || '');
      setLocations(locationsData);
      setExistingAttachments(attachmentsData);

    } catch (err) {
      setError(err.message || 'Greška pri dohvaćanju podataka za uređivanje.');
    } finally {
      setIsLoading(false);
    }
  }, [suggestionId, isAuthenticated, navigate, currentUser]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDeleteExistingAttachment = async (attachmentId, attachmentName) => {

    try {
      await deleteSuggestionAttachment(attachmentId);
      setExistingAttachments(prev => prev.filter(att => att.id !== attachmentId));
      setSubmitStatus({ success: false, message: 'Prilog uspješno obrisan.' });
        setTimeout(() => {
            setSubmitStatus({ success: false, message: '' });
        }, 2000);
    } catch (err) {
      setSubmitStatus({ success: false, message: err.message || 'Greška pri brisanju priloga.' });
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      if (file.type !== 'application/pdf') {
        setSubmitStatus({ success: false, message: `Datoteka ${file.name} nije PDF format. Samo PDF datoteke su dozvoljene.` });
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        setSubmitStatus({ success: false, message: `Datoteka ${file.name} prelazi maksimalnu veličinu od 10MB.` });
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setNewAttachments(prev => [...prev, ...validFiles]);
      setNewFileDescriptions(prev => [...prev, ...Array(validFiles.length).fill('')]);
    }
  };

  const handleRemoveNewFile = (index) => {
    setNewAttachments(prev => prev.filter((_, i) => i !== index));
    setNewFileDescriptions(prev => prev.filter((_, i) => i !== index));
  };

  const handleNewDescriptionChange = (index, value) => {
    const updatedDescriptions = [...newFileDescriptions];
    updatedDescriptions[index] = value;
    setNewFileDescriptions(updatedDescriptions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitStatus({ success: false, message: '' });

    if (!name.trim() || !description.trim() || !estimatedCost || !locationId) {
      setSubmitStatus({ success: false, message: 'Sva polja su obavezna.' });
      return;
    }
    const cost = parseFloat(estimatedCost);
    if (isNaN(cost) || cost <= 0) {
      setSubmitStatus({ success: false, message: 'Procijenjeni trošak mora biti pozitivan broj.' });
      return;
    }

    setIsSubmitting(true);
    const updateData = {
      name: name.trim(),
      description: description.trim(),
      estimatedCost: cost,
      locationId: parseInt(locationId, 10),
    };

    try {
      await updateSuggestion(suggestionId, updateData);
      
      if (newAttachments.length > 0) {
        await uploadSuggestionAttachments(suggestionId, newAttachments, newFileDescriptions);
      }

      setSubmitStatus({ success: true, message: 'Prijedlog uspješno ažuriran!' });
      setTimeout(() => navigate(`/suggestions/${suggestionId}`), 300);
    } catch (err) {
      setSubmitStatus({ success: false, message: err.message || 'Greška pri ažuriranju prijedloga.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="alert alert-danger form-container" role="alert">Greška: {error} <Link to="/dashboard">Povratak na dashboard</Link></div>;
  if (!originalSuggestion) return <div className="alert alert-warning form-container">Nije moguće učitati podatke prijedloga. <Link to="/dashboard">Povratak</Link></div>;

  return (
    <main className="edit-suggestion-container form-container">
      <h1 id="form-title" className="form-title">Uredi prijedlog</h1>
      <h2 className="form-subtitle">{originalSuggestion?.name || 'Prijedlog'}</h2>

      <form onSubmit={handleSubmit} noValidate aria-labelledby="form-title" aria-busy={isSubmitting}>
        {submitStatus.message && (
          <div 
            className={`alert ${submitStatus.success ? 'alert-success' : 'alert-danger'}`}
            role={submitStatus.success ? 'status' : 'alert'}
          >
            {submitStatus.message}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="suggestion-name">Naziv prijedloga:</label>
          <input type="text" id="suggestion-name" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required maxLength={150} disabled={isSubmitting} />
        </div>

        <div className="form-group">
          <label htmlFor="suggestion-description">Opis:</label>
          <textarea id="suggestion-description" className="form-control" rows="5" value={description} onChange={(e) => setDescription(e.target.value)} required disabled={isSubmitting} />
        </div>

        <div className="form-group">
          <label htmlFor="suggestion-cost">Procijenjeni trošak (EUR):</label>
          <input type="number" id="suggestion-cost" className="form-control" value={estimatedCost} onChange={(e) => setEstimatedCost(e.target.value)} required min="0.01" step="0.01" placeholder="npr. 1500.50" disabled={isSubmitting} />
        </div>

        <div className="form-group">
          <label htmlFor="suggestion-location">Lokacija:</label>
          <select id="suggestion-location" className="form-control" value={locationId} onChange={(e) => setLocationId(e.target.value)} required disabled={isSubmitting || locations.length === 0}>
            <option value="" disabled>-- Odaberi lokaciju --</option>
            {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name} {loc.address ? `(${loc.address})` : ''}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Postojeći prilozi:</label>
          {existingAttachments.length > 0 ? (
            <ul className="existing-attachments-list">
              {existingAttachments.map(att => (
                <li key={att.id} className="existing-attachment-item">
                  <div className="attachment-info">
                    <span className="attachment-name">{att.fileName}</span>
                    {att.description && <span className="attachment-desc">({att.description})</span>}
                    <span className="attachment-size">{(att.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  <IconButton size="small" onClick={() => handleDeleteExistingAttachment(att.id, att.fileName)} disabled={isSubmitting} className="delete-attachment-button" aria-label={`Obriši prilog ${att.fileName}`}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-attachments-text">Nema postojećih priloga.</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="file-upload">Dodaj nove priloge (PDF dokumenti):</label>
          <div className="file-upload-area">
            <input type="file" id="file-upload" multiple accept=".pdf" onChange={handleFileChange} disabled={isSubmitting} className="visually-hidden" aria-describedby="file-hint-text" />
            <label htmlFor="file-upload" className="file-upload-button">
              <AttachFileIcon /> Dodaj PDF dokumente
            </label>
            <span id="file-hint-text" className="file-hint">Maksimalna veličina: 10MB po datoteci. Samo PDF format.</span>
          </div>

          {newAttachments.length > 0 && (
            <ul className="attachments-list">
              <li><h4 className="attachments-list-title">Novi dokumenti za prijenos:</h4></li>
              {newAttachments.map((file, index) => (
                <li key={index} className="attachment-item">
                  <div className="attachment-info">
                    <span className="attachment-name">{file.name}</span>
                    <span className="attachment-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                  <label htmlFor={`attachment-desc-${index}`} className="visually-hidden">Opis za {file.name}</label>
                  <input type="text" id={`attachment-desc-${index}`} placeholder="Opis dokumenta (opcionalno)" value={newFileDescriptions[index]} onChange={(e) => handleNewDescriptionChange(index, e.target.value)} className="attachment-description" disabled={isSubmitting} />
                  <IconButton size="small" onClick={() => handleRemoveNewFile(index)} disabled={isSubmitting} className="remove-attachment-button" aria-label={`Ukloni datoteku ${file.name}`}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="form-actions">
          <button type="submit" className="button-primary form-submit-button" disabled={isSubmitting || submitStatus.success}>
            {isSubmitting ? 'Spremanje...' : 'Spremi Promjene'}
          </button>
          <button type="button" onClick={() => navigate(`/suggestions/${suggestionId}`)} className="button-secondary form-cancel-button" disabled={isSubmitting}>
            Odustani
          </button>
        </footer>
      </form>
    </main>
  );
}

export default EditSuggestionPage;