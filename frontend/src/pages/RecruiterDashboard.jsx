import { useState, useEffect, useContext } from 'react'
import { 
  LayoutDashboard, 
  Plus, 
  FileText, 
  Briefcase, 
  TrendingUp, 
  ArrowRight,
  Search,
  Users
} from 'lucide-react'
import { Link } from 'react-router-dom'
import AuthContext from '@/context/AuthContext'
import axios from 'axios'

export default function RecruiterDashboard() {
  const { user } = useContext(AuthContext)
  const [jobs, setJobs] = useState([])
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ jobCount: 0, resumeCount: 0, avgScore: '0%' })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, resumesRes, statsRes] = await Promise.all([
          axios.get('/api/jobs'),
          axios.get('/api/resume'),
          axios.get('/api/jobs/stats')
        ])
        setJobs(jobsRes.data.jobs || [])
        setResumes(resumesRes.data || [])
        setStats(statsRes.data.stats)
      } catch (error) {
        console.error('Error fetching dashboard data', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-24">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-50 rounded-2xl text-primary-600">
                <LayoutDashboard className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Recruiter Panel</h1>
                <p className="text-gray-500 mt-1">Welcome back, {user?.name}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Link to="/upload" className="btn-secondary flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Analyze Resume
              </Link>
              <Link to="/jobs" className="btn-primary flex items-center gap-2 shadow-lg shadow-primary-200">
                <Plus className="w-5 h-5" />
                Manage Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard icon={<Briefcase className="w-6 h-6" />} label="Active Jobs" value={stats.jobCount} color="bg-blue-500" />
          <StatCard icon={<Users className="w-6 h-6" />} label="Total Candidates" value={stats.resumeCount} color="bg-purple-500" />
          <StatCard icon={<TrendingUp className="w-6 h-6" />} label="Avg. Match Score" value={stats.avgScore} color="bg-green-500" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Active Jobs */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                <Briefcase className="w-5 h-5 text-gray-400" />
                Your Postings
              </h2>
              <button className="text-sm font-bold text-primary-600">See All</button>
            </div>
            <div className="p-6">
              {loading ? <LoadingSkeleton /> : jobs.length === 0 ? <EmptyState text="No jobs posted yet" /> : (
                <div className="space-y-4">
                  {jobs.map(job => (
                    <div key={job._id} className="p-4 border border-gray-100 rounded-2xl hover:border-primary-100 hover:bg-primary-50/20 transition-all cursor-pointer flex items-center justify-between group">
                      <div>
                        <h4 className="font-bold text-gray-900 group-hover:text-primary-700 transition-colors">{job.title}</h4>
                        <p className="text-sm text-gray-500">{job.company} • {job.location}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Candidates */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                <Users className="w-5 h-5 text-gray-400" />
                Recent Candidates
              </h2>
              <button className="text-sm font-bold text-primary-600">View Talent Pool</button>
            </div>
            <div className="p-6">
               {loading ? <LoadingSkeleton /> : resumes.length === 0 ? <EmptyState text="No resumes uploaded" /> : (
                 <div className="space-y-4">
                   {resumes.slice(0, 5).map(res => (
                     <div key={res._id} className="p-4 border border-gray-100 rounded-2xl hover:border-primary-100 hover:bg-primary-50/20 transition-all cursor-pointer flex items-center justify-between group">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                           <FileText className="w-5 h-5" />
                         </div>
                         <div>
                            <h4 className="font-bold text-gray-900">{res.parsedData?.name || 'Untitled Candidate'}</h4>
                            <p className="text-xs text-gray-500 uppercase tracking-widest">{new Date(res.createdAt).toLocaleDateString()}</p>
                         </div>
                       </div>
                       <div className="text-right">
                          <div className={`text-sm font-bold ${res.matchScore >= 70 ? 'text-primary-600' : 'text-amber-500'}`}>
                            Score: {res.matchScore ? `${res.matchScore}%` : 'N/A'}
                          </div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase">ATS Match</div>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
        <h4 className="text-3xl font-black text-gray-900 mt-1">{value}</h4>
      </div>
    </div>
  )
}

function EmptyState({ text }) {
  return (
    <div className="py-12 text-center text-gray-400">
      <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
      <p>{text}</p>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-50 rounded-2xl w-full"></div>)}
    </div>
  )
}
