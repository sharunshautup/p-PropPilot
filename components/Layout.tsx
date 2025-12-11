import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogIn, LogOut, ArrowRight, Activity } from 'lucide-react';
import { supabase } from '../supabaseClient';

const Layout: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Dark Header like Reference */}
      <nav className="bg-brand-dark border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-2">
              <div className="bg-brand-lime p-1.5 rounded-lg">
                <Activity size={20} className="text-brand-dark" />
              </div>
              <Link to="/" className="text-2xl font-bold text-white tracking-tight">PropPilot<span className="text-brand-lime">.</span></Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-300 hover:text-white font-medium text-sm transition-colors">Home</Link>
              <Link to="/about" className="text-gray-300 hover:text-white font-medium text-sm transition-colors">Philosophy</Link>
              <Link to="/dashboard" className="text-gray-300 hover:text-white font-medium text-sm transition-colors">Dashboard</Link>
              
              {session ? (
                <button 
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-red-400 font-medium text-sm transition-colors"
                >
                  Logout
                </button>
              ) : (
                <Link to="/auth" className="text-gray-300 hover:text-white font-medium text-sm transition-colors">
                  Login
                </Link>
              )}

              <Link to="/builder" className="bg-brand-lime text-brand-dark px-6 py-2.5 rounded-full font-bold text-sm hover:bg-brand-limeHover transition-all transform hover:scale-105 shadow-glow">
                New Plan
              </Link>
            </div>

            {/* Mobile Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setMenuOpen(!menuOpen)} className="text-white p-2">
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-brand-dark border-b border-gray-800 px-4 py-4 space-y-4">
            <Link to="/" className="block text-gray-300 font-medium py-2">Home</Link>
            <Link to="/about" className="block text-gray-300 font-medium py-2">Philosophy</Link>
            <Link to="/dashboard" className="block text-gray-300 font-medium py-2">Dashboard</Link>
            <Link to="/builder" className="block text-brand-lime font-bold py-2">Create Plan</Link>
            {session ? (
               <button onClick={handleLogout} className="block w-full text-left text-red-400 font-medium py-2 border-t border-gray-800 mt-2 pt-4">Logout</button>
            ) : (
               <Link to="/auth" className="block w-full text-left text-white font-medium py-2 border-t border-gray-800 mt-2 pt-4">Login / Sign Up</Link>
            )}
          </div>
        )}
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer - Dark & Clean */}
      <footer className="bg-brand-dark text-gray-400 py-16 px-4 print:hidden border-t border-gray-800">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-brand-lime p-1 rounded">
                <Activity size={16} className="text-brand-dark" />
              </div>
              <h3 className="text-white text-xl font-bold">PropPilot.</h3>
            </div>
            <p className="max-w-sm text-sm leading-relaxed mb-6">
              Professional risk management tools designed to help traders pass prop firm challenges and maintain funded accounts through mathematical discipline.
            </p>
            <div className="flex gap-4">
               {/* Social placeholders using simple circles */}
               <div className="w-8 h-8 rounded-full bg-gray-800 hover:bg-brand-lime transition-colors cursor-pointer"></div>
               <div className="w-8 h-8 rounded-full bg-gray-800 hover:bg-brand-lime transition-colors cursor-pointer"></div>
               <div className="w-8 h-8 rounded-full bg-gray-800 hover:bg-brand-lime transition-colors cursor-pointer"></div>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/builder" className="hover:text-brand-lime transition-colors">Risk Builder</Link></li>
              <li><Link to="/dashboard" className="hover:text-brand-lime transition-colors">My Dashboard</Link></li>
              <li><Link to="/auth" className="hover:text-brand-lime transition-colors">Login / Sign Up</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Resources</h4>
             <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-brand-lime transition-colors">Risk Philosophy</Link></li>
              <li><Link to="/about" className="hover:text-brand-lime transition-colors">Prop Firm Guide</Link></li>
              <li><Link to="/about" className="hover:text-brand-lime transition-colors">Calculators</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-800 text-xs text-center text-gray-600">
          &copy; {new Date().getFullYear()} PropPilot Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;