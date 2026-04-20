import { useState,useRef , useEffect } from 'react';
import {
  DownloadIcon,
  ArrowLeftIcon,
  SparklesIcon,
  PlusIcon,
  Trash2Icon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  CodeIcon,
  AwardIcon,
  LayoutIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ResumeBuilder() {
  const resumeRef = useRef();

  // Initial Data
  const [data, setData] = useState({
    name: 'Ajay Kumar',
    title: 'Full Stack Web Developer',
    email: 'ajay.dev@example.com',
    phone: '+91 7906622676',
    location: 'Mumbai, India',
    summary: 'Innovative Full Stack Developer with 3+ years of experience in building high-performance web applications. Expert in MERN stack, Next.js, and cloud deployments. Passionate about creating seamless user experiences and optimizing backend scalability.',
    experience: [
      {
        company: 'Digital Pulse Systems',
        role: 'Senior Developer',
        duration: 'Jan 2022 - Present',
        description: '• Architecture and development of a scalable microservices-based e-commerce platform.\n• Reduced page load times by 40% using advanced caching and image optimization techniques.'
      }
    ],
    education: [
      {
        school: 'University of Technology',
        degree: 'B.Tech in Information Technology',
        year: '2016 - 2020'
      }
    ],
    projects: [
      {
        name: 'AI Resume Screener',
        link: 'https://github.com/ajay/ai-screener',
        description: 'Developed an automated ATS screening tool using OpenAI API and React, helping recruiters parse 500+ resumes daily.'
      }
    ],
    skills: ['React.js', 'Node.js', 'MongoDB', 'AWS', 'Docker', 'Tailwind CSS', 'TypeScript'],
    certifications: [
      { name: 'AWS Certified Developer', issuer: 'Amazon Web Services' }
    ]
  });

  const handleDownload = async () => {
    const element = resumeRef.current;
    const originalStyle = element.style.cssText;

    // Exact A4 dimensions for high-quality capture
    element.style.cssText = 'width: 210mm; min-height: 297mm; background: white; padding: 0.8in; margin: 0; position: fixed; top: 0; left: 0; z-index: -100; font-family: "Times New Roman", serif; transform: none;';

    try {
      const canvas = await html2canvas(element, {
        scale: 3, // High DPI
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${data.name.replace(/\s+/g, '_')}_Resume.pdf`);
    } catch (err) {
      console.error(err);
      alert("Error generating PDF. Please try again.");
    } finally {
      element.style.cssText = originalStyle;
    }
  };

  // Helper functions
  const updateField = (field, value) => setData(prev => ({ ...prev, [field]: value }));

  const updateArr = (key, index, field, value) => {
    setData(prev => ({
      ...prev,
      [key]: prev[key].map((item, i) => i === index ? { ...item, [field]: value } : item)
    }));
  };

  const addItem = (key, template) => {
    setData(prev => ({
      ...prev,
      [key]: [...prev[key], template]
    }));
  };

  const removeItem = (key, index) => {
    setData(prev => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] pt-24 pb-20 font-sans">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Navigation & Actions */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-10 gap-6">
          <div className="flex items-center gap-6">
            <Link to="/" className="p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all group">
              <ArrowLeftIcon className="w-6 h-6 text-slate-400 group-hover:text-emerald-500" />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Resume Builder</h1>
              <p className="text-slate-500 font-medium">Create a high-impact, ATS-ready professional resume.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="hidden sm:flex items-center gap-2 bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-2xl text-sm font-bold border border-emerald-100 shadow-sm">
              <SparklesIcon className="w-5 h-5 animate-pulse" />
              <span>AI Scoring Optimized</span>
            </div>
            <button
              onClick={handleDownload}
              className="flex-1 lg:flex-none bg-slate-900 hover:bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:-translate-y-1 active:scale-95"
            >
              <DownloadIcon className="w-5 h-5" />
              Download PDF
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">

          {/* LEFT: EDITING FORM (7 Cols) */}
          <div className="lg:col-span-7 space-y-8 pb-10">

            {/* 1. PERSONAL INFO */}
            <SectionWrapper title="Personal Information" icon={<UserIcon className="w-6 h-6 text-emerald-500" />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
                <InputGroup label="Full Name" value={data.name} onChange={v => updateField('name', v)} />
                <InputGroup label="Job Title" value={data.title} onChange={v => updateField('title', v)} />
                <InputGroup label="Email Address" value={data.email} icon={<MailIcon className="w-4 h-4" />} onChange={v => updateField('email', v)} />
                <InputGroup label="Phone Number" value={data.phone} icon={<PhoneIcon className="w-4 h-4" />} onChange={v => updateField('phone', v)} />
                <div className="md:col-span-2">
                  <InputGroup label="Location (City, Country)" value={data.location} icon={<MapPinIcon className="w-4 h-4" />} onChange={v => updateField('location', v)} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Professional Summary</label>
                  <textarea
                    value={data.summary}
                    onChange={e => updateField('summary', e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white p-4 rounded-2xl outline-none transition-all resize-none h-32 text-slate-700 leading-relaxed"
                    placeholder="A brief overview of your professional background and key achievements..."
                  />
                </div>
              </div>
            </SectionWrapper>

            {/* 2. EXPERIENCE */}
            <SectionWrapper
              title="Work Experience"
              icon={<BriefcaseIcon className="w-6 h-6 text-emerald-500" />}
              action={<button onClick={() => addItem('experience', { company: '', role: '', duration: '', description: '' })} className="text-emerald-600 font-bold text-sm flex items-center gap-1 hover:underline"><PlusIcon className="w-4 h-4" /> Add More</button>}
            >
              <div className="p-8 space-y-6">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="relative p-6 bg-slate-50 rounded-2xl border-2 border-transparent hover:border-emerald-100 transition-all group">
                    <button onClick={() => removeItem('experience', idx)} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-lg"><Trash2Icon className="w-5 h-5" /></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputGroup label="Company" value={exp.company} onChange={v => updateArr('experience', idx, 'company', v)} />
                      <InputGroup label="Role" value={exp.role} onChange={v => updateArr('experience', idx, 'role', v)} />
                      <InputGroup label="Duration" placeholder="e.g. 2021 - Present" value={exp.duration} onChange={v => updateArr('experience', idx, 'duration', v)} />
                      <div className="md:col-span-2 mt-2">
                        <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Responsibilities & Achievements</label>
                        <textarea
                          value={exp.description}
                          onChange={e => updateArr('experience', idx, 'description', e.target.value)}
                          placeholder="• Use bullet points for better impact..."
                          className="w-full bg-slate-50 border-b-2 border-slate-200 focus:border-emerald-500 p-2 outline-none transition-all h-24 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionWrapper>

            {/* 3. PROJECTS */}
            <SectionWrapper
              title="Key Projects"
              icon={<LayoutIcon className="w-6 h-6 text-emerald-500" />}
              action={<button onClick={() => addItem('projects', { name: '', link: '', description: '' })} className="text-emerald-600 font-bold text-sm flex items-center gap-1 hover:underline"><PlusIcon className="w-4 h-4" /> Add Project</button>}
            >
              <div className="p-8 space-y-6">
                {data.projects.map((proj, idx) => (
                  <div key={idx} className="relative p-6 bg-slate-50 rounded-2xl border-2 border-transparent hover:border-emerald-100 transition-all group">
                    <button onClick={() => removeItem('projects', idx)} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-lg"><Trash2Icon className="w-5 h-5" /></button>
                    <div className="space-y-4">
                      <InputGroup label="Project Name" value={proj.name} onChange={v => updateArr('projects', idx, 'name', v)} />
                      <InputGroup label="Link (GitHub / Demo)" value={proj.link} onChange={v => updateArr('projects', idx, 'link', v)} />
                      <textarea
                        value={proj.description}
                        onChange={e => updateArr('projects', idx, 'description', e.target.value)}
                        placeholder="Describe the technologies used and what you built..."
                        className="w-full bg-slate-50 border-b-2 border-slate-200 focus:border-emerald-500 p-2 outline-none transition-all h-20 text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SectionWrapper>

            <div className="grid md:grid-cols-2 gap-8">
              {/* 4. EDUCATION */}
              <SectionWrapper
                title="Education"
                icon={<GraduationCapIcon className="w-6 h-6 text-emerald-500" />}
                action={<button onClick={() => addItem('education', { school: '', degree: '', year: '' })} className="text-emerald-600 font-bold text-xs"><PlusIcon className="w-3 h-3 inline" /> add</button>}
              >
                <div className="p-6 space-y-4">
                  {data.education.map((edu, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-xl relative group">
                      <button onClick={() => removeItem('education', idx)} className="absolute top-2 right-2 text-red-300 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"><Trash2Icon className="w-4 h-4" /></button>
                      <InputGroup label="School/University" value={edu.school} onChange={v => updateArr('education', idx, 'school', v)} />
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <InputGroup label="Degree" value={edu.degree} onChange={v => updateArr('education', idx, 'degree', v)} />
                        <InputGroup label="Year" value={edu.year} onChange={v => updateArr('education', idx, 'year', v)} />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionWrapper>

              {/* 5. CERTIFICATIONS */}
              <SectionWrapper
                title="Certifications"
                icon={<AwardIcon className="w-6 h-6 text-emerald-500" />}
                action={<button onClick={() => addItem('certifications', { name: '', issuer: '' })} className="text-emerald-600 font-bold text-xs"><PlusIcon className="w-3 h-3 inline" /> add</button>}
              >
                <div className="p-6 space-y-4">
                  {data.certifications.map((cert, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-xl relative group">
                      <button onClick={() => removeItem('certifications', idx)} className="absolute top-2 right-2 text-red-300 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"><Trash2Icon className="w-4 h-4" /></button>
                      <InputGroup label="Certificate Name" value={cert.name} onChange={v => updateArr('certifications', idx, 'name', v)} />
                      <InputGroup label="Issued By" value={cert.issuer} onChange={v => updateArr('certifications', idx, 'issuer', v)} />
                    </div>
                  ))}
                </div>
              </SectionWrapper>
            </div>

            {/* 6. SKILLS */}
            <SectionWrapper title="Skills" icon={<CodeIcon className="w-6 h-6 text-emerald-500" />}>
              <div className="p-8">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">List your skills (comma separated)</label>
                <input
                  type="text"
                  value={data.skills.join(', ')}
                  onChange={e => updateField('skills', e.target.value.split(',').map(s => s.trim()))}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white p-4 rounded-2xl outline-none transition-all font-medium text-slate-700"
                  placeholder="React, Node.js, Python, AWS..."
                />
              </div>
            </SectionWrapper>

          </div>

          {/* RIGHT: STICKY PREVIEW (5 Cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 h-fit">
            <div className="bg-slate-900 rounded-[2.5rem] p-1.5 shadow-2xl overflow-hidden border border-slate-800">
              <div className="bg-slate-800/50 backdrop-blur-md px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">High ATS Standard</span>
              </div>

              <div className="bg-slate-100 flex justify-center items-start overflow-auto p-4 max-h-[75vh]">
                {/* THE DOCUMENT CAPTURE DIV */}
                <div
                  ref={resumeRef}
                  className="bg-white p-[0.7in] font-serif text-slate-900 w-[210mm] min-h-[297mm] shadow-lg transform scale-[0.38] sm:scale-[0.45] md:scale-[0.52] lg:scale-[0.35] xl:scale-[0.5] 2xl:scale-[0.55] origin-top mb-[-180mm]"
                >
                  {/* Header */}
                  <div className="text-center mb-6 border-b-4 border-black pb-4">
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">{data.name}</h1>
                    <p className="text-sm font-semibold mb-1 italic opacity-80">{data.title}</p>
                    <p className="text-[13px] flex items-center justify-center gap-4">
                      <span>{data.location}</span>
                      <span className="text-slate-300">|</span>
                      <span>{data.phone}</span>
                      <span className="text-slate-300">|</span>
                      <span>{data.email}</span>
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="mb-6">
                    <h2 className="text-lg font-black border-b border-slate-900 uppercase mb-2">Professional Summary</h2>
                    <p className="text-[13.5px] text-justify leading-snug whitespace-pre-line">{data.summary}</p>
                  </div>

                  {/* Experience */}
                  {data.experience.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-black border-b border-slate-900 uppercase mb-2">Work Experience</h2>
                      {data.experience.map((exp, idx) => (
                        <div key={idx} className="mb-4">
                          <div className="flex justify-between items-baseline">
                            <span className="font-black text-[15px]">{exp.company}</span>
                            <span className="text-[12px] font-bold italic">{exp.duration}</span>
                          </div>
                          <div className="text-[13px] font-bold text-slate-700 italic mb-1">{exp.role}</div>
                          <p className="text-[13px] text-slate-800 leading-snug whitespace-pre-line">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Projects */}
                  {data.projects.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-black border-b border-slate-900 uppercase mb-2">Key Projects</h2>
                      {data.projects.map((proj, idx) => (
                        <div key={idx} className="mb-3">
                          <div className="flex justify-between items-baseline">
                            <span className="font-bold text-[14.5px] text-emerald-900">{proj.name}</span>
                            <span className="text-[11px] text-blue-700 italic">{proj.link}</span>
                          </div>
                          <p className="text-[13px] text-slate-800 leading-snug whitespace-pre-line">{proj.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Grid for Edu & Skills */}
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h2 className="text-lg font-black border-b border-slate-900 uppercase mb-2">Education</h2>
                      {data.education.map((edu, idx) => (
                        <div key={idx} className="mb-3">
                          <p className="text-[14px] font-black">{edu.school}</p>
                          <p className="text-[12px] font-bold italic">{edu.degree}</p>
                          <p className="text-[11px] font-bold opacity-60">{edu.year}</p>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h2 className="text-lg font-black border-b border-slate-900 uppercase mb-2">Certifications</h2>
                      {data.certifications?.map((cert, idx) => (
                        <div key={idx} className="mb-2">
                          <p className="text-[13px] font-black">{cert.name}</p>
                          <p className="text-[11px] font-bold italic opacity-60">{cert.issuer}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t-2 border-slate-100">
                    <h2 className="text-lg font-black border-b border-slate-900 uppercase mb-2">Expertise & Skills</h2>
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      {data.skills.map((skill, i) => (
                        <span key={i} className="text-[12px] font-bold bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{skill}</span>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Sub-components for cleaner code
function SectionWrapper({ title, icon, action, children }) {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
      <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm">{icon}</div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function InputGroup({ label, value, onChange, icon, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] block">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-slate-50/50 border-2 border-transparent focus:border-emerald-500 focus:bg-white ${icon ? 'pl-11' : 'px-4'} py-3.5 rounded-2xl outline-none transition-all font-medium text-slate-700 text-sm`}
        />
      </div>
    </div>
  );
}
