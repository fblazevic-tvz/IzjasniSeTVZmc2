import React, { useState } from 'react';
import './AboutPage.css';
import PropTypes from 'prop-types';

const FaqItem = ({ id, question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);
  const answerId = `faq-answer-${id}`;
  const questionId = `faq-question-${id}`;

  return (
    <div className="faq-item">
      <h3 className="faq-question">
        <button
          onClick={toggleOpen}
          aria-expanded={isOpen}
          aria-controls={answerId}
          id={questionId}
          className="faq-toggle-button"
        >
          {question}
          <span className="faq-icon-placeholder" aria-hidden="true">{isOpen ? '−' : '+'}</span>
        </button>
      </h3>
      <div
        id={answerId}
        role="region"
        aria-labelledby={questionId}
        className={`faq-answer ${isOpen ? 'open' : ''}`}
      >
        <p>{answer}</p>
      </div>
    </div>
  );
};

FaqItem.propTypes = {
  id: PropTypes.number.isRequired,
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
};

function AboutPage() {
  const faqData = [
    { id: 1, question: "Kako mogu predati svoj prijedlog?", answer: "Prijedlog možete predati putem obrasca dostupnog na stranici pojedinog natječaja nakon što se prijavite u sustav. Potrebno je ispuniti sva obavezna polja uključujući naziv, opis, lokaciju i procijenjeni trošak." },
    { id: 2, question: "Tko može glasati za prijedloge?", answer: "Pravo glasa imaju svi registrirani korisnici platforme. Detalji o procesu verifikacije mogu se naći u pravilima korištenja." },
    { id: 3, question: "Kako se odabiru pobjednički prijedlozi?", answer: "Pobjednički prijedlozi odabiru se na temelju broja glasova prikupljenih tijekom perioda glasanja, uzimajući u obzir raspoloživi budžet za određeni natječaj i provjeru izvedivosti od strane gradskih službi." },
    { id: 4, question: "Gdje mogu pratiti status svog prijedloga?", answer: "Status vašeg prijedloga možete pratiti na stranici 'Moji prijedlozi' unutar vaše Upravljačke ploče." },
    { id: 5, question: "Kako mogu kontaktirati administratore?", answer: "Za kontakt s administratorima platforme, molimo pošaljite email na info@izjasnise.hr." }
  ];

  return (
    <main className="about-page-container">
      <section className="about-hero-section">
        <div className="about-hero-content">
          <div className="about-hero-text">
            <h1 className="about-hero-headline">O nama</h1>
            <p className="about-hero-paragraph">
              Dobrodošli na IzjasniSe, platformu posvećenu poticanju građanskog
              angažmana i poboljšanju naših lokalnih zajednica. Vjerujemo u snagu
              kolektivnog glasa i transparentnost u donošenju odluka.
            </p>
            <p className="about-hero-paragraph">
              Naša misija je pružiti jednostavan i pristupačan način za građane da
              predlažu ideje, glasaju za prijedloge i prate obavijesti vezane uz
              razvoj grada.
            </p>
          </div>
        </div>
        <figure className="about-hero-image-area">
          <img
            src="/cta.jpg"
            alt="Ilustracija suradnje u zajednici"
            className="about-hero-image"
          />
        </figure>
      </section>

      <section className="about-team-section">
        <header className="section-text-container">
          <h2 className="section-secondary-headline">Naš tim</h2>
          <p className="section-paragraph">
            Upoznajte ljude koji stoje iza platforme IzjasniSe, posvećene transparentnosti i boljitku zajednice.
          </p>
        </header>
        <ul className="team-members-container">
          <li className="team-member-card">
            <figure className="team-member-image-wrapper">
              <img
                src="/Franjo.png"
                alt="Član tima - Franjo Blažević"
                className="team-member-image"
              />
            </figure>
            <figcaption className="team-member-info">
              <span className="team-member-name">Franjo Blažević</span>
              <span className="team-member-role">Razvojni inženjer</span>
            </figcaption>
          </li>
          <li className="team-member-card">
            <figure className="team-member-image-wrapper">
              <img
                src="/Dario.jpg"
                alt="Član tima - Dario Drame"
                className="team-member-image"
              />
            </figure>
            <figcaption className="team-member-info">
              <span className="team-member-name">Dario Drame</span>
              <span className="team-member-role">Dizajn i istraživanje tržišta</span>
            </figcaption>
          </li>
        </ul>
      </section>

      <section className="about-faq-section">
        <header className="section-text-container">
          <h2 className="section-secondary-headline">Često postavljana pitanja</h2>
        </header>
        <div className="faq-list">
          {faqData.map(faq => (
            <FaqItem key={faq.id} id={faq.id} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default AboutPage;
