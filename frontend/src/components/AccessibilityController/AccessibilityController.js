import React, { useState, useEffect, useRef } from 'react';
import './AccessibilityController.css';

function AccessibilityController() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [isDyslexicFont, setIsDyslexicFont] = useState(false);

  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const savedFontSize = localStorage.getItem('appFontSize');
    if (savedFontSize) {
      const size = parseInt(savedFontSize, 10);
      setFontSize(size);
      applyFontSize(size);
    }
    
    const savedDyslexicFont = localStorage.getItem('appDyslexicFont');
    if (savedDyslexicFont === 'true') {
      setIsDyslexicFont(true);
      applyDyslexicFont(true);
    }
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    const handleClickOutside = (event) => {
      if (isOpen && panelRef.current && !panelRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const applyFontSize = (size) => {
    document.documentElement.style.fontSize = `${size}%`;
  };

  const applyDyslexicFont = (isEnabled) => {
    if (isEnabled) {
      document.documentElement.classList.add('dyslexic-font');
    } else {
      document.documentElement.classList.remove('dyslexic-font');
    }
  };

  const handleFontSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setFontSize(newSize);
    applyFontSize(newSize);
    localStorage.setItem('appFontSize', newSize.toString());
  };

  const handleDyslexicFontToggle = (e) => {
    const isEnabled = e.target.checked;
    setIsDyslexicFont(isEnabled);
    applyDyslexicFont(isEnabled);
    localStorage.setItem('appDyslexicFont', isEnabled.toString());
  };

  const handleReset = () => {
    setFontSize(100);
    applyFontSize(100);
    localStorage.removeItem('appFontSize');
    
    setIsDyslexicFont(false);
    applyDyslexicFont(false);
    localStorage.removeItem('appDyslexicFont');
  };

  return (
    <div className={`accessibility-controller ${isOpen ? 'open' : ''}`}>
      <button 
        ref={buttonRef}
        className="accessibility-toggle-button" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Postavke pristupačnosti"
        title="Postavke pristupačnosti"
        aria-haspopup="true"
        aria-controls="accessibility-panel"
        aria-expanded={isOpen}
      >
        <svg className="accessibility-icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><line x1="12" y1="2" x2="12" y2="4" /><line x1="12" y1="20" x2="12" y2="22" /><line x1="2" y1="12" x2="4" y2="12" /><line x1="20" y1="12" x2="22" y2="12" />
        </svg>
      </button>
      
      {isOpen && (
        <div id="accessibility-panel" ref={panelRef} className="accessibility-panel" role="dialog" aria-modal="true" aria-labelledby="panel-title">
          <h3 id="panel-title" className="panel-title">Postavke pristupačnosti</h3>
          
          <fieldset className="control-section">
            <legend className="section-title">Veličina teksta</legend>
            <div className="font-size-display" aria-live="polite">
              <span className="size-value">{fontSize}%</span>
            </div>
            <div className="slider-container">
              <label htmlFor="font-size-slider" className="slider-label slider-label-min">A</label>
              <input
                id="font-size-slider"
                type="range"
                min="80"
                max="160"
                value={fontSize}
                onChange={handleFontSizeChange}
                className="font-size-slider"
                aria-label="Prilagodi veličinu teksta"
              />
              <label htmlFor="font-size-slider" className="slider-label slider-label-max">A</label>
            </div>
          </fieldset>
          
          <div className="control-section">
            <label htmlFor="dyslexic-font-toggle" className="toggle-group">
              <span className="section-title">Font za disleksiju</span>
              <div className="toggle-switch">
                <input
                  id="dyslexic-font-toggle"
                  type="checkbox"
                  checked={isDyslexicFont}
                  onChange={handleDyslexicFontToggle}
                />
                <span className="toggle-slider" aria-hidden="true"></span>
              </div>
            </label>
          </div>
          
          <button 
            type="button"
            className="reset-button"
            onClick={handleReset}
          >
            Poništi
          </button>
        </div>
      )}
    </div>
  );
}

export default AccessibilityController;