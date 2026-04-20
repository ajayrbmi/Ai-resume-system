import { useState, useEffect, useContext } from 'react'
import { 
  Users, 
  Briefcase, 
  Settings, 
  BarChart3, 
  ShieldCheck, 
  AlertCircle,
  FileText,
  UserCheck,
  TrendingUp,
  LayoutDashboard
} from 'lucide-react'
import { Link } from 'react-router-dom'
import AuthContext from '@/context/AuthContext'
import axios from 'axios'

export default function HRAdminDashboard() {
  const { user } = useContext(AuthContext)
  const [stats, setStats] = useState({
    users: 0,
    jobs: 0,
    resumes: 0,
    avgScore: '82%'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const { data } = await axios.get('/api/admin/stats')
        setStats(data.stats)
      } catch (error) {
        console.error('Error fetching admin stats', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAdminStats()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24">
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-emerald-500 rounded-3xl shadow-lg shadow-emerald-500/20">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">HR Administrative Control</h1>
                <p className="text-slate-400 mt-1">Managing {stats.users} members and global system health</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 bg-slate-800/50 p-2 rounded-2xl border border-slate-700">
               <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center">
                 <Settings className="w-5 h-5 text-slate-400" />
               </div>
               <span className="pr-4 text-sm font-bold text-slate-300">System V.2.4</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AdminStatCard icon={<Users />} label="Total Members" value={stats.users} color="text-blue-500" />
          <AdminStatCard icon={<Briefcase />} label="Total Postings" value={stats.jobs} color="text-emerald-500" />
          <AdminStatCard icon={<FileText />} label="Resume Databank" value={stats.resumes} color="text-purple-500" />
          <AdminStatCard icon={<BarChart3 />} label="System Efficiency" value={stats.avgScore} color="text-amber-500" />
        </div>

        <div className="mt-12 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
             <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-3 text-slate-800">
                    <UserCheck className="w-5 h-5 text-slate-400" />
                    Global Talent Overview
                  </h2>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase">Live</span>
                  </div>
                </div>
                <div className="p-8">
                   <div className="aspect-[21/9] bg-slate-50 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-200">
                      <div className="text-center">
                        <TrendingUp className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Analytics Under Construction</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
                <h3 className="text-xl font-bold mb-6 text-slate-800">Recent System Activity</h3>
                <div className="space-y-6">
                   <ActivityRow icon={<AlertCircle className="text-amber-500" />} text="System wide limit reached for API calls" time="2 mins ago" />
                   <ActivityRow icon={<UserCheck className="text-emerald-500" />} text="New Recruiter account verified: Sarah Smith" time="1 hour ago" />
                   <ActivityRow icon={<FileText className="text-blue-500" />} text="ATS Report generated for Lead Developer role" time="3 hours ago" />
                </div>
             </div>
          </div>

          <div className="space-y-8">
             <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
                <h3 className="text-lg font-bold text-slate-800 mb-6">User Role Distribution</h3>
                <div className="space-y-6">
                   <RoleBar label="Recruiters" percentage="65%" color="bg-blue-500" />
                   <RoleBar label="HR Admins" percentage="15%" color="bg-emerald-500" />
                   <RoleBar label="Candidates" percentage="20%" color="bg-purple-500" />
                </div>
             </div>

             <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 text-white">
                <LayoutDashboard className="w-8 h-8 text-emerald-400 mb-6" />
                <h3 className="text-xl font-bold mb-3">Administrative Tools</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">Access the master database, manage subscription plans, and configure AI parsing models.</p>
                <div className="grid grid-cols-2 gap-4">
                   <Link to="/admin" className="p-4 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-colors text-xs font-bold text-center">User Management</Link>
                   <button className="p-4 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-colors text-xs font-bold text-center">System Logs</button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminStatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 hover:scale-105 transition-transform duration-300">
      <div className={`w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center mb-6 border border-slate-50 ${color}`}>
        {icon}
      </div>
      <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
      <h4 className="text-3xl font-black text-slate-800 mt-2 tracking-tight">{value}</h4>
    </div>
  )
}

function RoleBar({ label, percentage, color }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-black uppercase tracking-wider text-slate-500">
        <span>{label}</span>
        <span>{percentage}</span>
      </div>
      <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: percentage }}></div>
      </div>
    </div>
  )
}

function ActivityRow({ icon, text, time }) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-slate-700">{text}</p>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{time}</p>
      </div>
    </div>
  )
}
