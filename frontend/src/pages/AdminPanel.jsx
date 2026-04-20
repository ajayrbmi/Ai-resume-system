import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AuthContext from '@/context/AuthContext'
import { Users, Trash2, Shield, Settings, User, Loader2, CheckCircle2, AlertCircle, Ban } from 'lucide-react'

export default function AdminPanel() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    if (user && user.role !== 'hr_admin') {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/admin/users')
      setUsers(data.users)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.role === 'hr_admin') {
      fetchUsers()
    }
  }, [user])

  const showSuccess = (msg) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      try {
        setActionLoading(true)
        await axios.delete(`/api/admin/users/${id}`)
        setUsers(users.filter(u => u._id !== id))
        showSuccess(`User ${name} deleted successfully`)
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete user')
      } finally {
        setActionLoading(false)
      }
    }
  }

  const handleUpdateRole = async (id, currentRole) => {
    const newRole = currentRole === 'hr_admin' ? 'recruiter' : 'hr_admin'
    try {
      setActionLoading(true)
      const { data } = await axios.put(`/api/admin/users/${id}`, { role: newRole })
      setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u))
      showSuccess(`Role updated to ${newRole}`)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update role')
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdatePlan = async (id, newPlan) => {
    try {
      setActionLoading(true)
      const { data } = await axios.put(`/api/admin/users/${id}`, { plan: newPlan })
      setUsers(users.map(u => u._id === id ? { ...u, plan: newPlan } : u))
      showSuccess(`Plan updated to ${newPlan}`)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update plan')
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdateStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'banned' ? 'active' : 'banned'
    try {
      setActionLoading(true)
      await axios.put(`/api/admin/users/${id}`, { status: newStatus })
      setUsers(users.map(u => u._id === id ? { ...u, status: newStatus } : u))
      showSuccess(`User status updated to ${newStatus}`)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-50">
      
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary-600" />
            Admin Dashboard
          </h1>
          <p className="mt-2 text-gray-600">Manage user accounts, roles, and subscriptions.</p>
        </div>
        <div className="flex bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-100 items-center gap-3">
          <div className="p-2 bg-primary-50 rounded-lg">
            <Users className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Users</p>
            <p className="text-xl font-bold text-gray-900">{users.length}</p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      {successMsg && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-2 transition-all">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <p className="font-medium">{successMsg}</p>
        </div>
      )}

      {/* Users Table List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto relative">
          {actionLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
          )}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">User</th>
                <th className="py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Role</th>
                <th className="py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Plan</th>
                <th className="py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Joined</th>
                <th className="py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(u => (
                <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {u.avatar ? (
                        <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{u.name}</p>
                        <p className="text-sm text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      u.role === 'hr_admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {u.role === 'hr_admin' && <Shield className="w-3 h-3" />}
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      u.status === 'banned' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {(u.status || 'active').toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={u.plan}
                      onChange={(e) => handleUpdatePlan(u._id, e.target.value)}
                      className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2 outline-none font-medium cursor-pointer"
                    >
                      <option value="free">Free</option>
                      <option value="pro">Pro</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleUpdateStatus(u._id, u.status || 'active')}
                        disabled={u._id === user._id}
                        title={u.status === 'banned' ? 'Unban User' : 'Ban User'}
                        className={`p-2 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                          u.status === 'banned' ? 'text-green-600 hover:bg-green-50' : 'text-orange-500 hover:bg-orange-50'
                        }`}
                      >
                        <Ban className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleUpdateRole(u._id, u.role)}
                        disabled={u._id === user._id}
                        title={`Make ${u.role === 'hr_admin' ? 'Recruiter' : 'HR Admin'}`}
                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(u._id, u.name)}
                        disabled={u._id === user._id}
                        title="Delete User"
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
