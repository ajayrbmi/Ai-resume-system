import { useState, useContext, useEffect } from 'react';
import AuthContext from '@/context/AuthContext';
import { UserIcon, MailIcon, SaveIcon, CameraIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (!user && !localStorage.getItem('token')) {
      navigate('/login');
    }
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAvatar(user.avatar || '');
    }
  }, [user, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ text: 'Image size should be less than 2MB', type: 'error' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const token = localStorage.getItem('token');
      const body = { name, email, avatar };

      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
      } else {
        setMessage({ text: data.message || 'Update failed', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Network error. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="min-h-screen flex text-center mt-32 justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-10 text-white flex flex-col md:flex-row items-center gap-6">
            <div className="relative group w-24 h-24">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-4xl font-bold uppercase border-2 border-white/40 shadow-inner overflow-hidden">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user.name?.[0] || 'U'
                )}
              </div>
              <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <CameraIcon className="w-8 h-8 text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-1">My Profile</h1>
              <p className="text-emerald-50 opacity-90">Manage your account settings and preferences.</p>
            </div>
          </div>

          <div className="p-8">
            {message.text && (
              <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <UserIcon className="w-4 h-4" /> Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <MailIcon className="w-4 h-4" /> Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:border-transparent outline-none transition-all"
                  disabled={user.googleId ? true : false} // Prevents changing email if logged in via Google
                />
                {user.googleId && <p className="text-xs text-slate-400 mt-1">Email cannot be changed because you signed in with Google.</p>}
              </div>

              {/* Password section has been completely removed to accommodate the profile picture update instead */}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm text-slate-500 font-medium">Current Plan</span>
                  <span className={`text-lg font-bold uppercase tracking-wider ${user.plan === 'pro' ? 'text-emerald-600' : 'text-slate-700'}`}>
                    {user.plan}
                  </span>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-8 rounded-xl font-bold flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  <SaveIcon className="w-5 h-5" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
