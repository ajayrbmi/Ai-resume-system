import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  Users, 
  ChevronLeft, 
  FileText, 
  Download, 
  Search, 
  MapPin, 
  Briefcase,
  ExternalLink,
  Target
} from 'lucide-react'
import axios from 'axios'

export default function JobCandidates() {
  const { jobId } = useParams()
  const [job, setJob] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, candRes] = await Promise.all([
          axios.get(`/api/jobs/${jobId}`),
          axios.get(`/api/resume/job/${jobId}`)
        ])
        setJob(jobRes.data.job)
        setCandidates(candRes.data.reports)
      } catch (error) {
        console.error('Error fetching candidates', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [jobId])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/jobs" className="flex items-center gap-2 text-gray-500 hover:text-primary-600 font-bold mb-8 transition-colors group">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Listings
        </Link>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden mb-10">
           <div className="px-10 py-10 bg-gradient-to-br from-gray-900 to-slate-800 text-white">
              <div className="flex justify-between items-start">
                 <div>
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-widest mb-4">
                       <Briefcase className="w-4 h-4" />
                       Active Posting
                    </div>
                    <h1 className="text-4xl font-black tracking-tight">{job?.title}</h1>
                    <p className="text-slate-400 text-lg mt-2 font-medium">{job?.company} • {job?.location}</p>
                 </div>
                 <div className="text-right">
                    <div className="text-4xl font-black text-emerald-400">{candidates.length}</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Applicants</div>
                 </div>
              </div>
           </div>
           
           <div className="px-10 py-6 bg-slate-900/50 border-t border-slate-700 flex gap-10">
              <div className="flex items-center gap-2 text-sm">
                 <Target className="w-4 h-4 text-emerald-500" />
                 <span className="text-slate-400">Min. Score: <span className="text-white font-bold">{job?.minScore}%</span></span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                 <Users className="w-4 h-4 text-emerald-500" />
                 <span className="text-slate-400">Experience: <span className="text-white font-bold capitalize">{job?.experienceLevel}</span></span>
              </div>
           </div>
        </div>

        <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
          <Users className="w-7 h-7 text-primary-500" />
          Shortlisted Talent
        </h2>

        {candidates.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-20 text-center border-2 border-dashed border-gray-200">
             <Search className="w-16 h-16 text-gray-200 mx-auto mb-6" />
             <h3 className="text-xl font-bold text-gray-400">No candidates found for this role</h3>
             <p className="text-sm text-gray-400 mt-2">Upload resumes in the Analyze section to see matches here.</p>
          </div>
        ) : (
          <div className="grid gap-6">
             {candidates.map((cand, idx) => (
               <div key={idx} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all p-8 group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-gray-50 rounded-[1.25rem] flex items-center justify-center text-primary-600 font-black text-2xl group-hover:bg-primary-600 group-hover:text-white transition-all shadow-inner">
                           {cand.resumeId?.parsedData?.name?.[0] || '?' }
                        </div>
                        <div>
                           <h3 className="text-xl font-black text-gray-900">{cand.resumeId?.parsedData?.name || 'Unknown Candidate'}</h3>
                           <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {cand.resumeId?.parsedData?.email}</span>
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center gap-6">
                        <div className="text-center px-6 border-r border-gray-100">
                           <div className={`text-3xl font-black ${cand.matchScore >= (job?.minScore || 70) ? 'text-emerald-500' : 'text-amber-500'}`}>
                             {cand.matchScore}%
                           </div>
                           <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Match Score</div>
                        </div>
                        <div className="flex gap-3">
                           <button className="p-3 bg-gray-50 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 rounded-2xl transition-all">
                              <Download className="w-5 h-5" />
                           </button>
                           <button className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center gap-2">
                              Full Report <ExternalLink className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-gray-50 grid md:grid-cols-2 gap-8">
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Skills Breakdown</p>
                        <div className="flex flex-wrap gap-2">
                           {cand.resumeId?.parsedData?.skills?.slice(0, 5).map((s, i) => (
                             <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold border border-slate-100">
                               {s}
                             </span>
                           ))}
                           {cand.resumeId?.parsedData?.skills?.length > 5 && (
                             <span className="px-3 py-1.5 text-gray-400 text-xs font-bold">+{cand.resumeId?.parsedData?.skills.length - 5} more</span>
                           )}
                        </div>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Improvement Suggestions</p>
                        <ul className="space-y-2">
                           {cand.suggestions?.slice(0, 2).map((s, i) => (
                             <li key={i} className="text-xs text-gray-500 flex gap-2 font-medium">
                               <div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 shrink-0"></div>
                               {s}
                             </li>
                           ))}
                        </ul>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  )
}
