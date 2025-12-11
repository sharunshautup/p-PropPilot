import React, { useEffect, useState } from 'react';
import { PlanData } from '../types';
import { supabase } from '../supabaseClient';
import { Trash2, Eye, Download, Plus, Loader2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkSessionAndFetch();
  }, []);

  const checkSessionAndFetch = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/auth');
      return;
    }

    fetchPlans(session.user.id);
  };

  const fetchPlans = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlans(data || []);
    } catch (error: any) {
      console.error('Error fetching plans:', error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const deletePlan = async (e: React.MouseEvent, id?: string) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. Validation
    if (!id) {
        alert("Error: Plan ID is invalid or missing. Cannot delete.");
        return;
    }

    if (deletingId === id) return; // Prevent double clicks

    // 2. Confirmation
    const confirmed = window.confirm(
      "Are you sure you want to delete this plan?\n\nThis will permanently delete the plan and ALL associated trade history."
    );
    
    if (!confirmed) return;
    
    setDeletingId(id);

    try {
      // 3. Delete Trades (Manual Cascade)
      // Attempt to delete trades first to prevent Foreign Key constraint errors
      const { error: tradeError } = await supabase
        .from('trades')
        .delete()
        .eq('plan_id', id);

      if (tradeError) {
        console.warn("Trade deletion warning (might be handled by DB cascade):", tradeError.message);
      }

      // 4. Delete Plan
      // We use .select() to ensure we get confirmation that a row was actually deleted
      const { data, error: planError } = await supabase
        .from('plans')
        .delete()
        .eq('id', id)
        .select();

      if (planError) throw planError;

      // 5. Verification (RLS check)
      // If data is empty, it means RLS policies prevented deletion or the row didn't exist
      if (!data || data.length === 0) {
        throw new Error("Plan was not deleted. Please check your permissions or refresh the page.");
      }
      
      // 6. UI Update
      setPlans(prev => prev.filter(p => p.id !== id));
      
    } catch (error: any) {
      console.error("Delete operation failed:", error);
      alert(`Failed to delete plan: ${error.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const printPlan = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/plan/${id}`);
    // Small delay to allow navigation to complete before print dialog
    setTimeout(() => window.print(), 800);
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-500 gap-4">
      <Loader2 size={32} className="animate-spin text-brand-dark" />
      <p className="font-medium animate-pulse">Loading your dashboard...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Your Master Plans</h1>
            <p className="text-gray-500 mt-2 text-lg">Manage your active risk profiles and saved strategies.</p>
        </div>
        <Link to="/builder" className="bg-brand-dark text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2">
          <Plus size={20} /> Create New Plan
        </Link>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No plans created yet.</h3>
          <p className="text-gray-400 mt-2 mb-6">Start your journey by building a risk plan.</p>
          <Link to="/builder" className="inline-block bg-brand-lime text-brand-dark px-8 py-3 rounded-full font-bold hover:bg-brand-limeHover transition-colors">
            Go to Plan Builder
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-brand-lime/50 transition-all flex flex-col group relative overflow-hidden">
              
              <div className="flex justify-between items-start mb-6">
                <div>
                   <h3 className="font-bold text-xl text-slate-900 line-clamp-1 group-hover:text-brand-dark transition-colors" title={plan.challenge_name}>
                     {plan.challenge_name}
                   </h3>
                   <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">
                     Created: {plan.created_at ? new Date(plan.created_at).toLocaleDateString() : 'N/A'}
                   </p>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase border 
                  ${plan.risk_profile === 'Striker' ? 'bg-red-50 text-red-600 border-red-100' : 
                    plan.risk_profile === 'Midfielder' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                    'bg-green-50 text-green-600 border-green-100'}`}>
                  {plan.risk_profile}
                </span>
              </div>
              
              <div className="space-y-3 mb-8">
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                  <span className="text-sm text-gray-500 font-medium">Account Size</span>
                  <span className="font-bold text-slate-900">${plan.account_size.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                  <span className="text-sm text-gray-500 font-medium">Daily Risk Limit</span>
                  <span className="font-bold text-slate-900">{plan.daily_drawdown_pct}%</span>
                </div>
              </div>

              <div className="flex gap-3 mt-auto pt-6 border-t border-gray-100">
                <Link 
                  to={`/plan/${plan.id}`} 
                  className="flex-1 text-center bg-brand-dark text-white py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                   <Eye size={16} /> View
                </Link>
                 <button 
                   type="button"
                   onClick={(e) => printPlan(e, plan.id!)} 
                   className="flex-1 text-center bg-white border border-gray-200 text-slate-700 py-3 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                 >
                   <Download size={16} /> Print
                </button>
                <button 
                  type="button"
                  onClick={(e) => deletePlan(e, plan.id)} 
                  disabled={deletingId === plan.id}
                  className="w-12 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50 border border-transparent hover:border-red-100" 
                  title="Delete Plan"
                >
                  {deletingId === plan.id ? <Loader2 size={20} className="animate-spin text-red-600" /> : <Trash2 size={20} className="pointer-events-none" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;