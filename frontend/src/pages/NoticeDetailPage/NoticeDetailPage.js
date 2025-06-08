import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchNoticeById, deleteNotice } from '../../services/noticeService';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import NoticeDetailInfo from '../../components/NoticeDetailInfo/NoticeDetailInfo';
import NoticeAttachments from '../../components/NoticeAttachments/NoticeAttachments';
import EditNoticeModal from '../../components/EditNoticeModal/EditNoticeModal';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import { formatDateCroatian } from '../../utils/formatters';
import './NoticeDetailPage.css';

function NoticeDetailPage() {
    const { noticeId } = useParams();
    const navigate = useNavigate();

    const [notice, setNotice] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('details');
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!noticeId) {
            setError("Notice ID not found in URL.");
            setIsLoading(false);
            return;
        }

        const loadNotice = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchNoticeById(noticeId);
                setNotice(data);
            } catch (err) {
                setError(err.message || `Failed to load notice ${noticeId}.`);
            } finally {
                setIsLoading(false);
            }
        };

        loadNotice();
    }, [noticeId]);
    
    const handleNoticeUpdated = useCallback((updatedNotice) => {
        setNotice(updatedNotice);
        setIsEditModalOpen(false);
    }, []);
    
    const handleConfirmDelete = async () => {
        if (!notice) return;
        setIsDeleting(true);
        try {
            await deleteNotice(noticeId);
            const destination = notice.proposal?.id ? `/proposals/${notice.proposal.id}` : '/notices';
            navigate(destination, { 
                state: { activeTab: 'notices', message: 'Obavijest uspješno obrisana.' } 
            });
        } catch (err) {
            setError(err.message || 'Brisanje obavijesti nije uspjelo.');
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };
    
    const noticeName = isLoading ? "Učitavanje..." : (notice?.title || "Obavijest nije pronađena");

    return (
        <main className="notice-detail-page">
            <div className="back-link-container">
                <button onClick={() => navigate(-1)} className="back-link-button">
                    ← Natrag
                </button>
            </div>

            {error && !isLoading && (
                <div className="alert alert-danger detail-error" role="alert">
                    Greška: {error} <br />
                    <Link to="/notices">Vrati se na popis</Link>
                </div>
            )}

            <header className="detail-page-header">
                <div className="header-content">
                    <h1 className="header-headline">{noticeName}</h1>
                    {!isLoading && notice && (
                         <p className="header-meta">Objavljeno: {formatDateCroatian(notice.createdAt)}</p>
                    )}
                </div>
                <div className="header-image-area">
                    <div className="notice-card-image-container">
                        <img
                            src="/news.jpg" 
                            alt={`Vizualni prikaz za obavijest: ${noticeName}`}
                            className="notice-card-image"
                            loading="lazy"
                        />
                    </div>
                </div>
            </header>
            
            {isLoading && !error && <LoadingSpinner />}

            {!isLoading && !error && notice && (
                <>
                    <div className="notice-content-area">
                        <div className="notice-tabs" role="tablist" aria-label="Informacije o obavijesti">
                            <button
                                id="tab-details"
                                className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
                                role="tab"
                                aria-selected={activeTab === 'details'}
                                aria-controls="panel-details"
                                onClick={() => setActiveTab('details')}
                            >
                                Detalji
                            </button>
                            <button
                                id="tab-attachments"
                                className={`tab-button ${activeTab === 'attachments' ? 'active' : ''}`}
                                role="tab"
                                aria-selected={activeTab === 'attachments'}
                                aria-controls="panel-attachments"
                                onClick={() => setActiveTab('attachments')}
                            >
                                Dodatci
                            </button>
                        </div>
                        <div className="tab-content">
                            {activeTab === 'details' && (
                                <section id="panel-details" role="tabpanel" aria-labelledby="tab-details" tabIndex="0">
                                    <NoticeDetailInfo notice={notice} onEdit={() => setIsEditModalOpen(true)} onDelete={() => setIsDeleteModalOpen(true)} />
                                </section>
                            )}
                             {activeTab === 'attachments' && (
                                <section id="panel-attachments" role="tabpanel" aria-labelledby="tab-attachments" tabIndex="0">
                                    <NoticeAttachments noticeId={notice.id} />
                                </section>
                            )}
                        </div>
                    </div>
                </>
            )}

            {notice && (
                <>
                    <EditNoticeModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        notice={notice}
                        onNoticeUpdated={handleNoticeUpdated}
                    />
                    
                    <ConfirmationModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
                        onConfirm={handleConfirmDelete}
                        title="Potvrdi brisanje obavijesti"
                        message={`Jeste li sigurni da želite obrisati obavijest "${notice.title}"? Ova akcija ne može biti poništena.`}
                        confirmText="Obriši"
                        cancelText="Odustani"
                        isLoading={isDeleting}
                    />
                </>
            )}
        </main>
    );
}

export default NoticeDetailPage;