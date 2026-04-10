import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';

function Login() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const res = await authAPI.login({
          email: formData.email,
          password: formData.password
        });

        if (!res?.token) {
          throw new Error('Invalid email or password');
        }

        localStorage.setItem('token', res.token);
        window.dispatchEvent(new Event('authchange'));
        navigate('/dashboard', { replace: true });
      } else {
        await authAPI.register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });

        setSuccess('Registration successful. Please login.');
        setIsLogin(true);
        setFormData({ name: '', email: '', password: '' });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.20),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.16),_transparent_30%),linear-gradient(180deg,_#f8fbff_0%,_#edf4ff_100%)] px-4">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden rounded-[32px] bg-slate-900 p-10 text-white shadow-[0_25px_90px_-45px_rgba(15,23,42,0.8)] lg:block">
          <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">
            AI Career Coach
          </div>
          <h1 className="mt-6 text-5xl font-semibold leading-tight tracking-tight">
            Turn your profile into a clearer career path.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
            Explore role recommendations, generate learning roadmaps, and review your resume from one clean workspace.
          </p>
          <div className="mt-10 grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-sm font-semibold text-white">Tailored role suggestions</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Match your skills and interests to practical next-step roles.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-sm font-semibold text-white">Focused learning plans</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Break a big goal into phases, topics, and action items.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="rounded-[32px] border border-white/70 bg-white/92 p-8 shadow-[0_25px_90px_-55px_rgba(15,23,42,0.45)] backdrop-blur">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-lg font-bold text-white shadow-md">
                AI
              </div>
              <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900">
                {isLogin ? 'Welcome back' : 'Create your account'}
              </h1>
              <p className="text-sm text-slate-600">
                {isLogin
                  ? 'Sign in to continue building your career plan.'
                  : 'Join to unlock personalized career guidance powered by AI.'}
              </p>
            </div>

            <div className="mb-6 flex overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 rounded-xl py-3 text-sm font-semibold transition ${
                  isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 rounded-xl py-3 text-sm font-semibold transition ${
                  !isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 focus:outline-none"
                />
              )}

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 focus:outline-none"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 focus:outline-none"
              />

              {error && (
                <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </p>
              )}
              {success && (
                <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {success}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-700 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
