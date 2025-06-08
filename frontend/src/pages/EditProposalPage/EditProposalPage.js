import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchProposalById, updateProposal } from '../../services/proposalService';
import { fetchProposalAttachments, uploadProposalAttachments, deleteProposalAttachment } from '../../services/proposalAttachmentService';
import { fetchCities } from '../../services/cityService';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import './EditProposalPage.css';

function EditProposalPage() {
    const { proposalId } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [maxBudget, setMaxBudget] = useState('');
    const [submissionStartDate, setSubmissionStartDate] = useState('');
    const [submissionStartTime, setSubmissionStartTime] = useState('00:00');
    const [submissionEndDate, setSubmissionEndDate] = useState('');
    const [submissionEndTime, setSubmissionEndTime] = useState('23:59');
    const [status, setStatus] = useState('');
    const [cityId, setCityId] = useState('');

    const [existingAttachments, setExistingAttachments] = useState([]);
    const [newAttachments, setNewAttachments] = useState([]);
    const [newFileDescriptions, setNewFileDescriptions] = useState([]);

    const [originalProposal, setOriginalProposal] = useState(null);
    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });

    const formatDateTimeLocal = (dateString) => {
        if (!dateString) return { date: '', time: '00:00' };
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return {
            date: `${year}-${month}-${day}`,
            time: `${hours}:${minutes}`
        };
    };

    const loadData = useCallback(async () => {
        if (!proposalId || isNaN(parseInt(proposalId))) {
            setError('Nevažeći ID natječaja.');
            setIsLoading(false);
            return;
        }
        if (!isAuthenticated || user?.role !== 'Moderator') {
            navigate('/dashboard');
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const [proposalData, citiesData, attachmentsData] = await Promise.all([
                fetchProposalById(proposalId),
                fetchCities(),
                fetchProposalAttachments(proposalId)
            ]);

            const proposalModeratorId = proposalData?.moderatorId;
            const currentUserIdNum = user?.userId ? parseInt(user.userId, 10) : null;

            if (proposalModeratorId !== currentUserIdNum) {
                setError('Nemate dozvolu za uređivanje ovog natječaja.');
                setOriginalProposal(null);
                setIsLoading(false);
                return;
            }

            setOriginalProposal(proposalData);
            setName(proposalData.name || '');
            setDescription(proposalData.description || '');
            setMaxBudget(proposalData.maxBudget?.toString() || '');

            const startDateTime = formatDateTimeLocal(proposalData.submissionStart);
            setSubmissionStartDate(startDateTime.date);
            setSubmissionStartTime(startDateTime.time);

            const endDateTime = formatDateTimeLocal(proposalData.submissionEnd);
            setSubmissionEndDate(endDateTime.date);
            setSubmissionEndTime(endDateTime.time);

            setStatus(proposalData.status || 'Active');
            setCityId(proposalData.cityId?.toString() || '');
            setCities(citiesData);
            setExistingAttachments(attachmentsData);

        } catch (err) {
            setError(err.message || 'Greška pri dohvaćanju podataka za uređivanje.');
        } finally {
            setIsLoading(false);
        }
    }, [proposalId, isAuthenticated, navigate, user]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleDeleteExistingAttachment = async (attachmentId, attachmentName) => {

        try {
            await deleteProposalAttachment(attachmentId);
            setExistingAttachments(existingAttachments.filter(att => att.id !== attachmentId));
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
            setNewAttachments([...newAttachments, ...validFiles]);
            setNewFileDescriptions([...newFileDescriptions, ...Array(validFiles.length).fill('')]);
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

        if (!name.trim() || !description.trim() || !maxBudget || !submissionStartDate || !submissionEndDate || !cityId) {
            setSubmitStatus({ success: false, message: 'Sva polja su obavezna.' });
            return;
        }

        const budget = parseFloat(maxBudget);
        if (isNaN(budget) || budget <= 0) {
            setSubmitStatus({ success: false, message: 'Maksimalni budžet mora biti pozitivan broj.' });
            return;
        }

        const startDateTime = new Date(`${submissionStartDate}T${submissionStartTime}:00`);
        const endDateTime = new Date(`${submissionEndDate}T${submissionEndTime}:59`);

        if (endDateTime <= startDateTime) {
            setSubmitStatus({ success: false, message: 'Datum završetka mora biti nakon datuma početka.' });
            return;
        }

        setIsSubmitting(true);
        const updateData = {
            name: name.trim(),
            description: description.trim(),
            maxBudget: budget,
            submissionStart: startDateTime.toISOString(),
            submissionEnd: endDateTime.toISOString(),
            status: status,
            cityId: parseInt(cityId, 10)
        };

        try {
            await updateProposal(proposalId, updateData);

            if (newAttachments.length > 0) {
                await uploadProposalAttachments(proposalId, newAttachments, newFileDescriptions);
            }

            setSubmitStatus({ success: true, message: 'Natječaj uspješno ažuriran!' });
            setTimeout(() => navigate(`/proposals/${proposalId}`), 300);
        } catch (err) {
            setSubmitStatus({ success: false, message: err.message || 'Greška pri ažuriranju natječaja.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <LoadingSpinner />;
    if (error) return <div className="alert alert-danger form-container" role="alert">Greška: {error} <Link to="/dashboard">Povratak na dashboard</Link></div>;
    if (!originalProposal) return <div className="alert alert-warning form-container">Nije moguće učitati podatke natječaja. <Link to="/dashboard">Povratak</Link></div>;

    return (
        <div className="edit-proposal-container form-container">
            <h1 id="form-title" className="form-title">Uredi natječaj</h1>
            <h2 className="form-subtitle">{originalProposal?.name || 'Natječaj'}</h2>

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

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="city-select">Grad:</label>
                        <select id="city-select" className="form-control" value={cityId} onChange={(e) => setCityId(e.target.value)} required disabled={isSubmitting || cities.length === 0}>
                            <option value="" disabled>-- Odaberi grad --</option>
                            {cities.map(city => <option key={city.id} value={city.id}>{city.name} ({city.postcode})</option>)}
                        </select>
                    </div>
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

                <div className="form-actions">
                    <button type="submit" className="button-primary form-submit-button" disabled={isSubmitting || submitStatus.success}>
                        {isSubmitting ? 'Spremanje...' : 'Spremi promjene'}
                    </button>
                    <button type="button" onClick={() => navigate(`/proposals/${proposalId}`)} className="button-secondary form-cancel-button" disabled={isSubmitting}>
                        Odustani
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditProposalPage;