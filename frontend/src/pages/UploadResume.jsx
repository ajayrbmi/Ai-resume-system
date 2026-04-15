import { useState, useRef } from 'react'
import { Upload, FileText, Zap, Download } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default function UploadResume() {
  const [file, setFile] = useState(null)
  const [jdFile, setJdFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [jdDragging, setJdDragging] = useState(false)
  const [parsedData, setParsedData] = useState(null)
  const [matchReport, setMatchReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const reportRef = useRef(null)

  const handleDrop = (e, type) => {
    e.preventDefault()
    if (type === 'resume') setDragging(false)
    if (type === 'jd') setJdDragging(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.name.endsWith('.docx'))) {
      if (type === 'resume') setFile(droppedFile)
      if (type === 'jd') setJdFile(droppedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    const formData = new FormData()
    formData.append('resume', file)
    if (jdFile) {
      formData.append('jd', jdFile)
    }
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: formData,
      })
      const data = await response.json()
      setParsedData(data.resume ? data.resume.parsedData : data.parsedData)
      if (data.matchReport) {
        setMatchReport(data.matchReport)
      }
    } catch (error) {
      console.error('Upload failed', error)
    }
    setLoading(false)
  }

  const downloadReport = async () => {
    const element = reportRef.current;
    if (!element || !matchReport) return;
    
    setDownloading(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('ATS_Match_Report.pdf');
    } catch (err) {
      console.error(err);
      alert('Failed to download report PDF');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <Zap className="w-16 h-16 text-primary-600 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">Upload Your Resume</h1>
        <p className="text-xl text-gray-600">Drop PDF or DOCX. AI parses instantly.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Upload Area */}
        <div className="space-y-6">
          <div 
            className={`bg-white p-12 rounded-2xl border-2 border-dashed transition-all ${
              dragging ? 'border-primary-400 bg-primary-50 shadow-xl' : 'border-gray-200 hover:border-gray-300'
            }`}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => handleDrop(e, 'resume')}
            onDragEnter={() => setDragging(true)}
          >
            <div className="text-center">
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Drop your resume here</h3>
              <p className="text-gray-500 mb-6 flex flex-col"><span>PDF or DOCX (max 5MB)</span><span className="text-red-500 text-sm font-semibold mt-1">* Required</span></p>
              <input 
                type="file" 
                accept=".pdf,.docx" 
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="btn-primary inline-flex items-center gap-2 px-8 py-3 cursor-pointer">
                <FileText className="w-4 h-4" />
                Select Resume
              </label>
              {file && (
                <p className="mt-4 text-sm font-medium text-primary-600 truncate">
                  {file.name} ({(file.size / 1024 / 1024).toFixed(1)}MB)
                </p>
              )}
            </div>
          </div>

          <div 
            className={`bg-white p-12 rounded-2xl border-2 border-dashed transition-all ${
              jdDragging ? 'border-purple-400 bg-purple-50 shadow-xl' : 'border-gray-200 hover:border-gray-300'
            }`}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={() => setJdDragging(false)}
            onDrop={(e) => handleDrop(e, 'jd')}
            onDragEnter={() => setJdDragging(true)}
          >
            <div className="text-center">
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Drop Job Description here</h3>
              <p className="text-gray-500 mb-6 flex flex-col"><span>PDF or DOCX (max 5MB)</span><span className="text-gray-400 text-sm mt-1">(Optional for ATS Score)</span></p>
              <input 
                type="file" 
                accept=".pdf,.docx" 
                onChange={(e) => setJdFile(e.target.files[0])}
                className="hidden"
                id="jd-upload"
              />
              <label htmlFor="jd-upload" className="btn-primary bg-purple-600 hover:bg-purple-700 inline-flex items-center gap-2 px-8 py-3 cursor-pointer shadow-[0_8px_30px_rgb(147,51,234,0.3)]">
                <FileText className="w-4 h-4" />
                Select JD
              </label>
              {jdFile && (
                <p className="mt-4 text-sm font-medium text-purple-600 truncate">
                  {jdFile.name} ({(jdFile.size / 1024 / 1024).toFixed(1)}MB)
                </p>
              )}
            </div>
          </div>

          <button 
            onClick={handleUpload}
            disabled={!file || loading}
            className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing with AI...' : jdFile ? 'Parse Resume & Match JD' : 'Parse Resume Only'}
          </button>
        </div>

        {/* Preview */}
        {/* Preview & Results */}
        <div className="space-y-8">
          {matchReport && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-purple-500">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">ATS Match Score</h3>
                  <p className="text-sm text-gray-500 mt-1">AI-powered comparison against JD</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className={`text-4xl font-black ${
                    matchReport.matchScore >= 80 ? 'text-green-500' 
                    : matchReport.matchScore >= 60 ? 'text-yellow-500' 
                    : 'text-red-500'
                  }`}>
                    {matchReport.matchScore}%
                  </div>
                  <button 
                    onClick={downloadReport}
                    disabled={downloading}
                    className="p-3 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-xl transition-colors shrink-0 outline-none flex items-center justify-center shadow-sm disabled:opacity-50"
                    title="Download Report as PDF"
                  >
                    {downloading ? (
                       <Zap className="w-6 h-6 animate-pulse text-purple-400" />
                    ) : (
                       <Download className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </div>
              
              {matchReport.skillGaps && matchReport.skillGaps.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-2">Skill Gaps</h4>
                  <div className="flex flex-wrap gap-2">
                    {matchReport.skillGaps.map((gap, i) => (
                      <span key={i} className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium">
                        {gap.skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {matchReport.suggestions && matchReport.suggestions.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Suggestions</h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                    {matchReport.suggestions.map((suggestion, i) => (
                      <li key={i}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {parsedData && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold mb-6">Resume Parsed Data</h3>
              <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto max-h-96 text-gray-800 font-mono border border-gray-100">
                {JSON.stringify(parsedData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* HIDDEN REPORT FOR PDF EXPORT */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', width: '210mm', pointerEvents: 'none' }}>
        <div ref={reportRef} className="bg-white p-8 font-sans" style={{ width: '210mm', minHeight: '297mm', padding: '20px 40px' }}>
          <h1 className="text-4xl font-black border-b-[3px] border-slate-900 pb-6 mb-8 text-slate-900 tracking-tight">AI Screening & ATS Report</h1>
          
          {matchReport && (
            <>
              {/* Score Section */}
              <div className="mb-10 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-2 uppercase tracking-wider text-sm">Overall Match Score</h2>
                <div className="flex items-end gap-3">
                  <div className={`text-6xl font-black tracking-tighter ${
                    matchReport.matchScore >= 80 ? 'text-green-600' : matchReport.matchScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {matchReport.matchScore}%
                  </div>
                  <div className="text-slate-500 font-medium pb-2 tracking-wide text-sm">
                    {matchReport.matchScore >= 80 ? 'Excellent Match' : matchReport.matchScore >= 60 ? 'Moderate Match' : 'Weak Match'}
                  </div>
                </div>
                <p className="text-slate-600 mt-4 text-[13px] leading-relaxed">This score indicates how well the parsed resume aligns with the provided Job Description based on industry-standard ATS parameters and semantic matching.</p>
              </div>

              {/* Skill Gaps Section */}
              {matchReport.skillGaps && matchReport.skillGaps.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-lg font-black mb-4 text-slate-900 border-b border-slate-200 pb-2 uppercase tracking-wide">Identified Skill Gaps</h2>
                  <p className="text-[13px] text-slate-600 mb-4 font-medium">The following key skills were requested in the Job Description but are missing or weakly represented in the parsed resume:</p>
                  <div className="flex flex-wrap gap-2">
                    {matchReport.skillGaps.map((gap, i) => (
                      <span key={i} className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-100 rounded-lg text-xs font-bold uppercase tracking-wider">
                        {gap.skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions Section */}
              {matchReport.suggestions && matchReport.suggestions.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-lg font-black mb-4 text-slate-900 border-b border-slate-200 pb-2 uppercase tracking-wide">Actionable Improvements</h2>
                  <p className="text-[13px] text-slate-600 mb-4 font-medium">AI generated recommendations to optimize this resume for the specific job description:</p>
                  <ul className="space-y-3">
                    {matchReport.suggestions.map((suggestion, i) => (
                      <li key={i} className="text-[14px] text-slate-800 leading-relaxed flex items-start gap-3">
                        <span className="text-purple-500 font-bold mt-0.5">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-16 text-center text-slate-400 text-xs font-medium border-t border-slate-100 pt-6">
                Generated securely by Ai Resume Screening System. <br/> Do not distribute without candidate consent.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

