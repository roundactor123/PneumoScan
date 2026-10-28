/**
 * UPLOAD SECTION COMPONENT
 * Next-Gen Surgical CT Upload Chamber with drag-and-drop zone,
 * Quick-Select Clinical Sample CTs, and Real-time Telemetry.
 *
 * @component
 * @param {Object} props
 * @param {(file: File, onProgress: (percent: number) => void) => Promise<void>} props.onUpload - Upload callback
 * @param {boolean} props.isLoading - Whether inference is active
 * @returns {JSX.Element}
 */
import React, { useState, useRef, useCallback } from 'react';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_SIZE_MB = 10;

/**
 * Validates selected file MIME type and maximum file size (10MB limit).
 */
const validateFile = (file) => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Invalid file type. Please upload a PNG or JPG chest CT image.';
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return `File too large. Maximum size is ${MAX_SIZE_MB}MB.`;
  }
  return null;
};

const UploadSection = ({ onUpload, isLoading }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  /**
   * Processes and validates a user-selected file, generating a base64 preview thumbnail.
   */
  const handleFileSelect = useCallback((file) => {
    const error = validateFile(file);
    if (error) {
      alert(error);
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  }, []);

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleAnalyze = () => {
    if (selectedFile && onUpload) {
      setUploadProgress(0);
      onUpload(selectedFile, (progress) => setUploadProgress(progress));
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Generates a realistic synthetic CT scan image using canvas and loads it as a File.
   * Enables 1-click testing for demonstrations and evaluations.
   */
  const loadSampleScan = (type) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Background deep black (air: -1000 HU)
    ctx.fillStyle = '#05070d';
    ctx.fillRect(0, 0, 512, 512);

    // Patient chest wall contour
    ctx.beginPath();
    ctx.ellipse(256, 256, 210, 180, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#222938';
    ctx.fill();
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#4a5568';
    ctx.stroke();

    // Mediastinum & Spine (Dense white/gray)
    ctx.beginPath();
    ctx.arc(256, 370, 26, 0, Math.PI * 2);
    ctx.fillStyle = '#e2e8f0';
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(256, 240, 36, 64, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#2d3748';
    ctx.fill();

    // Left & Right Lung Parenchyma (Darker air spaces)
    // Right lung
    ctx.beginPath();
    ctx.ellipse(160, 240, 68, 110, -0.1, 0, Math.PI * 2);
    ctx.fillStyle = '#0a0d16';
    ctx.fill();

    // Left lung
    ctx.beginPath();
    ctx.ellipse(352, 240, 68, 110, 0.1, 0, Math.PI * 2);
    ctx.fillStyle = '#0a0d16';
    ctx.fill();

    // Vascular branching
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(170, 220); ctx.lineTo(130, 260);
    ctx.moveTo(170, 240); ctx.lineTo(140, 300);
    ctx.moveTo(340, 220); ctx.lineTo(380, 260);
    ctx.moveTo(340, 240); ctx.lineTo(370, 300);
    ctx.stroke();

    // Nodule placement based on sample type
    let filename = 'sample-normal-ct.png';
    if (type === 'spiculated') {
      filename = 'sample-spiculated-nodule-7mm.png';
      // Suspicious spiculated nodule in right upper lobe
      ctx.beginPath();
      ctx.arc(145, 190, 14, 0, Math.PI * 2);
      ctx.fillStyle = '#cbd5e1';
      ctx.fill();

      // Spiculated margin spikes
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(145, 190);
        ctx.lineTo(145 + Math.cos(angle) * 22, 190 + Math.sin(angle) * 22);
        ctx.stroke();
      }
    } else if (type === 'calcified') {
      filename = 'sample-benign-calcified-3mm.png';
      // Small well-circumscribed dense calcified nodule in left base
      ctx.beginPath();
      ctx.arc(365, 290, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }

    // DICOM Overlay Text in Corners
    ctx.font = '13px monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('PneumoScan CT #4412', 18, 30);
    ctx.fillText('THICK: 1.25mm · kVp: 120', 18, 50);
    ctx.fillText(`PRESET: ${type.toUpperCase()}`, 18, 70);
    ctx.fillText('FOV: 350mm · LUNG WW: 1500 WL: -600', 18, 495);

    canvas.toBlob((blob) => {
      const file = new File([blob], filename, { type: 'image/png' });
      handleFileSelect(file);
    }, 'image/png');
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="upload-section">
      {/* Header */}
      <div className="upload-header">
        <div className="upload-header-badge">
          <span className="pulse-dot"></span>
          Clinical Ingestion Chamber
        </div>
        <h2>Thoracic CT Scan Workstation</h2>
        <p className="upload-subtitle">
          Feed axial thoracic CT slices for automated sub-millimeter nodule detection, Fleischner risk classification, and evidence-grounded clinical decision recommendations.
        </p>
      </div>

      {/* Quick Sample Selector */}
      <div className="sample-scans-bar">
        <span className="sample-scans-label">Instant Clinical Samples:</span>
        <button 
          className="sample-chip"
          type="button"
          onClick={() => loadSampleScan('spiculated')}
          title="Load 7mm Spiculated Ground-Glass Nodule"
        >
          <span>🔴</span> 7mm Spiculated Nodule (Suspicious)
        </button>
        <button 
          className="sample-chip"
          type="button"
          onClick={() => loadSampleScan('calcified')}
          title="Load 3mm Well-Circumscribed Calcified Nodule"
        >
          <span>🟢</span> 3mm Calcified Nodule (Benign)
        </button>
        <button 
          className="sample-chip"
          type="button"
          onClick={() => loadSampleScan('normal')}
          title="Load Normal Axial CT slice"
        >
          <span>⚪</span> Normal Thorax Slice
        </button>
      </div>

      {/* Main Upload Drop Zone */}
      <div
        className={`drop-zone ${dragOver ? 'drag-over' : ''} ${selectedFile ? 'has-file' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          id="ct-scan-file-input"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />

        {!selectedFile ? (
          <div className="drop-zone-empty">
            <div className="upload-icon-pulse">
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="4"/>
                <path d="M12 8v8M8 12h8"/>
              </svg>
            </div>
            <h3 className="drop-zone-title">
              {dragOver ? 'Release to Load CT Scan' : 'Drop Thoracic CT Scan or Browse'}
            </h3>
            <p className="drop-zone-hint">
              Drag & drop medical image slice here, or <span className="browse-link">select file</span>
            </p>
            <p className="drop-zone-formats">
              Standard formats: PNG, JPG, JPEG · Max: 10MB · 16-Bit Axial Compatible
            </p>
          </div>
        ) : (
          <div className="preview-card-wrapper">
            <div className="preview-screen-box">
              <img src={preview} alt="CT scan preview" className="preview-image" />
              <div className="preview-laser-grid"></div>
            </div>

            <div className="file-meta-strip">
              <div className="file-meta-left">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <span className="file-name-text">{selectedFile.name}</span>
                <span className="file-size-tag">({formatFileSize(selectedFile.size)})</span>
              </div>
              <button 
                type="button"
                className="btn-file-remove" 
                onClick={(e) => { e.stopPropagation(); handleClear(); }}
                title="Remove current scan"
              >
                ✕ Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar while Uploading */}
      {isLoading && uploadProgress > 0 && uploadProgress < 100 && (
        <div className="progress-hud-container" style={{ margin: '1.5rem auto 0' }}>
          <div className="progress-hud-header">
            <span>TRANSMITTING SCAN METADATA</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="progress-hud-track">
            <div className="progress-hud-fill" style={{ width: `${uploadProgress}%` }}></div>
          </div>
        </div>
      )}

      {/* Action Execution Button */}
      <div className="upload-action-row">
        <button
          id="analyze-btn"
          className="btn-execute-analysis"
          onClick={handleAnalyze}
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? (
            <>
              <svg className="theme-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ animation: 'spin 1s linear infinite' }}>
                <circle cx="12" cy="12" r="10" strokeDasharray="30" strokeDashoffset="10"/>
              </svg>
              <span>Executing Neural Diagnostics...</span>
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <span>Execute Diagnostic Analysis</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default UploadSection;
