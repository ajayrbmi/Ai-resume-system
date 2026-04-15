import { useState, useEffect } from 'react'
import { BarChart3Icon } from 'lucide-react'

export default function Dashboard() {
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)

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
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-12">
        <BarChart3Icon className="w-9 h-9 text-primary-600" />
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold mb-2">{resumes.length}</h3>
          <p className="text-gray-600">Resumes</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold mb-2">--</h3>
          <p className="text-gray-600">Avg Match Score</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Recent Resumes</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : resumes.length === 0 ? (
          <p className="text-gray-500">No resumes yet. <a href="/upload" className="text-primary-600 hover:underline font-medium">Upload your first resume</a></p>
        ) : (
          <div className="space-y-4">
            {resumes.map(resume => (
              <div key={resume._id} className="border border-gray-100 p-4 rounded-xl flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <h4 className="font-bold text-gray-800">{resume.originalFile?.name || 'Untitled Resume'}</h4>
                  <p className="text-sm text-gray-500">Uploaded on {new Date(resume.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-primary-600 font-medium">
                  {resume.parsedData?.skills?.length || 0} Skills Parsed
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

