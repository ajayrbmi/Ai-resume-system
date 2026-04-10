import { Link } from 'react-router-dom'
import { SparklesIcon, CheckCircle2Icon, ShieldCheckIcon, RocketIcon, FileTextIcon, AwardIcon, TrendingUpIcon } from 'lucide-react'

export default function Home() {
  return (
    <div className="bg-white pt-24 min-h-screen font-sans">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gray-50/50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-8">
              Land more interviews with <span className="text-primary-600 block sm:inline">AI Resume Builder</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto font-medium">
              ATS Check, AI Writer, and One-Click Job Tailoring make your resume stand out to recruiters in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-12">
              <Link 
                to="/login" 
                className="bg-primary-600 text-white hover:bg-primary-700 text-lg md:text-xl font-bold py-4 px-10 rounded-full transition-all shadow-[0_8px_30px_rgb(16,185,129,0.3)] hover:shadow-[0_8px_30px_rgb(16,185,129,0.5)] hover:-translate-y-1 flex items-center gap-3 w-full sm:w-auto justify-center"
              >
                <SparklesIcon className="w-6 h-6" />
                Build Your Resume
              </Link>
              <Link 
                to="/upload" 
                className="bg-white text-gray-800 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-lg md:text-xl font-bold py-4 px-10 rounded-full transition-all w-full sm:w-auto text-center"
              >
                Get Resume Score
              </Link>
            </div>
            
            <p className="text-gray-500 font-medium">
              Trusted by <span className="text-gray-800 font-bold font-sans">15M+</span> users landing interviews last month.
            </p>
          </div>

          {/* Hero Visual Output / Mockup */}
          <div className="mt-16 lg:mt-24 relative max-w-5xl mx-auto w-full">
            <div className="rounded-2xl shadow-2xl overflow-hidden border border-gray-100 bg-white transform hover:-translate-y-2 transition-transform duration-500">
               {/* Browser window top bar */}
               <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-400"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                 <div className="w-3 h-3 rounded-full bg-green-400"></div>
               </div>
               {/* Dashboard Mockup Design */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                  <div className="bg-gray-50 p-6 md:col-span-1 border-r border-gray-100 hidden md:block">
                    <div className="h-4 w-3/4 bg-gray-200 rounded mb-6"></div>
                    <div className="space-y-4">
                      <div className="h-8 bg-white border border-gray-200 rounded flex items-center px-3"><div className="h-3 w-1/2 bg-gray-200 rounded"></div></div>
                      <div className="h-8 bg-primary-50 border border-primary-200 rounded flex items-center px-3"><div className="h-3 w-2/3 bg-primary-400 rounded"></div></div>
                      <div className="h-8 bg-white border border-gray-200 rounded flex items-center px-3"><div className="h-3 w-1/3 bg-gray-200 rounded"></div></div>
                    </div>
                  </div>
                  <div className="p-8 md:col-span-2 bg-gray-100 flex justify-center items-center py-12 md:py-24">
                    {/* Resume Paper Mockup */}
                    <div className="w-[80%] aspect-[1/1.4] bg-white shadow-xl rounded backdrop-blur-sm border border-gray-200 p-6 flex flex-col gap-4 relative mx-auto">
                        {/* Overlay floating element */}
                        <div className="absolute -right-8 -top-8 bg-white shadow-xl rounded-xl p-4 flex items-center gap-3 animate-float border border-gray-100">
                          <div className="bg-green-100 p-2 rounded-full"><TrendingUpIcon className="text-green-600 w-5 h-5"/></div>
                          <div>
                            <p className="text-xs text-gray-500 font-bold uppercase">ATS Score</p>
                            <p className="text-lg font-black text-gray-900">96%</p>
                          </div>
                        </div>
                        {/* Resume lines */}
                        <div className="flex gap-4 mb-4">
                          <div className="w-16 h-16 rounded-full bg-gray-200 shrink-0"></div>
                          <div className="flex-1 mt-2">
                             <div className="h-4 w-1/2 bg-gray-300 rounded mb-2"></div>
                             <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded mb-1"></div>
                        <div className="h-2 w-full bg-gray-100 rounded mb-1"></div>
                        <div className="h-2 w-3/4 bg-gray-100 rounded mb-4"></div>
                        
                        <div className="h-3 w-1/4 bg-gray-300 rounded mb-2 mt-4"></div>
                        <div className="h-2 w-full bg-gray-100 rounded mb-1"></div>
                        <div className="h-2 w-full bg-gray-100 rounded mb-1"></div>
                        <div className="h-2 w-5/6 bg-gray-100 rounded mb-4"></div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="bg-gray-50 py-12 sm:py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-lg font-semibold text-gray-500 tracking-wide uppercase mb-10">
            Trusted by professionals hired at top companies
          </h2>
          <div className="flex justify-center flex-wrap gap-10 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Fake logos using text since we don't have SVG paths readily */}
             <div className="text-2xl font-black font-serif tracking-tighter">Google</div>
             <div className="text-2xl font-black text-blue-600 tracking-tight">Meta</div>
             <div className="text-2xl font-black tracking-tight flex items-center gap-1"><span className="text-[#E50914] font-bold">NETFLIX</span></div>
             <div className="text-2xl font-black font-sans tracking-tight">amazon</div>
             <div className="text-2xl font-bold font-serif italic text-gray-800">Spotify</div>
          </div>
        </div>
      </section>

      {/* 3. Features Split Section */}
      <section id="features" className="py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-32">
            <div className="order-2 lg:order-1 relative">
               <div className="absolute -inset-4 bg-primary-50 rounded-3xl transform rotate-3"></div>
               <div className="relative bg-white border border-gray-100 rounded-2xl shadow-xl p-8">
                  <div className="space-y-6">
                    <div className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 border-l-4 border-l-primary-500">
                      <ShieldCheckIcon className="w-8 h-8 text-primary-500 shrink-0" />
                      <div>
                        <h4 className="font-bold text-gray-900">ATS-Friendly Layouts</h4>
                        <p className="text-sm text-gray-600 mt-1">Our templates are built precisely to pass through filtering systems unharmed.</p>
                      </div>
                    </div>
                    <div className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                      <SparklesIcon className="w-8 h-8 text-purple-500 shrink-0" />
                      <div>
                        <h4 className="font-bold text-gray-900">AI Rewriting</h4>
                        <p className="text-sm text-gray-600 mt-1">Transform dull tasks into high-impact achievements with a single click.</p>
                      </div>
                    </div>
                    <div className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                      <AwardIcon className="w-8 h-8 text-yellow-500 shrink-0" />
                      <div>
                        <h4 className="font-bold text-gray-900">Expert Tips</h4>
                        <p className="text-sm text-gray-600 mt-1">Real-time suggestions to strengthen action verbs and quantify results.</p>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Pick a template and build your resume in minutes!
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Whether you're a recent graduate or scaling the executive ladder, 
                our resume builder does the heavy lifting. Forget the formatting headache, 
                and let the AI perfectly tailor your skills to exactly what recruiters want.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-gray-700 font-medium"><CheckCircle2Icon className="text-primary-500 w-6 h-6" /> Over 30 ATS-approved templates</li>
                <li className="flex items-center gap-3 text-gray-700 font-medium"><CheckCircle2Icon className="text-primary-500 w-6 h-6" /> Seamless PDF exports</li>
                <li className="flex items-center gap-3 text-gray-700 font-medium"><CheckCircle2Icon className="text-primary-500 w-6 h-6" /> Instantly match with the Job Description</li>
              </ul>
              <Link to="/login" className="text-primary-600 font-bold text-lg hover:text-primary-700 flex items-center gap-2">
                See all features <span className="text-2xl leading-none">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Steps Section */}
      <section className="bg-dark py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-16">Creating your best resume is easy</h2>
          <div className="grid md:grid-cols-3 gap-12">
             <div className="flex flex-col items-center">
               <div className="w-20 h-20 rounded-2xl bg-primary-500/20 flex items-center justify-center mb-6 border border-primary-500/30">
                 <FileTextIcon className="w-10 h-10 text-primary-400" />
               </div>
               <h3 className="text-2xl font-bold mb-4">1. Choose or Upload</h3>
               <p className="text-gray-400 text-lg leading-relaxed max-w-sm">Pick a modern template or upload your dusty old PDF. We'll extract everything instantly.</p>
             </div>
             <div className="flex flex-col items-center">
               <div className="w-20 h-20 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 border border-purple-500/30">
                 <RocketIcon className="w-10 h-10 text-purple-400" />
               </div>
               <h3 className="text-2xl font-bold mb-4">2. Enhance with AI</h3>
               <p className="text-gray-400 text-lg leading-relaxed max-w-sm">Our AI analyzes the exact job description and rewrites your bullets to heavily match the target.</p>
             </div>
             <div className="flex flex-col items-center">
               <div className="w-20 h-20 rounded-2xl bg-yellow-500/20 flex items-center justify-center mb-6 border border-yellow-500/30">
                 <AwardIcon className="w-10 h-10 text-yellow-400" />
               </div>
               <h3 className="text-2xl font-bold mb-4">3. Download & Apply</h3>
               <p className="text-gray-400 text-lg leading-relaxed max-w-sm">Export a flawlessly formatted PDF that passes any ATS system with a 95%+ match score.</p>
             </div>
          </div>
        </div>
      </section>

      {/* 5. Final CTA */}
      <section className="py-24 relative overflow-hidden bg-primary-600">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
         <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-black opacity-10 blur-3xl"></div>
         
         <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
           <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight">Ready to get hired?</h2>
           <p className="text-xl md:text-2xl text-primary-100 mb-12 font-medium">Join over 15 million professionals who have advanced their careers with our builder.</p>
           <Link to="/login" className="inline-block bg-white text-primary-600 hover:bg-gray-50 text-xl font-bold py-5 px-12 rounded-full transition-all shadow-xl hover:shadow-2xl hover:scale-105">
             Build Your Resume Now
           </Link>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
            <span className="bg-primary-600 text-white p-1 rounded-sm text-sm">AI</span> Resume
          </div>
          <div className="flex gap-6 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-gray-900 transition-colors">Templates</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Examples</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
          </div>
          <p className="text-sm text-gray-400">© 2026 AI Resume System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
