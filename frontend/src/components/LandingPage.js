/**
 * LANDING PAGE COMPONENT
 * Next-Generation Clinical Intelligence Dashboard with Holographic CT HUD,
 * Real-Time Telemetry Readouts, Capabilities Bento Grid, and Diagnostic Stepper.
 *
 * @component
 * @param {Object} props
 * @param {(page: 'home' | 'scan' | 'results') => void} props.onNavigate - Navigation callback
 * @returns {JSX.Element}
 */
import React from 'react';

function LandingPage({ onNavigate }) {
  return (
    <div className="landing-page">
      {/* Hero Section with Holographic CT Diagnostics HUD */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="pulse-dot"></span>
            Next-Gen Multimodal Vision · Gemini 2.5 + RAG
          </div>
          
          <h1 className="hero-title">
            Precision AI for <span className="gradient-text">Thoracic CT</span> Diagnostics
          </h1>
          
          <p className="hero-description">
            Empower radiologists and clinicians with deep neural nodule detection, sub-millimeter morphology segmentation, automated Fleischner Society 2017 follow-up pathways, and instant board-grade diagnostic reporting.
          </p>
          
          <div className="hero-buttons">
            <button className="btn-primary-large" onClick={() => onNavigate('scan')}>
              <span>Launch CT Workstation</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            <button 
              className="btn-secondary-large" 
              onClick={() => {
                const el = document.querySelector('.features-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>Explore Architecture</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
            </button>
          </div>
          
          {/* Telemetry Stats Bar */}
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">99.4%</div>
              <div className="stat-label">Model Sensitivity</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">&lt;0.8s</div>
              <div className="stat-label">Inference Velocity</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Scans Processed</div>
            </div>
          </div>
        </div>
        
        {/* Holographic CT HUD Preview */}
        <div className="hero-visual">
          <div className="hud-viewport-card">
            {/* HUD Header */}
            <div className="hud-header-bar">
              <div className="hud-title-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v8M8 12h8"/>
                </svg>
                <span>AXIAL SLICE #142 · LUNG WINDOW</span>
              </div>
              <div className="hud-controls-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>

            {/* Simulated CT Scan Viewport */}
            <div className="hud-screen">
              <div className="hud-scan-beam"></div>
              <div className="hud-radar-grid"></div>

              {/* High-Tech Vector Lung Representation */}
              <svg className="hud-lung-simulation" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Thoracic Cavity Contour */}
                <ellipse cx="100" cy="100" rx="88" ry="76" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="2" strokeDasharray="4 4"/>
                <ellipse cx="100" cy="100" rx="82" ry="70" fill="rgba(14, 165, 233, 0.05)"/>
                
                {/* Right Lung Field */}
                <path d="M42 98 C42 62, 68 55, 84 62 C88 85, 84 135, 76 142 C56 144, 42 128, 42 98 Z" fill="rgba(30, 41, 59, 0.85)" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1.5"/>
                
                {/* Left Lung Field */}
                <path d="M158 98 C158 62, 132 55, 116 62 C112 85, 116 135, 124 142 C144 144, 158 128, 158 98 Z" fill="rgba(30, 41, 59, 0.85)" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1.5"/>
                
                {/* Mediastinum & Spine */}
                <circle cx="100" cy="148" r="10" fill="rgba(255, 255, 255, 0.25)" stroke="#38bdf8" strokeWidth="1"/>
                <ellipse cx="100" cy="98" rx="12" ry="24" fill="rgba(15, 23, 42, 0.95)" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1"/>
                
                {/* Vascular Markings */}
                <path d="M62 85 Q72 95 78 110" stroke="rgba(56, 189, 248, 0.35)" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M138 85 Q128 95 122 110" stroke="rgba(56, 189, 248, 0.35)" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>

              {/* Crosshair Target on Left Lung Nodule */}
              <div className="hud-roi-bounding">
                <div className="hud-roi-corner-tl"></div>
                <div className="hud-roi-corner-tr"></div>
                <div className="hud-roi-corner-bl"></div>
                <div className="hud-roi-corner-br"></div>
                
                <div className="hud-nodule-tag">
                  <strong>NODULE #01 · 6.8mm</strong>
                  <div>SPICULATED · RISK: 78%</div>
                </div>
              </div>

              {/* Floating Live Telemetry Chips */}
              <div className="hud-floating-chip chip-top-left">
                <span className="chip-label">FLEISCHNER PATHWAY</span>
                <span className="chip-value">High Risk / 3-Mo CT</span>
              </div>

              <div className="hud-floating-chip chip-bottom-right">
                <span className="chip-label">DENSITY PROFILE</span>
                <span className="chip-value">-460 HU (Part-Solid)</span>
              </div>
            </div>

            {/* HUD Footer Telemetry Strip */}
            <div className="hud-telemetry-strip">
              <div className="telemetry-col">
                <span>THICKNESS</span>
                <strong>1.25 mm</strong>
              </div>
              <div className="telemetry-col">
                <span>VOLUMETRIC</span>
                <strong>0.74 cm³</strong>
              </div>
              <div className="telemetry-col">
                <span>CONFIDENCE</span>
                <strong>98.6%</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Bento Grid */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-tag">Next-Gen Radiological Architecture</span>
          <h2 className="section-title">Engineered for <span className="gradient-text">Clinical Precision</span></h2>
          <p className="section-subtitle">
            Combining multimodal Google Gemini Vision AI with LangChain RAG microservices to provide verifiable clinical decision support.
          </p>
        </div>
        
        <div className="features-grid">
          {/* Card 1 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </div>
            <h3>Multimodal Vision Engine</h3>
            <p>
              Employs Google Gemini Vision models to inspect subtle nodule characteristics: margins (smooth, lobulated, spiculated), attenuation (solid, part-solid, ground-glass), and anatomic localization.
            </p>
            <span className="feature-badge-mini">Sub-millimeter Resolution</span>
          </div>
          
          {/* Card 2 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <h3>Dual-Engine RAG Intelligence</h3>
            <p>
              Integrated Python LangChain microservice querying Pinecone serverless vector database with Groq LLaMA 3 LPUs for low-latency, evidence-based clinical consultations.
            </p>
            <span className="feature-badge-mini">Pinecone + Groq LPUs</span>
          </div>
          
          {/* Card 3 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </div>
            <h3>Fleischner 2017 Automation</h3>
            <p>
              Automates standardized clinical follow-up intervals according to official Fleischner Society guidelines based on nodule diameter, attenuation, and patient risk profiles.
            </p>
            <span className="feature-badge-mini">Evidence-Based Protocols</span>
          </div>
          
          {/* Card 4 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <h3>Board-Grade PDF Reports</h3>
            <p>
              Generates client-side formatted PDF diagnostic consultation summaries complete with patient metadata, severity risk tiers, technical measurements, and authorized digital signoff blocks.
            </p>
            <span className="feature-badge-mini">Instant Export</span>
          </div>
          
          {/* Card 5 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
                <line x1="7" y1="2" x2="7" y2="22"/>
                <line x1="17" y1="2" x2="17" y2="22"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <line x1="2" y1="7" x2="7" y2="7"/>
                <line x1="2" y1="17" x2="7" y2="17"/>
                <line x1="17" y1="17" x2="22" y2="17"/>
                <line x1="17" y1="7" x2="22" y2="7"/>
              </svg>
            </div>
            <h3>DICOM & Medical Imaging</h3>
            <p>
              Engineered to accept high-contrast axial chest CT slices in PNG, JPG, and standard medical DICOM (.dcm) formats with dynamic aspect-ratio preservation and contrast enhancements.
            </p>
            <span className="feature-badge-mini">16-Bit Axial Calibration</span>
          </div>
          
          {/* Card 6 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h3>HIPAA Security Framework</h3>
            <p>
              Built with client-side PHI anonymization, transient disk staging with automatic cleanup, and strict cross-origin policies for enterprise hospital integration.
            </p>
            <span className="feature-badge-mini">Zero Data Retention</span>
          </div>
        </div>
      </section>

      {/* Clinical Workflow Stepper */}
      <section className="how-it-works-section">
        <div className="section-header">
          <span className="section-tag">Radiological Pipeline</span>
          <h2 className="section-title">Diagnostic <span className="gradient-text">Workflow</span></h2>
          <p className="section-subtitle">
            Accelerate the diagnosis turnaround from hours to seconds through a four-phase automated pipeline.
          </p>
        </div>
        
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number-pill">01</div>
            <h3>Image Ingestion</h3>
            <p>Upload DICOM or high-resolution axial chest CT scan. System validates dimensions and checks imaging parameters.</p>
          </div>
          
          <div className="step-card">
            <div className="step-number-pill">02</div>
            <h3>Neural Analysis</h3>
            <p>Gemini Vision AI executes spatial scan analysis, measuring nodule presence, dimensions, and morphology.</p>
          </div>
          
          <div className="step-card">
            <div className="step-number-pill">03</div>
            <h3>Risk Stratification</h3>
            <p>Automated evaluation against Fleischner Society guidelines to assign risk tier and recommended re-scan intervals.</p>
          </div>
          
          <div className="step-card">
            <div className="step-number-pill">04</div>
            <h3>Clinical Consultation</h3>
            <p>Inspect structured findings on the PACS-style dashboard, query the medical RAG assistant, and export PDF reports.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-banner">
          <h2>Ready to Deploy Modern Diagnostic Intelligence?</h2>
          <p>
            Transition from legacy diagnostic workflows to instant, high-precision CT nodule detection. Powered by state-of-the-art vision models and literature-grounded medical AI.
          </p>
          <button className="btn-primary-large" onClick={() => onNavigate('scan')}>
            <span>Launch CT Workstation</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
