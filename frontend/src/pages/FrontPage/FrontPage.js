import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProposals } from '../../services/proposalService';
import { fetchNotices } from '../../services/noticeService';
import ProposalList from '../../components/ProposalList/ProposalList';
import NoticeList from '../../components/NoticeList/NoticeList';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import CallToActionSection from '../../components/CallToActionSection/CallToActionSection';
import './FrontPage.css';

function FrontPage() {
  const [proposals, setProposals] = useState([]);
  const [isLoadingProposals, setIsLoadingProposals] = useState(false);
  const [errorProposals, setErrorProposals] = useState(null);

  const [latestNotices, setLatestNotices] = useState([]);
  const [isLoadingNotices, setIsLoadingNotices] = useState(false);
  const [errorNotices, setErrorNotices] = useState(null);

  useEffect(() => {
    const loadProposals = async () => {
      setIsLoadingProposals(true);
      setErrorProposals(null);
      try {
        const data = await fetchProposals();
        setProposals(data);
      } catch (err) {
        setErrorProposals(err.message || 'Failed to load proposals.');
      } finally {
        setIsLoadingProposals(false);
      }
    };
    loadProposals();
  }, []);

  useEffect(() => {
    const loadNotices = async () => {
      setIsLoadingNotices(true);
      setErrorNotices(null);
      try {
        const allNotices = await fetchNotices();
        const sortedNotices = allNotices.sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setLatestNotices(sortedNotices.slice(0, 3));
      } catch (err) {
        setErrorNotices(err.message || 'Failed to load notices.');
      } finally {
        setIsLoadingNotices(false);
      }
    };
    loadNotices();
  }, []);

  const limitedProposals = proposals.slice(0, 3);

  return (
    <main className="front-page-layout">
      <CallToActionSection />

      <section className="front-page-section front-page-section-alt" aria-labelledby="proposals-heading">
        <div className="section-text-container">
          <h2 id="proposals-heading" className="section-secondary-headline">
            Otvoreni natječaji
          </h2>
          <p className="section-paragraph">
            Pregledajte najnovije natječaje i uključite se u proces predlaganjem ideja za poboljšanje našeg grada.
          </p>
        </div>
        <div className="content-list-area">
          {isLoadingProposals && <LoadingSpinner />}
          {errorProposals && <div className="alert alert-danger" role="alert">Error: {errorProposals}</div>}
          {!isLoadingProposals && !errorProposals && (
            limitedProposals.length > 0
              ? <ProposalList proposals={limitedProposals} />
              : <p className="no-content-message">Trenutno nema aktivnih natječaja.</p>
          )}
        </div>
        <Link to="/proposals" className="section-cta-button button-primary">
          Svi natječaji
        </Link>
      </section>

      <section className="front-page-section" aria-labelledby="notices-heading">
        <div className="section-text-container">
          <h2 id="notices-heading" className="section-secondary-headline">
            Najnovije obavijesti
          </h2>
          <p className="section-paragraph">
            Budite u toku s važnim informacijama i novostima vezanim uz gradske projekte i inicijative.
          </p>
        </div>
        <div className="content-list-area">
          {isLoadingNotices && <LoadingSpinner />}
          {errorNotices && <div className="alert alert-danger" role="alert">Error: {errorNotices}</div>}
          {!isLoadingNotices && !errorNotices && (
            latestNotices.length > 0
              ? <NoticeList notices={latestNotices} />
              : <p className="no-content-message">Trenutno nema novih obavijesti.</p>
          )}
        </div>
        <Link to="/notices" className="section-cta-button button-primary">
          Sve obavijesti
        </Link>
      </section>
    </main>
  );
}

export default FrontPage;