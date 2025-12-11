import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlanData, CalculatedMetrics, RiskProfile, Trade } from '../types';
import { ACCOUNT_SIZES, RISK_PROFILES } from '../constants';
import PlanCalculations from '../components/PlanCalculations';
import AdvancedAnalytics from '../components/AdvancedAnalytics';
import { supabase } from '../supabaseClient';
import { Save, Printer, Share2, ChevronRight, TrendingUp, TrendingDown, History, Plus, X, BarChart3, Edit3, ArrowLeft } from 'lucide-react';

const initialPlan: PlanData = {
  challenge_name: 'My Prop Challenge',
  account_size: 100000,
  number_of_steps: 2,
  profit_target_each_step_pct: 10,
  min_trading_days: 5,
  daily_drawdown_pct: 5,
  overall_drawdown_pct: 10,
  consistency_requirement: 'No major consistency rule',
  risk_profile: 'Midfielder',
  notes: '',
};

const BuilderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Plan Data State
  const [formData, setFormData] = useState<PlanData>(initialPlan);
  const [metrics, setMetrics] = useState<CalculatedMetrics | null>(null);
  
  // UI State
  const [isSaving, setIsSaving] = useState(false);
  const [viewOnly, setViewOnly] = useState(false); // True if viewing an existing plan
  const [editMode, setEditMode] = useState(false); // True if editing settings in view mode
  const [loading, setLoading] = useState(!!id);

  // Live Tracking State
  const [trades, setTrades] = useState<Trade[]>([]);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [showLogModal, setShowLogModal] = useState<'WIN' | 'LOSS' | null>(null);
  const [tradeNote, setTradeNote] = useState('');
  const [isSubmittingTrade, setIsSubmittingTrade] = useState(false);

  // --- Initialization ---

  useEffect(() => {
    if (id) {
      fetchPlanAndTrades(id);
      setViewOnly(true);
    } else {
      setEditMode(true); // New plan starts in edit mode
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    calculateMetrics();
  }, [formData]);

  // Recalculate balance whenever trades or account size changes
  useEffect(() => {
    if (formData.account_size) {
      const totalPnL = trades.reduce((acc, trade) => acc + Number(trade.profit_loss), 0);
      setCurrentBalance(formData.account_size + totalPnL);
    }
  }, [trades, formData.account_size]);

  // --- Data Fetching ---

  const fetchPlanAndTrades = async (planId: string) => {
    try {
      // Validate UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(planId)) {
        alert("Invalid Plan ID format.");
        navigate('/dashboard');
        return;
      }

      // Fetch Plan - Use maybeSingle() to avoid "Cannot coerce..." error on empty results
      const { data: planData, error: planError } = await supabase
        .from('plans')
        .select('*')
        .eq('id', planId)
        .maybeSingle();

      if (planError) throw planError;
      
      if (!planData) {
        alert("Plan not found. It may have been deleted or you do not have permission to view it.");
        navigate('/dashboard');
        return;
      }

      setFormData(planData);

      // Fetch Trades
      const { data: tradeData, error: tradeError } = await supabase
        .from('trades')
        .select('*')
        .eq('plan_id', planId)
        .order('created_at', { ascending: false });

      if (tradeError) throw tradeError;
      setTrades(tradeData || []);

    } catch (error: any) {
      console.error("Error loading plan:", error.message || error);
      
      const errorMessage = error.message || "Unknown error occurred";
      alert(`Error loading plan details: ${errorMessage}`);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  // --- Logic & Actions ---

  const calculateMetrics = () => {
    // Safety check for risk profile in case of bad data
    const profile = RISK_PROFILES[formData.risk_profile] || RISK_PROFILES['Midfielder'];
    
    const riskAmount = formData.account_size * (profile.risk / 100);
    const targetAmount = formData.account_size * (profile.reward / 100);
    
    setMetrics({
      riskPerTradePct: profile.risk,
      rewardPerTradePct: profile.reward,
      riskAmount,
      targetAmount,
      expectedStepProfit: formData.account_size * (formData.profit_target_each_step_pct / 100),
      maxDailyLoss: formData.account_size * (formData.daily_drawdown_pct / 100),
      maxTotalLoss: formData.account_size * (formData.overall_drawdown_pct / 100),
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      alert("Please login to save your plan.");
      navigate('/auth');
      setIsSaving(false);
      return;
    }

    try {
      let error;
      if (formData.id) {
        const { error: updateError } = await supabase
          .from('plans')
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq('id', formData.id);
        error = updateError;
        setEditMode(false); // Exit edit mode after update
      } else {
        const { data, error: insertError } = await supabase
          .from('plans')
          .insert([{ ...formData, user_id: session.user.id }])
          .select()
          .single();
        error = insertError;
        if (data) {
          navigate(`/plan/${data.id}`); // Redirect to view mode
        }
      }

      if (error) throw error;
      if (formData.id) alert("Plan updated successfully!");

    } catch (e: any) {
      alert("Failed to save: " + (e.message || JSON.stringify(e)));
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogTrade = async () => {
    if (!metrics || !id || !showLogModal) return;
    setIsSubmittingTrade(true);

    const isWin = showLogModal === 'WIN';
    // Use fixed risk/reward based on plan metrics
    const profitLoss = isWin ? metrics.targetAmount : -metrics.riskAmount;

    try {
      const { data, error } = await supabase
        .from('trades')
        .insert([{
          plan_id: id,
          result: showLogModal,
          profit_loss: profitLoss,
          notes: tradeNote
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setTrades([data, ...trades]);
        setTradeNote('');
        setShowLogModal(null);
      }
    } catch (error: any) {
      alert("Error logging trade: " + (error.message || JSON.stringify(error)));
    } finally {
      setIsSubmittingTrade(false);
    }
  };

  const handlePrint = () => window.print();
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  // --- Sub-Components ---

  const EquityCurve = () => {
    // Sort oldest to newest for the chart
    const sortedTrades = [...trades].sort((a,b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    
    let running = formData.account_size;
    const points = sortedTrades.map((t, i) => {
      running += Number(t.profit_loss);
      return { i: i + 1, val: running };
    });
    
    const allPoints = [{ i: 0, val: formData.account_size }, ...points];
    const max = Math.max(...allPoints.map(p => p.val));
    const min = Math.min(...allPoints.map(p => p.val));
    const range = max - min || 1; 

    return (
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-72 flex flex-col relative overflow-hidden group">
         <div className="flex justify-between items-center mb-6 relative z-20">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
              <TrendingUp size={16} /> Equity Curve
            </h3>
            <span className={`text-xs font-bold px-2 py-1 rounded ${currentBalance >= formData.account_size ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
               {currentBalance >= formData.account_size ? 'PROFIT' : 'DRAWDOWN'}
            </span>
         </div>
         
         <div className="flex-1 flex items-end gap-1 relative z-10 px-2 pb-2">
             {allPoints.map((p, idx) => {
                 const heightPct = ((p.val - min) / range) * 70 + 15; 
                 const isProfit = p.val >= formData.account_size;
                 const isLast = idx === allPoints.length - 1;
                 return (
                     <div key={idx} className="flex-1 flex flex-col justify-end group/bar relative min-w-[4px]">
                         <div 
                           className={`w-full rounded-t-sm transition-all duration-500 ${isProfit ? 'bg-brand-lime' : 'bg-red-400'} ${isLast ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                           style={{ height: `${heightPct}%` }}
                         ></div>
                         {/* Tooltip */}
                         <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30">
                             {formatCurrency(p.val)}
                         </div>
                     </div>
                 )
             })}
         </div>

         {/* Grid Lines */}
         <div className="absolute inset-0 flex flex-col justify-between p-6 z-0 pointer-events-none">
             <div className="border-t border-dashed border-gray-100 w-full h-0"></div>
             <div className="border-t border-dashed border-gray-100 w-full h-0"></div>
             <div className="border-t border-dashed border-gray-100 w-full h-0"></div>
             <div className="border-t border-dashed border-gray-100 w-full h-0"></div>
         </div>
      </div>
    );
  };

  const InputClass = "w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-dark focus:outline-none transition-all text-slate-900 font-medium text-sm";
  const LabelClass = "block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2";

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading Plan...</div>;
  if (!metrics) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 no-print">
        <div>
           <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-brand-dark mb-2 transition-colors">
             <ArrowLeft size={12} /> BACK TO DASHBOARD
           </button>
           <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
             {formData.challenge_name}
             {viewOnly && (
               <span className={`text-xs px-2 py-1 rounded-full border ${formData.risk_profile === 'Striker' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
                 {formData.risk_profile}
               </span>
             )}
           </h1>
        </div>
        
        <div className="flex flex-wrap gap-2">
            {viewOnly && !editMode && (
                <button onClick={() => setEditMode(true)} className="flex items-center gap-2 bg-white border border-gray-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">
                    <Edit3 size={16} /> Edit Rules
                </button>
            )}
            
            {(editMode || !viewOnly) && (
              <>
                 {viewOnly && (
                   <button onClick={() => setEditMode(false)} className="flex items-center gap-2 bg-gray-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200">
                      Cancel
                   </button>
                 )}
                 <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 bg-brand-dark text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 disabled:opacity-50 shadow-lg">
                    <Save size={16} /> {isSaving ? "Saving..." : "Save Configuration"}
                 </button>
              </>
            )}
            
            {!editMode && viewOnly && (
              <>
                <button onClick={handlePrint} className="p-2 bg-white border border-gray-200 rounded-lg text-slate-700 hover:bg-gray-50"><Printer size={18} /></button>
                <button onClick={handleShare} className="p-2 bg-white border border-gray-200 rounded-lg text-slate-700 hover:bg-gray-50"><Share2 size={18} /></button>
              </>
            )}
        </div>
      </div>

      {/* --- EDIT MODE / INITIAL BUILDER FORM --- */}
      {editMode && (
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-fade-in">
            <div className="lg:col-span-5 space-y-6">
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center text-sm font-bold">1</div>
                        <h2 className="font-bold text-lg text-slate-900">Setup Challenge</h2>
                    </div>
                    
                    <div className="space-y-5">
                        <div>
                           <label className={LabelClass}>Challenge Name</label>
                           <input type="text" value={formData.challenge_name} onChange={e => setFormData({...formData, challenge_name: e.target.value})} className={InputClass} placeholder="FTMO 100k Aggressive" />
                        </div>
                        <div>
                            <label className={LabelClass}>Account Size</label>
                            <select value={formData.account_size} onChange={e => setFormData({...formData, account_size: Number(e.target.value)})} className={InputClass}>
                              {ACCOUNT_SIZES.map(size => <option key={size} value={size}>${size.toLocaleString()}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                               <label className={LabelClass}>Daily Loss %</label>
                               <input type="number" value={formData.daily_drawdown_pct} onChange={e => setFormData({...formData, daily_drawdown_pct: Number(e.target.value)})} className={InputClass} />
                            </div>
                            <div>
                               <label className={LabelClass}>Max Loss %</label>
                               <input type="number" value={formData.overall_drawdown_pct} onChange={e => setFormData({...formData, overall_drawdown_pct: Number(e.target.value)})} className={InputClass} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                               <label className={LabelClass}>Profit Target %</label>
                               <input type="number" value={formData.profit_target_each_step_pct} onChange={e => setFormData({...formData, profit_target_each_step_pct: Number(e.target.value)})} className={InputClass} />
                            </div>
                            <div>
                               <label className={LabelClass}>Min Days</label>
                               <input type="number" value={formData.min_trading_days} onChange={e => setFormData({...formData, min_trading_days: Number(e.target.value)})} className={InputClass} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center text-sm font-bold">2</div>
                        <h2 className="font-bold text-lg text-slate-900">Select Risk Profile</h2>
                    </div>
                    <div className="space-y-3">
                        {Object.keys(RISK_PROFILES).map((p) => (
                           <label key={p} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${formData.risk_profile === p ? 'border-brand-dark bg-gray-50 ring-1 ring-brand-dark' : 'border-gray-200 hover:bg-gray-50'}`}>
                               <div>
                                  <span className="font-bold text-slate-900 block">{p}</span>
                                  <span className="text-xs text-slate-500">Risk {RISK_PROFILES[p as RiskProfile].risk}% / Reward {RISK_PROFILES[p as RiskProfile].reward}%</span>
                               </div>
                               <input 
                                 type="radio" 
                                 name="risk_profile" 
                                 value={p} 
                                 checked={formData.risk_profile === p} 
                                 onChange={() => setFormData({...formData, risk_profile: p as RiskProfile})} 
                                 className="accent-brand-dark h-5 w-5"
                               />
                           </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Preview on Right */}
            <div className="lg:col-span-7">
               <div className="sticky top-24">
                   <PlanCalculations plan={formData} metrics={metrics} />
                   <div className="mt-6 p-4 bg-blue-50 text-blue-800 rounded-xl border border-blue-100 text-sm">
                       <p className="font-bold mb-1">💡 Tip:</p>
                       Once you save this plan, you will unlock the Live Dashboard where you can log trades, track equity, and maintain your journal.
                   </div>
               </div>
            </div>
         </div>
      )}

      {/* --- LIVE DASHBOARD MODE --- */}
      {!editMode && viewOnly && (
          <div className="space-y-8 animate-fade-in">
              
              {/* 1. Top Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Main Balance Card */}
                  <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden group hover:shadow-2xl transition-all">
                      <div className="relative z-10">
                          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Live Account Equity</p>
                          <h2 className="text-4xl font-extrabold tracking-tight tabular-nums">{formatCurrency(currentBalance)}</h2>
                          <div className={`inline-flex items-center gap-1 mt-3 px-2 py-1 rounded text-xs font-bold border ${currentBalance >= formData.account_size ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                             {currentBalance >= formData.account_size ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                             <span>{Math.abs(currentBalance - formData.account_size).toLocaleString('en-US', {style: 'currency', currency: 'USD'})} ({((currentBalance - formData.account_size) / formData.account_size * 100).toFixed(2)}%)</span>
                          </div>
                      </div>
                      {/* Abstract Decoration */}
                      <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-white/5 to-transparent skew-x-12 transform origin-top-right group-hover:from-white/10 transition-colors"></div>
                  </div>

                  {/* Risk Params Card */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center gap-6">
                      <div className="flex justify-between items-end">
                          <div>
                              <p className="text-xs text-gray-500 font-bold uppercase mb-1">Risk Per Trade</p>
                              <p className="text-2xl font-bold text-red-600 tabular-nums">-{formatCurrency(metrics.riskAmount)}</p>
                          </div>
                          <span className="text-xs font-bold bg-red-50 text-red-700 px-2 py-1 rounded">{metrics.riskPerTradePct}%</span>
                      </div>
                      <div className="w-full h-px bg-gray-100"></div>
                      <div className="flex justify-between items-end">
                          <div>
                              <p className="text-xs text-gray-500 font-bold uppercase mb-1">Profit Target</p>
                              <p className="text-2xl font-bold text-green-600 tabular-nums">+{formatCurrency(metrics.targetAmount)}</p>
                          </div>
                          <span className="text-xs font-bold bg-green-50 text-green-700 px-2 py-1 rounded">{metrics.rewardPerTradePct}%</span>
                      </div>
                  </div>

                  {/* Actions Card */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
                       <div>
                           <p className="text-xs text-gray-500 font-bold uppercase mb-3 flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full bg-brand-lime animate-pulse"></div> Live Session
                           </p>
                           <div className="grid grid-cols-2 gap-3">
                               <button 
                                 onClick={() => setShowLogModal('WIN')}
                                 className="py-4 px-4 bg-green-50 text-green-700 border border-green-200 rounded-xl font-bold hover:bg-green-100 hover:scale-[1.02] hover:shadow-md transition-all flex flex-col items-center justify-center gap-1 group"
                               >
                                   <Plus size={24} className="group-hover:rotate-90 transition-transform" /> 
                                   <span className="text-sm">Log Win</span>
                               </button>
                               <button 
                                 onClick={() => setShowLogModal('LOSS')}
                                 className="py-4 px-4 bg-red-50 text-red-700 border border-red-200 rounded-xl font-bold hover:bg-red-100 hover:scale-[1.02] hover:shadow-md transition-all flex flex-col items-center justify-center gap-1 group"
                               >
                                   <X size={24} className="group-hover:rotate-90 transition-transform" />
                                   <span className="text-sm">Log Loss</span>
                               </button>
                           </div>
                       </div>
                  </div>
              </div>

              {/* 2. Main Layout Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Left Column: Journal & History */}
                  <div className="lg:col-span-2 space-y-8">
                       <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                           <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                               <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                   <History size={18} className="text-slate-500" /> Trade Journal
                               </h3>
                               <span className="text-xs font-bold text-gray-500 bg-white border border-gray-200 px-3 py-1 rounded-full shadow-sm">
                                   {trades.length} Trades Logged
                               </span>
                           </div>
                           
                           {trades.length === 0 ? (
                               <div className="p-16 text-center text-gray-400">
                                   <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                       <BarChart3 size={32} className="opacity-20 text-slate-900" />
                                   </div>
                                   <p className="font-medium text-slate-900">No trades recorded yet</p>
                                   <p className="text-sm mt-1">Record your first win or loss to start tracking.</p>
                               </div>
                           ) : (
                               <div className="overflow-x-auto">
                                   <table className="w-full text-sm text-left">
                                       <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold tracking-wider">
                                           <tr>
                                               <th className="px-6 py-4">Result</th>
                                               <th className="px-6 py-4">P/L</th>
                                               <th className="px-6 py-4 w-1/2">Journal Notes</th>
                                               <th className="px-6 py-4 text-right">Time</th>
                                           </tr>
                                       </thead>
                                       <tbody className="divide-y divide-gray-100">
                                           {trades.map((trade) => (
                                               <tr key={trade.id} className="hover:bg-gray-50 transition-colors group">
                                                   <td className="px-6 py-4">
                                                       <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${trade.result === 'WIN' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                                                           {trade.result === 'WIN' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                                           {trade.result}
                                                       </span>
                                                   </td>
                                                   <td className={`px-6 py-4 font-mono font-bold ${Number(trade.profit_loss) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                       {Number(trade.profit_loss) > 0 ? '+' : ''}{formatCurrency(trade.profit_loss)}
                                                   </td>
                                                   <td className="px-6 py-4 text-slate-600">
                                                       {trade.notes ? (
                                                           <span className="line-clamp-1 group-hover:line-clamp-none transition-all">{trade.notes}</span>
                                                       ) : (
                                                           <span className="text-gray-300 italic">No notes</span>
                                                       )}
                                                   </td>
                                                   <td className="px-6 py-4 text-right text-gray-400 text-xs">
                                                       {new Date(trade.created_at).toLocaleDateString()}
                                                   </td>
                                               </tr>
                                           ))}
                                       </tbody>
                                   </table>
                               </div>
                           )}
                       </div>
                       
                       <AdvancedAnalytics plan={formData} metrics={metrics} />
                  </div>

                  {/* Right Column: Visuals & Summary */}
                  <div className="space-y-8">
                       <EquityCurve />
                       <PlanCalculations plan={formData} metrics={metrics} />
                       
                       {/* Quick Notes Area */}
                       <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-100 text-yellow-900">
                           <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full bg-yellow-400"></div> Daily Reminder
                           </h4>
                           <p className="text-sm opacity-90 leading-relaxed">
                               "Trade the plan, not the emotion." <br/>
                               If you are close to your daily limit of <span className="font-bold">{formatCurrency(metrics.maxDailyLoss)}</span>, walk away.
                           </p>
                       </div>
                  </div>

              </div>
          </div>
      )}

      {/* --- LOG TRADE MODAL --- */}
      {showLogModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
                  <div className={`p-8 ${showLogModal === 'WIN' ? 'bg-green-600' : 'bg-red-600'} text-white text-center relative`}>
                      <button onClick={() => setShowLogModal(null)} className="absolute top-4 right-4 text-white/70 hover:text-white p-2">
                          <X size={20} />
                      </button>
                      <h3 className="text-2xl font-extrabold tracking-tight mb-1">{showLogModal === 'WIN' ? 'WINNING TRADE' : 'LOSING TRADE'}</h3>
                      <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-sm font-medium mb-4">
                          {showLogModal === 'WIN' ? 'Target Hit' : 'Stop Loss Hit'}
                      </div>
                      <p className="font-mono text-4xl font-bold">
                          {showLogModal === 'WIN' ? '+' : '-'}{formatCurrency(showLogModal === 'WIN' ? metrics.targetAmount : metrics.riskAmount)}
                      </p>
                  </div>
                  
                  <div className="p-8">
                      {showLogModal === 'LOSS' && (
                          <div className="mb-6">
                              <label className="block text-xs font-bold uppercase text-red-600 mb-2">Why did this trade lose? (Required)</label>
                              <textarea 
                                autoFocus
                                className="w-full p-4 bg-red-50 border-2 border-red-100 rounded-xl focus:ring-0 focus:border-red-400 focus:outline-none text-slate-900 min-h-[120px] placeholder:text-red-300/50"
                                placeholder="E.g. I entered too early, news event spiked spread, valid setup but market reversed..."
                                value={tradeNote}
                                onChange={(e) => setTradeNote(e.target.value)}
                              ></textarea>
                              <p className="text-[10px] text-gray-400 mt-2 text-right"> Honest reflection improves performance.</p>
                          </div>
                      )}
                      
                      {showLogModal === 'WIN' && (
                           <div className="mb-6">
                              <label className="block text-xs font-bold uppercase text-green-700 mb-2">Trade Execution Notes (Optional)</label>
                              <textarea 
                                autoFocus
                                className="w-full p-4 bg-green-50 border-2 border-green-100 rounded-xl focus:ring-0 focus:border-green-400 focus:outline-none text-slate-900 min-h-[120px] placeholder:text-green-700/30"
                                placeholder="E.g. Perfect breakout retest, held through pullback, followed plan exactly..."
                                value={tradeNote}
                                onChange={(e) => setTradeNote(e.target.value)}
                              ></textarea>
                          </div>
                      )}

                      <div className="flex gap-3">
                          <button 
                            onClick={() => setShowLogModal(null)}
                            className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-colors"
                          >
                              Cancel
                          </button>
                          <button 
                             onClick={handleLogTrade}
                             disabled={isSubmittingTrade || (showLogModal === 'LOSS' && !tradeNote.trim())}
                             className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 ${
                                 showLogModal === 'WIN' ? 'bg-green-600 hover:bg-green-700 shadow-green-200' : 'bg-red-600 hover:bg-red-700 shadow-red-200'
                             } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                              {isSubmittingTrade ? 'Saving...' : 'Confirm Log'}
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default BuilderPage;