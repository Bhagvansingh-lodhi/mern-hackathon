import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!token) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo / Brand */}
          <div className="flex items-center">
            <span className="text-xl font-semibold tracking-wide text-blue-600">
              AI Career Coach
            </span>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-gray-600">
              Welcome back 👋
            </span>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white 
                         transition-all duration-200 
                         hover:bg-red-600 hover:shadow-md 
                         active:scale-95"
            >
              Logout
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}
