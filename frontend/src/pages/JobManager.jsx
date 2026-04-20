import { useState, useEffect, useContext } from 'react'
import { 
  Briefcase, 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  Eye, 
  X, 
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { Link } from 'react-router-dom'
import AuthContext from '@/context/AuthContext'
import axios from 'axios'

export default function JobManager() {
  const { user } = useContext(AuthContext)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [success, setSuccess] = useState('')
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    experienceLevel: 'mid',
    minScore: 70,
    location: '',
    salary: ''
  })

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get('/api/jobs')
      setJobs(data.jobs)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingJob) {
        await axios.put(`/api/jobs/${editingJob._id}`, formData)
        setSuccess('Job updated successfully!')
      } else {
        await axios.post('/api/jobs', formData)
        setSuccess('Job posted! AI is extracting keywords...')
      }
      setShowModal(false)
      fetchJobs()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      alert('Error saving job')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job posting permanently?')) {
      try {
        await axios.delete(`/api/jobs/${id}`)
        setJobs(prev => prev.filter(j => j._id !== id))
        setSuccess('Job deleted successfully')
        setTimeout(() => setSuccess(''), 3000)
      } catch (error) {
        alert('Failed to delete job. ' + (error.response?.data?.message || ''))
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Job Description Manager</h1>
            <p className="text-gray-500 mt-1">Manage your active listings and optimization thresholds</p>
          </div>
          <button 
            onClick={() => {
              setEditingJob(null)
              setFormData({title:'', company:'', description:'', experienceLevel:'mid', minScore:70, location:'', salary:''})
              setShowModal(true)
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Posting
          </button>
        </div>

        {success && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-4 rounded-2xl flex items-center gap-3 animate-fade-in">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold">{success}</span>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1,2,3,4].map(i => <div key={i} className="h-48 bg-white rounded-3xl animate-pulse"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map(job => (
              <div key={job._id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all p-8 group">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        setEditingJob(job)
                        setFormData(job)
                        setShowModal(true)
                      }}
                      className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-blue-600"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(job._id)}
                      className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
                   <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location || 'Remote'}</div>
                   <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {job.experienceLevel.toUpperCase()}</div>
                   <div className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-emerald-500" /> Threshold: {job.minScore}%</div>
                </div>

                <div className="mb-6">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Target Keywords (AI Extracted)</p>
                  <div className="flex flex-wrap gap-2">
                    {job.skillsRequired?.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold border border-gray-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{job.status}</span>
                   </div>
                   <Link to={`/jobs/${job._id}/candidates`} className="flex items-center gap-2 text-sm font-bold text-primary-600 hover:gap-3 transition-all">
                     View Candidates <ChevronRight className="w-4 h-4" />
                   </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-in">
            <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center">
               <h2 className="text-2xl font-black text-gray-900">{editingJob ? 'Edit Posting' : 'New Job Posting'}</h2>
               <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                 <X className="w-6 h-6 text-gray-400" />
               </button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Job Title</label>
                    <input 
                      required
                      className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                      placeholder="e.g. Senior Software Engineer"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Company</label>
                    <input 
                      required
                      className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                      placeholder="Acme Corp"
                      value={formData.company}
                      onChange={e => setFormData({...formData, company: e.target.value})}
                    />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Full Description (AI will extract keywords from here)</label>
                  <textarea 
                    required
                    rows="6"
                    className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium resize-none"
                    placeholder="Paste job description here..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  ></textarea>
               </div>

               <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Exp. Level</label>
                    <select 
                      className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary-500 transition-all font-bold"
                      value={formData.experienceLevel}
                      onChange={e => setFormData({...formData, experienceLevel: e.target.value})}
                    >
                      <option value="entry">Entry</option>
                      <option value="mid">Mid-Level</option>
                      <option value="senior">Senior</option>
                      <option value="lead">Lead</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Match Threshold</label>
                    <div className="relative">
                      <input 
                        type="number"
                        className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary-500 transition-all font-black"
                        value={formData.minScore}
                        onChange={e => setFormData({...formData, minScore: e.target.value})}
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-gray-300">%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Location</label>
                    <input 
                      className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                      placeholder="Bangalore, IN"
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
               </div>

               <div className="pt-6 flex gap-4">
                  <button type="button" onClick={() => setShowModal(false)} className="px-8 py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 btn-primary py-4 text-lg">
                    {editingJob ? 'Update Posting' : 'Launch Posting'}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
