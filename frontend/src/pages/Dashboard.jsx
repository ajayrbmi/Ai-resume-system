import { useState, useEffect } from 'react'
import { BarChart3Icon } from 'lucide-react'

export default function Dashboard() {
  const [resumes, setResumes] = useState([])

  useEffect(() => {
    // Fetch user resumes
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-12">
        <BarChart3Icon className="w-9 h-9 text-primary-600" />
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold mb-2">0</h3>
          <p className="text-gray-600">Resumes</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold mb-2">87%</h3>
          <p className="text-gray-600">Avg Match Score</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Recent Resumes</h2>
        <p>No resumes yet. <a href="/upload" className="text-primary-600 hover:underline font-medium">Upload your first resume</a></p>
      </div>
    </div>
  )
}

