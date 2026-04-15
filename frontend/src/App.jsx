import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'

import Home from '@/pages/Home'
import Dashboard from '@/pages/Dashboard'
import UploadResume from '@/pages/UploadResume'
import Pricing from '@/pages/Pricing'
import Login from '@/pages/Login'
import Profile from '@/pages/Profile'
import ResumeBuilder from '@/pages/ResumeBuilder'
import AdminPanel from '@/pages/AdminPanel'
import Navbar from '@/components/Navbar'
import AuthContext from '@/context/AuthContext'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        try {
          const res = await axios.get('/api/auth/me')
          setUser(res.data.user)
        } catch (error) {
          console.error(error)
          localStorage.removeItem('token')
        }
      }
      setLoading(false)
    }
    fetchUser()
  }, [])

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} /> : <Login />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/upload" element={user ? <UploadResume /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/admin" element={user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </AuthContext.Provider>
  )
}

export default App

