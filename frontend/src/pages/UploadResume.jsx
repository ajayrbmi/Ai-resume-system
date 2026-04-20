import { useState, useRef, useEffect } from 'react'
import { 
  Upload, 
  FileText, 
  Zap, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  ArrowRight,
  Target,
  Search,
  BookOpen
} from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default function UploadResume() {
  const [resumes, setResumes] = useState([])
  const [jdFile, setJdFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [jdDragging, setJdDragging] = useState(false)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloading, setDownloading] = useState(false)
  const [status, setStatus] = useState('')
  const [activeReport, setActiveReport] = useState(null)
  const reportRef = useRef(null)

  // Simulation of progress for better UX
  useEffect(() => {
    let interval;
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return prev;
          return prev + (Math.random() * 5);
        });
      }, 500);
    } else {
      setProgress(100);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleDrop = (e, type) => {
    e.preventDefault()
    if (type === 'resume') setDragging(false)
    if (type === 'jd') setJdDragging(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    const validFiles = droppedFiles.filter(f => f.type === 'application/pdf' || f.name.endsWith('.docx'))
    
    if (type === 'resume') {
      setResumes(prev => [...prev, ...validFiles].slice(0, 10))
    }
    if (type === 'jd' && validFiles.length > 0) {
      setJdFile(validFiles[0])
    }
  }

  const handleUpload = async () => {
    if (resumes.length === 0) return
    setLoading(true)
    setResults([])
    setStatus(`Processing ${resumes.length} files...`)
    
    const formData = new FormData()
    resumes.forEach(file => {
      formData.append('resumes', file)
    })
    if (jdFile) {
      formData.append('jd', jdFile)
    }
    
    try {
      const token = localStorage.getItem('token')
      
      // Simulate state changes for premium feel
      setTimeout(() => setStatus('AI is extracting deep insights from bulk data...'), 2000);
      if (jdFile) setTimeout(() => setStatus('Calculating cross-match ATS scores...'), 5000);

      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: formData,
      })
      const data = await response.json()
      
      if (data.success) {
        setResults(data.results)
        setStatus('Bulk analysis complete!')
      } else {
        alert(data.message || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload failed', error)
      alert('Network error. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const downloadReport = async (resIndex) => {
    const res = results[resIndex];
    if (!res?.matchReport) return;
    
    setActiveReport(res);
    setDownloading(true);
    
    // Wait for state to update and DOM to render
    setTimeout(async () => {
      const element = reportRef.current;
      if (!element) return;
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
        pdf.save(`Analysis_${res.resume.name.replace('.pdf', '')}.pdf`);
      } catch (err) {
        console.error(err);
        alert('Failed to generate PDF');
      } finally {
        setDownloading(false);
        setActiveReport(null);
      }
    }, 500);
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-24">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-bold mb-6">
             <Sparkles className="w-4 h-4" />
             AI-POWERED ANALYSIS
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">
            Optimize Your <span className="text-primary-600">Resume</span> for ATS
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Upload your resume and job description. Our AI will analyze skill gaps, 
            ATS compatibility, and provide actionable improvements in seconds.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          
          {/* Left Side: Uploads & Loading */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary-500" />
                Upload Assets
              </h2>
              
              <div className="space-y-4">
                {/* Resume Upload */}
                <div 
                  className={`relative group border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer ${
                    resumes.length > 0 ? 'border-green-200 bg-green-50/30' : 
                    dragging ? 'border-primary-400 bg-primary-50 shadow-inner' : 'border-gray-200 hover:border-primary-200 hover:bg-gray-50/50'
                  }`}
                  onDragOver={(e) => e.preventDefault()}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => handleDrop(e, 'resume')}
                  onDragEnter={() => setDragging(true)}
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  <input id="file-upload" type="file" multiple className="hidden" accept=".pdf,.docx" onChange={(e) => setResumes(prev => [...prev, ...Array.from(e.target.files)].slice(0, 10))} />
                   <div className="text-center">
                     {resumes.length > 0 ? (
                       <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white mb-3 shadow-lg shadow-green-200">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                          <h4 className="font-bold text-gray-900">{resumes.length} {resumes.length === 1 ? 'Resume' : 'Resumes'} Selected</h4>
                          <div className="flex gap-2 mt-2">
                             <button onClick={(e) => { e.stopPropagation(); setResumes([]) }} className="text-[10px] text-red-500 font-bold uppercase tracking-widest hover:underline">Clear All</button>
                          </div>
                       </div>
                     ) : (
                       <>
                         <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-100 transition-colors">
                           <FileText className="w-6 h-6 text-gray-300 group-hover:text-primary-500" />
                         </div>
                         <h4 className="font-bold text-gray-900">Select Resumes</h4>
                         <p className="text-sm text-gray-500 mt-1">PDF or DOCX (Bulk allowed)</p>
                       </>
                     )}
                   </div>
                 </div>

                 {/* JD Upload */}
                 <div 
                   className={`relative group border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer ${
                     jdFile ? 'border-purple-200 bg-purple-50/30' : 
                     jdDragging ? 'border-purple-400 bg-purple-50 shadow-inner' : 'border-gray-200 hover:border-purple-200 hover:bg-gray-50/50'
                   }`}
                   onDragOver={(e) => e.preventDefault()}
                   onDragLeave={() => setJdDragging(false)}
                   onDrop={(e) => handleDrop(e, 'jd')}
                   onDragEnter={() => setJdDragging(true)}
                   onClick={() => document.getElementById('jd-upload').click()}
                 >
                   <input id="jd-upload" type="file" className="hidden" accept=".pdf,.docx" onChange={(e) => setJdFile(e.target.files[0])} />
                   <div className="text-center">
                     {jdFile ? (
                       <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white mb-3 shadow-lg shadow-purple-200">
                            <Target className="w-6 h-6" />
                          </div>
                          <h4 className="font-bold text-gray-900">{jdFile.name}</h4>
                          <p className="text-xs text-gray-500 mt-1 uppercase font-bold tracking-widest">JD ATTACHED</p>
                       </div>
                     ) : (
                       <>
                         <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-100 transition-colors">
                           <Target className="w-6 h-6 text-gray-300 group-hover:text-purple-500" />
                         </div>
                         <h4 className="font-bold text-gray-900">Add Job Description</h4>
                         <p className="text-sm text-gray-500 mt-1">Optional for Match Score</p>
                       </>
                     )}
                   </div>
                 </div>
               </div>

               <button 
                 onClick={handleUpload}
                 disabled={resumes.length === 0 || loading}
                 className="w-full mt-8 bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-xl shadow-gray-200"
               >
                 {loading ? (
                   <>
                     <Loader2 className="w-5 h-5 animate-spin" />
                     Bulk Processing...
                   </>
                 ) : (
                   <>
                     <Zap className="w-5 h-5 text-yellow-400" />
                     {resumes.length > 1 ? `Analyze ${resumes.length} Resumes` : 'Run AI Analysis'}
                   </>
                 )}
               </button>
            </div>

            {loading && (
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="font-bold text-gray-900">{status}</h3>
                   <span className="text-primary-600 font-bold">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                   <div 
                    className="bg-primary-600 h-full transition-all duration-500 ease-out" 
                    style={{ width: `${progress}%` }}
                   ></div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-2">
                   {[1, 2, 3].map(i => (
                     <div key={i} className={`h-1.5 rounded-full ${progress > (i * 30) ? 'bg-primary-500' : 'bg-gray-100'}`}></div>
                   ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Results */}
          <div className="space-y-6">
            {results.length === 0 && !loading && (
              <div className="bg-gray-100/50 border-2 border-dashed border-gray-200 rounded-3xl p-20 text-center">
                 <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                 <h3 className="text-lg font-bold text-gray-400 font-medium">Awaiting Analysis</h3>
                 <p className="text-sm text-gray-400 max-w-xs mx-auto mt-2">Upload your resumes on the left to see the AI magic happen here.</p>
              </div>
            )}

            {results.map((res, idx) => (
              <div key={idx} className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 animate-fade-in-up">
                <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center font-black">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 tracking-tight">{res.resume.name}</h3>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Processed successfully</p>
                    </div>
                  </div>
                  {res.matchReport && (
                    <div className={`px-4 py-2 rounded-xl font-black text-lg ${
                      res.matchReport.matchScore >= 80 ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      {res.matchReport.matchScore}%
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                   <div>
                     <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Key Info</h4>
                     <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                           <FileText className="w-4 h-4 text-gray-300" />
                           <span className="font-bold text-gray-700">{res.resume.parsedData?.name || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                           <Target className="w-4 h-4 text-emerald-500" />
                           <span className="font-bold text-gray-700">{res.resume.parsedData?.email || 'No Email'}</span>
                        </div>
                     </div>
                   </div>

                   {res.matchReport && (
                     <div>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Top Suggestions</h4>
                        <ul className="space-y-2">
                           {res.matchReport.suggestions?.slice(0, 2).map((s, i) => (
                             <li key={i} className="text-xs text-gray-600 flex gap-2 font-medium">
                               <Sparkles className="w-3 h-3 text-primary-400 shrink-0 mt-0.5" />
                               {s}
                             </li>
                           ))}
                        </ul>
                     </div>
                   )}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center">
                   <div className="flex gap-2">
                      {res.resume.parsedData?.skills?.slice(0, 3).map((s, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-50 rounded-lg text-[10px] font-bold text-gray-400 uppercase">{s}</span>
                      ))}
                   </div>
                   <button 
                    onClick={() => downloadReport(idx)}
                    className="text-xs font-black text-primary-600 uppercase tracking-widest hover:underline flex items-center gap-1"
                   >
                     <Download className="w-3 h-3" /> PDF Report
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HIDDEN REPORT FOR PDF EXPORT */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', width: '210mm', pointerEvents: 'none' }}>
        <div ref={reportRef} className="bg-white p-12 font-sans" style={{ width: '210mm', minHeight: '297mm', padding: '40px 60px' }}>
          <div className="flex justify-between items-start border-b-4 border-gray-900 pb-8 mb-12">
            <div>
              <h1 className="text-5xl font-black text-gray-900 tracking-tighter">ATS REPORT</h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest mt-2">{activeReport?.resume?.name}</p>
            </div>
            <div className={`p-6 rounded-3xl text-center ${activeReport?.matchReport?.matchScore >= 80 ? 'bg-green-50' : 'bg-yellow-50'}`}>
              <div className="text-4xl font-black text-gray-900">{activeReport?.matchReport?.matchScore}%</div>
              <div className="text-[10px] font-black uppercase text-gray-500 tracking-tighter mt-1">MATCH SCORE</div>
            </div>
          </div>
          
          {activeReport?.matchReport && (
            <div className="space-y-12">
              <section>
                <h2 className="text-xl font-black text-gray-900 border-l-8 border-primary-600 pl-4 mb-6 uppercase tracking-wider">Identified Skill Gaps</h2>
                <div className="flex flex-wrap gap-3">
                  {activeReport.matchReport.skillGaps?.map((gap, i) => (
                    <div key={i} className="px-5 py-3 bg-red-50 text-red-800 rounded-xl font-bold border border-red-100 text-sm">{gap.skill}</div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-black text-gray-900 border-l-8 border-primary-600 pl-4 mb-6 uppercase tracking-wider">Strategic Recommendations</h2>
                <div className="space-y-4">
                  {activeReport.matchReport.suggestions?.map((item, i) => (
                    <div key={i} className="flex gap-6 pb-4 border-b border-gray-50 last:border-0">
                       <span className="text-primary-600 font-black text-lg">0{i+1}</span>
                       <p className="text-gray-800 leading-relaxed font-medium">{item}</p>
                    </div>
                  ))}
                </div>
              </section>
              
              <div className="pt-20 text-center">
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Validated by AI Screening System Engine • {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

