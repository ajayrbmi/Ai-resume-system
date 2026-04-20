import { useState, useEffect } from 'react'
import { 
  BarChart3Icon, 
  FileText, 
  TrendingUp, 
  Zap, 
  History, 
  Plus,
  ArrowRight,
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    avgScore: 0,
    topSkills: []
  })

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('/api/resume', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()
        if (Array.isArray(data)) {
          setResumes(data)
          // Calculate simple stats
          const total = data.length;
          setStats(prev => ({ ...prev, total }));
        }
      } catch (error) {
        console.error('Error fetching resumes', error)
      } finally {
        setLoading(false)
      }
    }
    fetchResumes()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-50 rounded-2xl">
                <LayoutDashboard className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Overview</h1>
                <p className="text-gray-500 mt-1">Manage and track your AI-enhanced resumes</p>
              </div>
            </div>
            <Link 
              to="/upload" 
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 shadow-[0_10px_40px_rgb(37,99,235,0.2)] hover:scale-105 transition-transform"
            >
              <Plus className="w-5 h-5" />
              New Analysis
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard 
            icon={<FileText className="w-6 h-6" />} 
            label="Total Resumes" 
            value={stats.total} 
            color="bg-blue-500" 
          />
          <StatCard 
            icon={<TrendingUp className="w-6 h-6" />} 
            label="Avg Match Score" 
            value="84%" 
            color="bg-purple-500" 
          />
          <StatCard 
            icon={<ShieldCheck className="w-6 h-6" />} 
            label="ATS Optimized" 
            value={stats.total} 
            color="bg-green-500" 
          />
          <StatCard 
            icon={<Zap className="w-6 h-6" />} 
            label="AI Tokens Used" 
            value="1.2k" 
            color="bg-yellow-500" 
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-gray-400" />
                  Recent Resumes
                </h2>
                <button className="text-sm font-semibold text-primary-600 hover:text-primary-700">View All</button>
              </div>
              
              <div className="p-4">
                {loading ? (
                  <div className="py-12 flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-medium tracking-wide">Loading your assets...</p>
                  </div>
                ) : resumes.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-500 mb-6">No resumes analyzed yet.</p>
                    <Link to="/upload" className="text-primary-600 font-bold hover:underline">Start Analysis <ArrowRight className="w-4 h-4 inline" /></Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {resumes.map(resume => (
                      <div key={resume._id} className="group flex items-center justify-between p-5 bg-white hover:bg-primary-50/30 rounded-2xl border border-gray-100 hover:border-primary-100 transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                            <FileText className="w-6 h-6 text-gray-400 group-hover:text-primary-600" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 group-hover:text-primary-700">{resume.originalFile?.name || 'Untitled Resume'}</h4>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{new Date(resume.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                           <div className="hidden sm:block text-right">
                             <div className="text-sm font-bold text-gray-900">{resume.parsedData?.skills?.length || 0} Skills</div>
                             <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Extracted</div>
                           </div>
                           <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-8 text-white shadow-xl shadow-primary-200">
               <h3 className="text-xl font-bold mb-2">Upgrade to Pro</h3>
               <p className="text-primary-100 text-sm mb-6 leading-relaxed">Get unlimited AI enhancements and expert deep-dives into your career path.</p>
               <button className="w-full bg-white text-primary-600 py-3 rounded-xl font-bold shadow-lg hover:bg-primary-50 transition-colors">Unlock Now</button>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
               <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                 <BarChart3Icon className="w-5 h-5 text-green-500" />
                 Skill Distribution
               </h3>
               <div className="space-y-4">
                 {['React', 'Node.js', 'Python'].map(skill => (
                   <div key={skill} className="space-y-2">
                     <div className="flex justify-between text-sm font-semibold text-gray-700">
                       <span>{skill}</span>
                       <span>85%</span>
                     </div>
                     <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                       <div className="bg-primary-500 h-full rounded-full" style={{ width: '85%' }}></div>
                     </div>
                   </div>
                 ))}
               </div>
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
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-${color.split('-')[1]}-200`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{label}</p>
        <h4 className="text-3xl font-black text-gray-900 mt-1">{value}</h4>
      </div>
    </div>
  )
}

