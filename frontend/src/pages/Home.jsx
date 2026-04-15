import { Link } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'
import AuthContext from '@/context/AuthContext'
import { SparklesIcon, CheckCircle2Icon, ShieldCheckIcon, SearchIcon, FileTextIcon, TargetIcon, TrendingUpIcon, ActivityIcon, ZapIcon, DownloadIcon, EyeIcon, UserIcon, LayoutIcon } from 'lucide-react'

export default function Home() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300); // Small delay to ensure render
    }
  }, []);

  return (
    <div className="bg-[#f8fafc] pt-24 min-h-screen font-sans selection:bg-primary-500 selection:text-white">
      {/* 1. Hero Section - Glossy & Premium */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-28 lg:pb-32">
        {/* Abstract Background Gradients */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-400 to-green-300 opacity-20 blur-[100px] z-0 pointer-events-none" />
        <div className="absolute top-40 left-0 -ml-40 w-80 h-80 rounded-full bg-gradient-to-tr from-teal-400 to-cyan-300 opacity-20 blur-[100px] z-0 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-100 shadow-sm mb-8 animate-fade-in-up">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="text-sm font-semibold text-emerald-800 uppercase tracking-wider">Next-Gen Screening Technology</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-8">
              Welcome to the <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600 block sm:inline">Ai Resume Screening System</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto font-medium leading-relaxed">
              Supercharge your hiring and job applications. Upload any Resume & Job Description to instantly calculate ATS match scores, identify missing skills, and extract perfect insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-16">
              <Link
                to={user ? "/dashboard" : "/upload"}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 text-lg md:text-xl font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-[0_10px_40px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_50px_rgba(16,185,129,0.4)] hover:-translate-y-1 flex items-center gap-3 w-full sm:w-auto justify-center"
              >
                {user ? <ActivityIcon className="w-6 h-6" /> : <SearchIcon className="w-6 h-6" />}
                {user ? "Go to Dashboard" : "Start Screening Now"}
              </Link>
              {!user && (
                <Link
                  to="/login"
                  className="bg-white/80 backdrop-blur-md text-slate-800 border-2 border-slate-200 hover:border-emerald-200 hover:bg-emerald-50 text-lg md:text-xl font-bold py-4 px-10 rounded-full transition-all w-full sm:w-auto text-center shadow-sm"
                >
                  Create Account
                </Link>
              )}
            </div>
          </div>

          {/* Hero Visual Mockup - Glassmorphism */}
          <div className="mt-16 lg:mt-24 relative max-w-5xl mx-auto w-full group">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent rounded-3xl transform -translate-y-4 scale-[0.98] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="rounded-3xl shadow-2xl overflow-hidden border border-white/40 bg-white/60 backdrop-blur-2xl transform transition-transform duration-700 flex flex-col relative z-10">
              {/* Browser Window Header */}
              <div className="bg-slate-100/50 backdrop-blur-md border-b border-slate-200/50 px-6 py-4 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-400 shadow-sm delay-100 hover:bg-red-500 transition-colors"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-sm delay-200 hover:bg-amber-500 transition-colors"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-green-400 shadow-sm delay-300 hover:bg-green-500 transition-colors"></div>
                </div>
                <div className="h-2 w-32 bg-slate-200 rounded-full"></div>
              </div>

              {/* Application Mockup Design */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-0 relative">
                {/* Sidebar */}
                <div className="p-6 md:col-span-3 border-r border-slate-100 bg-white/40 hidden md:block space-y-6">
                  <div className="h-3 w-1/2 bg-slate-200 rounded-full"></div>
                  <div className="space-y-3">
                    <div className="h-10 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center px-4"><div className="h-2 w-3/4 bg-slate-200 rounded-full"></div></div>
                    <div className="h-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center px-4 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-r-full"></div>
                      <div className="h-2 w-2/3 bg-emerald-400 rounded-full"></div>
                    </div>
                    <div className="h-10 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center px-4"><div className="h-2 w-1/2 bg-slate-200 rounded-full"></div></div>
                  </div>
                </div>

                {/* Main Dashboard Panel */}
                <div className="p-10 md:col-span-9 bg-[#f8fafc]/50 relative overflow-hidden flex flex-col md:flex-row gap-8 items-center justify-center py-16">
                  {/* Floating ATS Score Card */}
                  <div className="absolute top-8 right-8 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-2xl p-5 flex items-center gap-4 border border-emerald-50 animate-float z-20">
                    <div className="bg-emerald-100 p-3 rounded-full"><ActivityIcon className="text-emerald-600 w-6 h-6" /></div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Match Score</p>
                      <p className="text-3xl font-black text-slate-800 font-mono tracking-tighter">92<span className="text-emerald-500">%</span></p>
                    </div>
                  </div>

                  {/* Resume Document Ghost */}
                  <div className="w-[60%] aspect-[1/1.4] bg-white shadow-lg rounded-xl border border-slate-200 p-8 flex flex-col gap-4 relative z-10 transition-transform hover:scale-105 duration-500">
                    <div className="flex gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-slate-100 shrink-0 border-2 border-white shadow-sm"></div>
                      <div className="flex-1 mt-2 space-y-2">
                        <div className="h-4 w-2/3 bg-slate-200 rounded-sm"></div>
                        <div className="h-2.5 w-1/3 bg-emerald-200 rounded-sm"></div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-6">
                      <div className="h-2 w-full bg-slate-100 rounded-sm"></div>
                      <div className="h-2 w-full bg-slate-100 rounded-sm"></div>
                      <div className="h-2 w-4/5 bg-slate-100 rounded-sm"></div>
                    </div>
                    <div className="h-3 w-1/3 bg-slate-200 rounded-sm mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-emerald-50 rounded-sm"></div>
                      <div className="h-2 w-full bg-emerald-50 rounded-sm"></div>
                      <div className="h-2 w-5/6 bg-emerald-50 rounded-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 Resume Templates Section - NEW BUILDER LINK */}
      <section id="templates" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-50/50 skew-x-12 transform origin-right"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold mb-6">
                <TargetIcon className="w-4 h-4" /> 95+ ATS Score Guaranteed
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
                Don't just build a resume. Build one that <span className="text-emerald-600">gets noticed</span>.
              </h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Most resumes fail because they can't be read by AI screening systems. Our templates are specifically engineered for maximum ATS readability.
              </p>
              
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle2Icon className="w-5 h-5 text-emerald-500" /> Professional Single-Column Layout
                </li>
                <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle2Icon className="w-5 h-5 text-emerald-500" /> Standard Serif Typography
                </li>
                <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle2Icon className="w-5 h-5 text-emerald-500" /> Real-time PDF Export
                </li>
              </ul>

              <Link to="/resume-builder" className="inline-flex items-center gap-3 bg-slate-900 text-white hover:bg-emerald-600 px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl hover:-translate-y-1">
                Edit High ATS Template Now <TrendingUpIcon className="w-6 h-6" />
              </Link>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="bg-slate-200 p-2 rounded-[2rem] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
                <div className="bg-white p-10 rounded-[1.5rem] border border-slate-100 space-y-6">
                  <div className="h-4 w-1/2 bg-slate-100 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-slate-50 rounded"></div>
                    <div className="h-2 w-full bg-slate-50 rounded"></div>
                    <div className="h-2 w-3/4 bg-slate-50 rounded"></div>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-emerald-600" />
                     </div>
                     <div className="space-y-2">
                        <input className="h-3 w-32 bg-slate-100 rounded border-none outline-none focus:ring-1 focus:ring-emerald-500 px-2 text-[10px]" defaultValue="YOUR NAME HERE" />
                        <div className="h-2 w-20 bg-slate-50 rounded"></div>
                     </div>
                  </div>
                </div>
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-100 animate-bounce">
                <div className="bg-emerald-500 text-white p-2 rounded-lg">
                  <DownloadIcon className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-slate-800">Ready to Download</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="bg-white py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-bold text-slate-400 tracking-widest uppercase mb-12">
            Trusted by recruiters and candidates worldwide
          </p>
          <div className="flex justify-center flex-wrap gap-12 md:gap-24 opacity-50 contrast-0 hover:contrast-100 transition-all duration-700">
            <div className="text-3xl font-black font-serif tracking-tighter text-slate-800">Microsoft</div>
            <div className="text-3xl font-black text-slate-800 tracking-tight">Accenture</div>
            <div className="text-3xl font-extrabold tracking-tight text-slate-800 font-mono">TCS</div>
            <div className="text-3xl font-black font-sans tracking-tight text-slate-800">amazon</div>
            <div className="text-3xl font-bold font-serif italic text-slate-800">Deloitte</div>
          </div>
        </div>
      </section>

      {/* 3. Features Detail Section */}
      <section id="features" className="py-24 lg:py-32 bg-white relative overflow-hidden">
        {/* Subtle background element */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
             <h2 className="text-sm font-black text-emerald-600 uppercase tracking-[0.2em] mb-4">Core Capabilities</h2>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Powerful features to <span className="text-emerald-500">accelerate</span> your career.</h2>
            <p className="text-xl text-slate-500 leading-relaxed font-medium">From hiring intelligence to resume engineering, we provide everything you need in one unified platform.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-[#f8fafc] rounded-[2.5rem] p-10 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-emerald-200/40 hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-white shadow-sm text-emerald-500 rounded-2xl flex items-center justify-center mb-8 border border-slate-50 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                <TargetIcon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Precision ATS Scoring</h3>
              <p className="text-slate-500 font-medium leading-relaxed">Our proprietary AI algorithm mimics top-tier company ATS systems to give you an exact compatibility percentage against any job description.</p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-[#f8fafc] rounded-[2.5rem] p-10 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-emerald-200/40 hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-white shadow-sm text-teal-500 rounded-2xl flex items-center justify-center mb-8 border border-slate-50 group-hover:bg-teal-500 group-hover:text-white transition-all duration-500">
                <LayoutIcon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Smart Resume Builder</h3>
              <p className="text-slate-500 font-medium leading-relaxed">Create professional resumes in minutes with our clean, single-column templates specifically engineered for AI readability and human impact.</p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-[#f8fafc] rounded-[2.5rem] p-10 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-emerald-200/40 hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-white shadow-sm text-blue-500 rounded-2xl flex items-center justify-center mb-8 border border-slate-50 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                <ZapIcon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Skill Gap Detection</h3>
              <p className="text-slate-500 font-medium leading-relaxed">Don't guess what's missing. Our AI identifies crucial keywords and skills absent from your resume and suggests instant improvements.</p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-[#f8fafc] rounded-[2.5rem] p-10 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-emerald-200/40 hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-white shadow-sm text-amber-500 rounded-2xl flex items-center justify-center mb-8 border border-slate-50 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
                <FileTextIcon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Instant PDF Generation</h3>
              <p className="text-slate-500 font-medium leading-relaxed">Export your resume into high-quality, pixel-perfect PDF format. Guaranteed font embedding and structural integrity for all systems.</p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-[#f8fafc] rounded-[2.5rem] p-10 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-emerald-200/40 hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-white shadow-sm text-purple-500 rounded-2xl flex items-center justify-center mb-8 border border-slate-50 group-hover:bg-purple-500 group-hover:text-white transition-all duration-500">
                <ShieldCheckIcon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Recruiter-Grade Insights</h3>
              <p className="text-slate-500 font-medium leading-relaxed">Get the same view recruiters have. Understand how your profile is parsed and categorized by the most common enterprise screening tools.</p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-[#f8fafc] rounded-[2.5rem] p-10 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-emerald-200/40 hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-white shadow-sm text-rose-500 rounded-2xl flex items-center justify-center mb-8 border border-slate-50 group-hover:bg-rose-500 group-hover:text-white transition-all duration-500">
                <ActivityIcon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Real-time Feedback</h3>
              <p className="text-slate-500 font-medium leading-relaxed">See changes in your match score as you edit your resume. Perfect your profile iteratively with immediate AI validation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Steps Section - Dark Mode Feel */}
      <section className="bg-slate-900 py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 tracking-tight">Three steps to perfection</h2>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0"></div>

            <div className="flex flex-col items-center relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-slate-800 flex items-center justify-center mb-8 border border-slate-700 shadow-xl">
                <FileTextIcon className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">1. Drop Documents</h3>
              <p className="text-slate-400 text-lg leading-relaxed max-w-sm">Securely upload the candidate's resume and optionally drop the target Job Description PDF.</p>
            </div>

            <div className="flex flex-col items-center relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-slate-800 flex items-center justify-center mb-8 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <SparklesIcon className="w-8 h-8 text-teal-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">2. AI Parsing</h3>
              <p className="text-slate-400 text-lg leading-relaxed max-w-sm">The engine extracts structured experience, education, and runs an intelligent cross-reference prompt.</p>
            </div>

            <div className="flex flex-col items-center relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-slate-800 flex items-center justify-center mb-8 border border-slate-700 shadow-xl">
                <TrendingUpIcon className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">3. Get Results</h3>
              <p className="text-slate-400 text-lg leading-relaxed max-w-sm">Review the ATS Match Score, readable skill gaps, and professional improvement suggestions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ Section */}
      <section id="faq" className="py-24 bg-[#f8fafc]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-500 font-medium">Everything you need to know about our AI Screening technology.</p>
          </div>

          <div className="space-y-6">
            <FAQItem 
              question="What is an ATS Match Score?" 
              answer="An ATS (Applicant Tracking System) Match Score is a percentage that represents how well your resume aligns with a specific job description. Our AI analyzes keywords, skills, and experience to give you an accurate estimate of how a recruiter's system will rank your profile." 
            />
            <FAQItem 
              question="Is the Resume Builder really ATS-optimized?" 
              answer="Yes! Our templates use a single-column layout, standard fonts, and clear headings—exactly what ATS parsers look for. We avoid complex graphics or multi-column designs that often confuse older screening systems." 
            />
            <FAQItem 
              question="How does the AI handle data privacy?" 
              answer="We take privacy seriously. Your resumes are processed securely and are never shared with third parties. You have full control over your data, and we use industry-standard encryption for all transfers." 
            />
            <FAQItem 
              question="Can I use this for free?" 
              answer="Absolutely! Our basic plan allows you to test the screening engine and build your resume for free. For higher limits and advanced analysis, we offer very affordable Pro plans." 
            />
          </div>
        </div>
      </section>

      {/* 6. Final CTA */}
      <section className="py-24 relative overflow-hidden bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-700 rounded-[3rem] p-12 md:p-20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-black opacity-10 blur-3xl"></div>

            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight relative z-10">Ready to transform your process?</h2>
            <p className="text-xl text-emerald-50 mb-10 font-medium relative z-10 max-w-2xl mx-auto">Join the future of hiring today. It's fast, incredibly accurate, and completely free to test.</p>
            <Link to="/upload" className="inline-block bg-white text-emerald-700 font-bold text-xl py-5 px-12 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 relative z-10">
              Try Screening Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <span className="bg-emerald-600 text-white p-1 rounded-md text-sm leading-none">Ai</span> Resume Screening System
          </div>
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-emerald-600 transition-colors">Features</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Terms</a>
          </div>
          <p className="text-sm text-slate-400">© 2026 Ai Resume Screening System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-6 text-left flex justify-between items-center group"
      >
        <span className="text-xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{question}</span>
        <div className={`w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 bg-emerald-50' : ''}`}>
           <TrendingUpIcon className={`w-4 h-4 ${isOpen ? 'text-emerald-500' : 'text-slate-400 opacity-0 group-hover:opacity-100'}`} />
        </div>
      </button>
      <div className={`px-8 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-slate-600 leading-relaxed font-medium">{answer}</p>
      </div>
    </div>
  );
}

