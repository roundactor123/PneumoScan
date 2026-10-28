/**
 * NAVBAR COMPONENT
 * Renders the top sticky glassmorphic navigation bar with modern medical pulse logo,
 * neural engine status beacon, smooth section scrolling, and light/dark theme switch.
 *
 * @component
 * @param {Object} props
 * @param {string} props.currentPage - Name of the active route ('home' | 'scan' | 'results')
 * @param {(page: string) => void} props.onNavigate - Page change handler
 * @param {'light' | 'dark'} props.theme - Active visual theme
 * @param {() => void} props.onToggleTheme - Callback toggling light/dark mode
 * @returns {JSX.Element}
 */
import React, { useState, useEffect } from 'react';

const Navbar = ({ currentPage, onNavigate, theme, onToggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Monitor scroll position to apply elevated blurred header effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * Smoothly scrolls to a landing page section (e.g. features, how-it-works).
   * Switches to 'home' page first if the user is currently on scan/results.
   *
   * @param {string} selector - CSS selector of the destination element
   */
  const scrollToSection = (selector) => {
    setMobileMenuOpen(false);
    if (currentPage !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        const section = document.querySelector(selector);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const section = document.querySelector(selector);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  /**
   * Closes mobile drawer and navigates to the specified view.
   *
   * @param {string} page - Target view identifier
   */
  const handleNavClick = (page) => {
    setMobileMenuOpen(false);
    onNavigate(page);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Brand Logo & Medical Crosshair Beacon */}
        <div className="navbar-logo" onClick={() => handleNavClick('home')}>
          <div className="logo-icon-wrapper">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" strokeDasharray="3 3" opacity="0.6"/>
              <circle cx="12" cy="12" r="4.5" stroke="#06b6d4" strokeWidth="2"/>
              <path d="M12 2V6M12 18V22M2 12H6M18 12H22" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="12" r="1.5" fill="#10b981"/>
            </svg>
          </div>
          <div className="logo-text">
            <span className="logo-main">
              PneumoScan
              <span className="nav-status-pill">
                <span className="status-beacon"></span>
                AI Active
              </span>
            </span>
            <span className="logo-sub">Diagnostic Intelligence OS</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className={`navbar-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <button 
            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
          >
            Overview
          </button>
          <button 
            className="nav-link" 
            onClick={() => scrollToSection('.features-section')}
          >
            Capabilities
          </button>
          <button 
            className="nav-link" 
            onClick={() => scrollToSection('.how-it-works-section')}
          >
            Clinical Workflow
          </button>
          <button 
            className={`nav-link ${currentPage === 'scan' ? 'active' : ''}`}
            onClick={() => handleNavClick('scan')}
          >
            CT Scan Workstation
          </button>
        </div>

        {/* Action Button & Theme Toggle */}
        <div className="navbar-actions">
          <button
            className="btn-theme-toggle"
            onClick={onToggleTheme}
            aria-label={`Toggle Theme (currently ${theme === 'dark' ? 'Dark' : 'Light'})`}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <>
                <svg className="theme-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
                <span>Light</span>
              </>
            ) : (
              <>
                <svg className="theme-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
                <span>Dark</span>
              </>
            )}
          </button>

          <button className="btn-nav-primary" onClick={() => handleNavClick('scan')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5V19M5 12H19"/>
            </svg>
            <span>Launch Scan</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button 
            className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
