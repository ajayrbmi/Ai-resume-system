import { useState } from 'react'
import { Upload, FileText, Zap } from 'lucide-react'

export default function UploadResume() {
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [parsedData, setParsedData] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.name.endsWith('.docx'))) {
      setFile(droppedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    const formData = new FormData()
    formData.append('resume', file)
    
    try {
      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      setParsedData(data.parsedData)
    } catch (error) {
      console.error('Upload failed', error)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <Zap className="w-16 h-16 text-primary-600 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">Upload Your Resume</h1>
        <p className="text-xl text-gray-600">Drop PDF or DOCX. AI parses instantly.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Upload Area */}
        <div 
          className={`bg-white p-12 rounded-2xl border-2 border-dashed transition-all ${
            dragging ? 'border-primary-400 bg-primary-50 shadow-xl' : 'border-gray-200 hover:border-gray-300'
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onDragEnter={() => setDragging(true)}
        >
          <div className="text-center">
            <Upload className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-2">Drop your resume here</h3>
            <p className="text-gray-500 mb-8">PDF or DOCX (max 5MB)</p>
            <input 
              type="file" 
              accept=".pdf,.docx" 
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="btn-primary inline-flex items-center gap-2 px-8 py-3 cursor-pointer">
              <FileText className="w-4 h-4" />
              Select File
            </label>
            {file && (
              <p className="mt-6 text-sm font-medium text-primary-600 truncate">
                {file.name} ({(file.size / 1024 / 1024).toFixed(1)}MB)
              </p>
            )}
            <button 
              onClick={handleUpload}
              disabled={!file || loading}
              className="btn-primary w-full mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Parsing...' : 'Parse with AI'}
            </button>
          </div>
        </div>

        {/* Preview */}
        {parsedData && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold mb-6">Parsed Data</h3>
            <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto max-h-96">
              {JSON.stringify(parsedData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

