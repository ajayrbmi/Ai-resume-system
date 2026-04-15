import { Link, useNavigate } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'
import AuthContext from '@/context/AuthContext'
import { LogOutIcon, UserIcon, MenuIcon, XIcon } from 'lucide-react'

export default function Navbar() {
  const { user, setUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/')
  }

  const scrollToSection = (id) => {
    setMobileMenu(false);
    if (window.location.pathname === '/') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl md:text-2xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
            <span className="bg-primary-600 text-white p-1.5 rounded-lg leading-none">Ai</span>
            <span className="hidden sm:inline">Resume Screening System</span>
            <span className="sm:hidden">Resume Screening</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex gap-6 text-sm font-medium text-gray-600">
              <Link to="/resume-builder" className="hover:text-primary-600 transition-colors">Resume Templates</Link>
              <Link to="/pricing" className="hover:text-primary-600 transition-colors">Pricing</Link>
              <button onClick={() => scrollToSection('features')} className="hover:text-primary-600 transition-colors">Features</button>
              <button onClick={() => scrollToSection('faq')} className="hover:text-primary-600 transition-colors">FAQ</button>
              {user?.role === 'admin' && (
                <Link to="/admin" className="font-semibold text-amber-600 hover:text-amber-700 transition-colors">Admin</Link>
              )}
            </nav>

            <div className="flex items-center gap-4 border-l pl-8 border-gray-200">
              {user ? (
                <>
                  <Link to="/upload" className="font-semibold text-gray-700 hover:text-primary-600 transition-colors">Dashboard</Link>
                  <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 px-3 py-1.5 rounded-full transition-colors cursor-pointer" title="Edit Profile">
                    {user?.avatar ? (
                      <img src={user.avatar} className="w-5 h-5 rounded-full object-cover" alt="avatar" />
                    ) : (
                      <UserIcon className="w-4 h-4 text-primary-600" />
                    )}
                    {user?.name || 'User'}
                  </Link>
                  <button onClick={logout} className="text-gray-400 hover:text-red-500 transition-colors p-1" aria-label="Logout">
                    <LogOutIcon className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="font-semibold text-gray-700 hover:text-primary-600 transition-colors">Log In</Link>
                  <Link to="/login" className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-full font-semibold transition-all shadow-md shadow-primary-500/20 hover:shadow-lg hover:-translate-y-0.5">
                    Build My Resume
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700 p-2"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenu && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b shadow-xl px-4 py-6 flex flex-col gap-4">
          <Link to="/resume-builder" className="font-medium text-lg text-gray-800" onClick={() => setMobileMenu(false)}>Resume Templates</Link>
          <Link to="/pricing" className="font-medium text-lg text-gray-800" onClick={() => setMobileMenu(false)}>Pricing</Link>
          <button onClick={() => scrollToSection('features')} className="font-medium text-lg text-gray-800 text-left">Features</button>
          <button onClick={() => scrollToSection('faq')} className="font-medium text-lg text-gray-800 text-left">FAQ</button>
          {user?.role === 'admin' && (
            <Link to="/admin" className="font-medium text-lg text-amber-600" onClick={() => setMobileMenu(false)}>Admin</Link>
          )}
          <hr className="border-gray-100" />
          {user ? (
            <>
              <Link to="/upload" className="font-medium text-lg text-primary-600" onClick={() => setMobileMenu(false)}>Dashboard</Link>
              <Link to="/profile" className="font-medium text-lg text-gray-800" onClick={() => setMobileMenu(false)}>My Profile</Link>
              <button onClick={logout} className="text-left font-medium text-lg text-red-600">Log Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="font-medium text-lg text-gray-800" onClick={() => setMobileMenu(false)}>Log In</Link>
              <Link to="/login" className="bg-primary-600 text-center text-white px-5 py-3 rounded-xl font-semibold mt-2" onClick={() => setMobileMenu(false)}>
                Build My Resume
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
