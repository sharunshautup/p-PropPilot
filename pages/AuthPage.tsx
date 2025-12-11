import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Fix: Sanitize email to remove whitespace and normalize case
    const cleanEmail = email.trim().toLowerCase();
    
    // Basic frontend validation to prevent sending invalid formats to Supabase
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      alert("Please enter a valid email address (e.g. user@example.com)");
      setLoading(false);
      return;
    }
    
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ 
          email: cleanEmail, 
          password 
        });
        if (error) throw error;
        
        if (data.session) {
          navigate('/dashboard');
        }
      } else {
        const { data, error } = await supabase.auth.signUp({ 
          email: cleanEmail, 
          password 
        });
        if (error) throw error;

        if (data.session) {
          navigate('/dashboard');
        } else if (data.user) {
          alert("Registration successful! Please check your email to confirm your account before logging in.");
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      console.error("Authentication Error:", error);
      // Improve error message readability
      let msg = "An error occurred. Please check your credentials.";
      
      if (typeof error === 'object' && error !== null && 'message' in error) {
        msg = error.message;
      } else if (typeof error === 'string') {
        msg = error;
      }

      if (msg.includes("Invalid login credentials")) msg = "Incorrect email or password.";
      if (msg.includes("User already registered")) msg = "This email is already registered. Please login.";
      
      // Fix: Specific handling for unconfirmed email error
      if (msg.includes("Email not confirmed")) {
        msg = "Your email address has not been verified yet. Please check your inbox (and spam folder) for the confirmation link from Supabase.";
      }
      
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 bg-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-lime opacity-5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md relative z-10">
        <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-2">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-center text-gray-500 mb-8">
           {isLogin ? "Sign in to access your risk plans." : "Join PropPilot to start planning."}
        </p>
        
        <form onSubmit={handleAuth} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-dark focus:outline-none transition-all font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-dark focus:outline-none transition-all font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 mt-4 shadow-lg flex justify-center items-center"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (isLogin ? "Sign In" : "Sign Up")}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            onClick={() => {
              setIsLogin(!isLogin);
              setEmail('');
              setPassword('');
            }} 
            className="font-bold text-brand-dark hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;