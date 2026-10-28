/**
 * RESULT DISPLAY COMPONENT
 * Next-Gen PACS Workstation Dashboard presenting Gemini Vision AI inferences,
 * nodule segmentation metrics, Fleischner Society recommendations, and PDF generation.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.result - Structured prediction response from API
 * @param {string} props.imagePath - Path to analyzed scan
 * @returns {JSX.Element | null}
 */
import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const ResultDisplay = ({ result, imagePath }) => {
  if (!result) return null;

  const { prediction } = result;

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high': return '#f43f5e';
      case 'moderate': return '#f59e0b';
      case 'low': return '#10b981';
      case 'none': return '#0ea5e9';
      default: return '#64748b';
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high': return '🔴';
      case 'moderate': return '🟠';
      case 'low': return '🟡';
      case 'none': return '🟢';
      default: return '⚪';
    }
  };

  /**
   * Generates a downloadable diagnostic clinical report PDF using jsPDF and jspdf-autotable.
   */
  const generatePDF = () => {
    const doc = new jsPDF();
    const date = new Date(prediction.timestamp || Date.now()).toLocaleString();
    const reportId = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(14, 165, 233);
    doc.text('PneumoScan Diagnostic Report', 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on: ${date}`, 14, 30);
    doc.text(`Report ID: PN-${reportId}`, 14, 35);
    doc.text(`Clinical Protocol: Fleischner Society 2017 Guidelines`, 14, 40);

    doc.setDrawColor(226, 232, 240);
    doc.line(14, 45, 196, 45); // Divider

    // Diagnosis Section
    doc.setFontSize(15);
    doc.setTextColor(15, 23, 42);
    doc.text('Clinical Diagnosis & Stratification', 14, 56);

    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text(`Result: ${prediction.result}`, 14, 65);
    doc.text(`Confidence Level: ${prediction.confidence}%`, 14, 73);
    doc.text(`Risk Tier: ${prediction.riskLevel.toUpperCase()}`, 14, 81);

    // Technical Measurements Table
    autoTable(doc, {
      startY: 90,
      head: [['Parameter', 'Measurement / Characteristic']],
      body: [
        ['Nodule Size', prediction.technicalDetails?.noduleSize || 'N/A'],
        ['Location', prediction.technicalDetails?.location || 'N/A'],
        ['Shape & Margins', prediction.technicalDetails?.shape || 'N/A'],
        ['Attenuation / Density', prediction.technicalDetails?.density || 'N/A'],
        ['Image Quality', prediction.imageQuality || 'Diagnostic Grade'],
        ['Analysis Engine', prediction.analysisEngine || 'Gemini Multimodal Vision AI']
      ],
      theme: 'grid',
      headStyles: { fillColor: [14, 165, 233] }
    });

    // Recommendations (Rx Format)
    doc.setFontSize(15);
    doc.setTextColor(15, 23, 42);
    doc.text('Rx / Fleischner Clinical Action Plan', 14, doc.lastAutoTable.finalY + 16);

    const recs = (prediction.recommendations || []).map(r => [
      r.replace(/[📋💊🔬👨‍⚕️🏥📅⚠️✅]/g, '').trim()
    ]);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 22,
      head: [['Recommended Action Plan']],
      body: recs.length > 0 ? recs : [['Routine follow-up as clinically indicated.']],
      theme: 'striped',
      headStyles: { fillColor: [15, 23, 42] }
    });

    // Authorized signature line
    const finalY = doc.lastAutoTable.finalY + 28;
    doc.setDrawColor(148, 163, 184);
    doc.line(140, finalY, 190, finalY);
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('PneumoScan Authorized AI Signoff', 140, finalY + 5);

    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  };

  const fullImageUrl = imagePath && imagePath.startsWith('http') 
    ? imagePath 
    : `${BACKEND_BASE_URL}${imagePath}`;

  return (
    <div className="result-section">
      {/* Top Clinical Header Bar */}
      <div className="result-header-bar">
        <div className="result-title-group">
          <h2>Radiological Assessment</h2>
          <p className="result-meta-tagline">
            SESSION #PN-{Math.random().toString(36).substring(2, 8).toUpperCase()} · FLEISCHNER SOCIETY 2017 PROTOCOL
          </p>
        </div>
        <button className="btn-download-pdf" onClick={generatePDF}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="12" y1="18" x2="12" y2="12"/>
            <line x1="9" y1="15" x2="15" y2="15"/>
          </svg>
          <span>Export Clinical PDF Report</span>
        </button>
      </div>

      <div className="result-container nested-structure">
        {/* Left Column: Analyzed CT Scan & Radiological Impressions */}
        <div className="result-column-left">
          <div className="result-card image-card">
            <h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="4"/>
                <circle cx="12" cy="12" r="5"/>
              </svg>
              <span>Ingested Thoracic CT Viewport</span>
            </h3>
            <div className="image-wrapper">
              <img
                src={fullImageUrl}
                alt="Analyzed Thoracic CT Scan"
                className="ct-scan-image"
              />
            </div>
          </div>

          {prediction.findings && (
            <div className="result-card findings-card">
              <h4>🔍 Radiological Impressions</h4>
              <p className="findings-text">{prediction.findings}</p>
            </div>
          )}
        </div>

        {/* Right Column: Classification, Measurements & Clinical Pathways */}
        <div className="result-column-right">
          {/* Main Classification Card */}
          <div className="result-card main-result">
            <div className="result-header">
              <h3>Diagnostic Classification</h3>
              <span className="risk-badge" style={{ backgroundColor: getRiskColor(prediction.riskLevel) }}>
                {getRiskIcon(prediction.riskLevel)} {prediction.riskLevel.toUpperCase()} RISK
              </span>
            </div>

            <div className="result-diagnosis">
              <p className="diagnosis-text">{prediction.result}</p>
              
              <div className="confidence-meter">
                <div className="confidence-label">
                  <span>Multimodal Neural Confidence</span>
                  <strong>{prediction.confidence}%</strong>
                </div>
                <div className="confidence-bar">
                  <div
                    className="confidence-fill"
                    style={{
                      width: `${prediction.confidence}%`,
                      backgroundColor: getRiskColor(prediction.riskLevel)
                    }}
                  />
                </div>
              </div>
            </div>

            {prediction.description && (
              <p className="result-description">{prediction.description}</p>
            )}
          </div>

          {/* Measurements & Action Plan Grid */}
          <div className="grid-2-col">
            {/* Technical Measurements */}
            <div className="result-card details-card">
              <h4>Technical Telemetry</h4>
              <ul className="details-list">
                <li>
                  <span className="detail-label">Nodule Size</span>
                  <span className="detail-value">{prediction.technicalDetails?.noduleSize || 'N/A'}</span>
                </li>
                <li>
                  <span className="detail-label">Anatomic Lobe</span>
                  <span className="detail-value">{prediction.technicalDetails?.location || 'Unspecified'}</span>
                </li>
                <li>
                  <span className="detail-label">Margin Morphology</span>
                  <span className="detail-value">{prediction.technicalDetails?.shape || 'N/A'}</span>
                </li>
                <li>
                  <span className="detail-label">Attenuation / Density</span>
                  <span className="detail-value">{prediction.technicalDetails?.density || 'Part-solid'}</span>
                </li>
                <li>
                  <span className="detail-label">Inference Model</span>
                  <span className="detail-value">{prediction.analysisEngine || 'Gemini Vision AI'}</span>
                </li>
              </ul>
            </div>

            {/* Actionable Clinical Recommendations */}
            <div className="result-card recommendations-card">
              <h4>Clinical Action Plan (Rx)</h4>
              <ul className="recommendations-list">
                {prediction.recommendations && prediction.recommendations.length > 0 ? (
                  prediction.recommendations.map((rec, idx) => (
                    <li key={idx}>
                      <span>›</span>
                      <span>{rec}</span>
                    </li>
                  ))
                ) : (
                  <li>Follow standard institutional oncology protocols.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
