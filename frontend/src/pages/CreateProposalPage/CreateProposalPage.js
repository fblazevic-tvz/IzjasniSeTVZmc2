import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createProposal } from '../../services/proposalService';
import { uploadProposalAttachments } from '../../services/proposalAttachmentService';
import { fetchCities } from '../../services/cityService';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import './CreateProposalPage.css';

function CreateProposalPage() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [maxBudget, setMaxBudget] = useState('');
    const [submissionStartDate, setSubmissionStartDate] = useState('');
    const [submissionStartTime, setSubmissionStartTime] = useState('00:00');
    const [submissionEndDate, setSubmissionEndDate] = useState('');
    const [submissionEndTime, setSubmissionEndTime] = useState('23:59');
    const [cityId, setCityId] = useState('');

    const [attachments, setAttachments] = useState([]);
    const [fileDescriptions, setFileDescriptions] = useState([]);

    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'Moderator') {
            navigate('/dashboard');
            return;
        }

        const loadData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const citiesData = await fetchCities();
                setCities(citiesData);
            } catch (err) {
                setError(err.message || 'Greška pri dohvaćanju gradova.');
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [isAuthenticated, user, navigate]);

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
            setAttachments(prev => [...prev, ...validFiles]);
            setFileDescriptions(prev => [...prev, ...Array(validFiles.length).fill('')]);
        }
    };

    const handleRemoveFile = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
        setFileDescriptions(prev => prev.filter((_, i) => i !== index));
    };

    const handleDescriptionChange = (index, value) => {
        const newDescriptions = [...fileDescriptions];
        newDescriptions[index] = value;
        setFileDescriptions(newDescriptions);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitStatus({ success: false, message: '' });

        if (!name.trim() || !description.trim() || !maxBudget || !submissionStartDate || !submissionEndDate || !cityId) {
            setSubmitStatus({ success: false, message: 'Sva polja su obavezna.' });
            return;
        }

        const startDateTime = new Date(`${submissionStartDate}T${submissionStartTime}:00`);
        const endDateTime = new Date(`${submissionEndDate}T${submissionEndTime}:59`);

        if (endDateTime <= startDateTime) {
            setSubmitStatus({ success: false, message: 'Datum završetka mora biti nakon datuma početka.' });
            return;
        }

        setIsSubmitting(true);

        const proposalData = {
            name: name.trim(),
            description: description.trim(),
            maxBudget: parseFloat(maxBudget),
            submissionStart: startDateTime.toISOString(),
            submissionEnd: endDateTime.toISOString(),
            status: 'Active',
            cityId: parseInt(cityId, 10),
            moderatorId: parseInt(user.userId, 10)
        };

        try {
            const createdProposal = await createProposal(proposalData);
            
            if (attachments.length > 0) {
                await uploadProposalAttachments(createdProposal.id, attachments, fileDescriptions);
            }

            setSubmitStatus({ success: true, message: 'Natječaj uspješno kreiran!' });
            setTimeout(() => navigate(`/proposals/${createdProposal.id}`), 300);
        } catch (err) {
            setSubmitStatus({ success: false, message: err.message || 'Greška pri kreiranju natječaja.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <LoadingSpinner />;
    if (error) return <main className="alert alert-danger form-container" role="alert">Greška: {error}</main>;

    return (
        <main className="create-proposal-container form-container">
            <h1 id="form-title" className="form-title">Stvori novi natječaj</h1>

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
                    <label htmlFor="proposal-name">Naziv natječaja:</label>
                    <input type="text" id="proposal-name" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required maxLength={150} disabled={isSubmitting} />
                </div>
                <div className="form-group">
                    <label htmlFor="proposal-description">Opis:</label>
                    <textarea id="proposal-description" className="form-control" rows="5" value={description} onChange={(e) => setDescription(e.target.value)} required disabled={isSubmitting} />
                </div>
                <div className="form-group">
                    <label htmlFor="proposal-budget">Maksimalni budžet (EUR):</label>
                    <input type="number" id="proposal-budget" className="form-control" value={maxBudget} onChange={(e) => setMaxBudget(e.target.value)} required min="0.01" step="0.01" placeholder="npr. 50000.00" disabled={isSubmitting} />
                </div>
                
                <fieldset className="form-row">
                    <legend>Početak prijava</legend>
                    <div className="form-group">
                        <label htmlFor="submission-start-date">Datum:</label>
                        <input type="date" id="submission-start-date" className="form-control" value={submissionStartDate} onChange={(e) => setSubmissionStartDate(e.target.value)} required disabled={isSubmitting} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="submission-start-time">Vrijeme:</label>
                        <input type="time" id="submission-start-time" className="form-control" value={submissionStartTime} onChange={(e) => setSubmissionStartTime(e.target.value)} required disabled={isSubmitting} />
                    </div>
                </fieldset>

                <fieldset className="form-row">
                    <legend>Kraj prijava</legend>
                    <div className="form-group">
                        <label htmlFor="submission-end-date">Datum:</label>
                        <input type="date" id="submission-end-date" className="form-control" value={submissionEndDate} onChange={(e) => setSubmissionEndDate(e.target.value)} required disabled={isSubmitting} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="submission-end-time">Vrijeme:</label>
                        <input type="time" id="submission-end-time" className="form-control" value={submissionEndTime} onChange={(e) => setSubmissionEndTime(e.target.value)} required disabled={isSubmitting} />
                    </div>
                </fieldset>
                
                <div className="form-group">
                    <label htmlFor="city-select">Grad:</label>
                    <select id="city-select" className="form-control" value={cityId} onChange={(e) => setCityId(e.target.value)} required disabled={isSubmitting || cities.length === 0}>
                        <option value="" disabled>-- Odaberi grad --</option>
                        {cities.map(city => <option key={city.id} value={city.id}>{city.name} ({city.postcode})</option>)}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="file-upload">Dodaj nove priloge (PDF dokumenti):</label>
                    <div className="file-upload-area">
                        <input type="file" id="file-upload" multiple accept=".pdf" onChange={handleFileChange} disabled={isSubmitting} className="visually-hidden" aria-describedby="file-hint-text" />
                        <label htmlFor="file-upload" className="file-upload-button"><AttachFileIcon /> Dodaj PDF dokumente</label>
                        <span id="file-hint-text" className="file-hint">Maksimalna veličina: 10MB po datoteci. Samo PDF format.</span>
                    </div>
                    {attachments.length > 0 && (
                        <ul className="attachments-list">
                            <li><h4 className="attachments-list-title">Odabrani dokumenti za prijenos:</h4></li>
                            {attachments.map((file, index) => (
                                <li key={index} className="attachment-item">
                                    <div className="attachment-info">
                                        <span className="attachment-name">{file.name}</span>
                                        <span className="attachment-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                    </div>
                                    <label htmlFor={`attachment-desc-${index}`} className="visually-hidden">Opis za {file.name}</label>
                                    <input type="text" id={`attachment-desc-${index}`} placeholder="Opis dokumenta (opcionalno)" value={fileDescriptions[index]} onChange={(e) => handleDescriptionChange(index, e.target.value)} className="attachment-description" disabled={isSubmitting} />
                                    <IconButton size="small" onClick={() => handleRemoveFile(index)} disabled={isSubmitting} className="remove-attachment-button" aria-label={`Ukloni datoteku ${file.name}`}><DeleteIcon fontSize="small" /></IconButton>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <footer className="form-actions">
                    <button type="submit" className="button-primary form-submit-button" disabled={isSubmitting || submitStatus.success}>{isSubmitting ? 'Stvaranje...' : 'Stvori natječaj'}</button>
                    <button type="button" onClick={() => navigate('/dashboard')} className="button-secondary form-cancel-button" disabled={isSubmitting}>Odustani</button>
                </footer>
            </form>
        </main>
    );
}

export default CreateProposalPage;