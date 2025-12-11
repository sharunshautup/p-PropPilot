import React from 'react';
import { Link } from 'react-router-dom';
import QuoteRotator from '../components/QuoteRotator';
import { AFFILIATES } from '../constants';
import { 
  CheckCircle, 
  ShieldCheck, 
  TrendingUp, 
  Lock, 
  ArrowRight, 
  Target, 
  BarChart2, 
  MousePointer2, 
  PieChart,
  UserCheck,
  Star,
  ExternalLink
} from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="w-full bg-white">
      
      {/* 1. Hero Section - Map/Grid Vibe */}
      <section className="relative pt-20 pb-40 overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-60 z-0 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gray-50 to-transparent z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-light border border-gray-200 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-lime"></span> Live Risk Engine
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1]">
              Track Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600">Risk Metrics</span> <br />
              Quickly & Accurately
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
              Generate a personalized master plan for your prop firm challenge. 
              Manage drawdown, calculate position sizing, and trade with mathematical discipline.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
               <Link to="/builder" className="bg-brand-dark text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group">
                 Start Building <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
               </Link>
               <Link to="/about" className="bg-white text-slate-900 border border-gray-200 px-8 py-4 rounded-full font-bold hover:bg-gray-50 transition-all flex items-center justify-center">
                 View Philosophy
               </Link>
            </div>
            
            {/* Search/Input Mockup */}
            <div className="mt-10 bg-white p-2 rounded-2xl shadow-xl border border-gray-100 max-w-md flex items-center gap-2">
                <div className="p-3 bg-gray-50 rounded-xl">
                    <Target size={20} className="text-slate-400" />
                </div>
                <div className="flex-1">
                    <p className="text-xs text-gray-400 font-medium">Goal</p>
                    <p className="text-sm font-semibold text-slate-900">Pass Prop Challenge</p>
                </div>
                <div className="bg-brand-lime px-4 py-2 rounded-xl text-xs font-bold text-brand-dark cursor-default">
                    Generating...
                </div>
            </div>
          </div>

          {/* Abstract UI Visual - Mimicking the map/pins in reference */}
          <div className="relative hidden md:block h-[600px]">
             
             {/* Stacked Elements: Quote ONLY */}
             <div className="absolute top-10 left-10 z-30 w-80">
                 <QuoteRotator />
             </div>

             {/* Mock UI Cards scattered */}
             <div className="absolute top-48 right-10 bg-white p-4 rounded-2xl shadow-2xl border border-gray-100 z-10 w-64 animate-bounce-slow">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-gray-400">DAILY DRAWDOWN</span>
                    <span className="text-xs font-bold text-red-500">-2.1%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 w-[45%]"></div>
                </div>
             </div>

             <div className="absolute bottom-20 left-20 bg-brand-dark p-5 rounded-2xl shadow-2xl z-20 w-72">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-brand-lime rounded-lg text-brand-dark">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm">Risk Guard</h4>
                        <p className="text-gray-400 text-xs">Active Protection</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>Max Risk</span>
                        <span className="text-white">1.0%</span>
                    </div>
                     <div className="flex justify-between text-xs text-gray-400">
                        <span>Stop Loss</span>
                        <span className="text-white">Fixed</span>
                    </div>
                </div>
             </div>
             
             {/* Decorative Circles */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-gray-200 rounded-full opacity-50"></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-gray-200 rounded-full opacity-50"></div>
          </div>
        </div>
      </section>

      {/* 1.5. The 5%ers Promo Section (Refined & Beautiful) */}
      <section className="relative z-20 -mt-24 pb-20 px-4">
         <div className="max-w-4xl mx-auto">
             <div className="relative group">
                 {/* Glow Effect */}
                 <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37]/40 via-[#00b67a]/40 to-[#D4AF37]/40 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition duration-500"></div>
                 
                 <div className="relative bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col md:flex-row border border-gray-100">
                    
                     {/* Left: Gold Accent Bar */}
                     <div className="hidden md:block w-3 bg-[#D4AF37]"></div>

                     {/* Content Container */}
                     <div className="flex-1 p-8 md:p-10 flex flex-col md:flex-row gap-10 items-center">
                         
                         {/* Left Side: The Trust Visual */}
                         <div className="flex-1 w-full md:border-r border-gray-100 md:pr-10">
                            <div className="flex items-end gap-3 mb-2">
                                <h3 className="text-6xl font-extrabold text-slate-900 leading-none">4.8</h3>
                                <div className="flex flex-col mb-1">
                                    <span className="text-lg font-bold text-slate-900">Excellent</span>
                                    <div className="flex gap-1 mt-1">
                                        {[1,2,3,4,5].map(i => (
                                            <div key={i} className="bg-[#00b67a] w-6 h-6 flex items-center justify-center rounded-[2px]">
                                                <Star size={14} fill="white" className="text-white" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 font-medium mt-2">Based on 19,000+ reviews on Trustpilot</p>
                            
                            {/* Bars */}
                            <div className="mt-6 space-y-2">
                                {[
                                    { l: '5-star', w: '90%', c: 'bg-[#00b67a]' },
                                    { l: '4-star', w: '8%', c: 'bg-[#73cf11]' },
                                ].map((bar, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <span className="text-[10px] font-bold text-gray-400 w-8">{bar.l}</span>
                                        <div className="h-2.5 flex-1 bg-gray-100 rounded-sm overflow-hidden">
                                            <div className={`h-full ${bar.c}`} style={{ width: bar.w }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                         </div>

                         {/* Right Side: The CTA & Context */}
                         <div className="flex-1 w-full text-center md:text-left">
                             <div className="inline-block bg-[#D4AF37]/10 text-[#a38526] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest mb-4">
                                 Industry Leader
                             </div>
                             <h4 className="text-2xl font-bold text-slate-900 mb-2">
                                 Trade with the Best in the Industry
                             </h4>
                             <p className="text-slate-500 mb-6 text-sm leading-relaxed">
                                 Join The 5%ers Funding Traders & Growth Program. Scale your capital with the most trusted firm in the market.
                             </p>

                             <a
                               href="https://www.the5ers.com/?afmc=fft"
                               target="_blank"
                               rel="noopener noreferrer"
                               className="inline-flex w-full md:w-auto items-center justify-center gap-2 bg-[#D4AF37] text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-[#c4a030] hover:shadow-lg hover:-translate-y-0.5 transition-all"
                             >
                                Start Your Journey <ArrowRight size={16} />
                             </a>
                         </div>
                     </div>
                 </div>
             </div>
         </div>
      </section>

      {/* 2. Dark Feature Section - Mimicking 'Our Core Feature' */}
      <section className="bg-brand-dark py-24 px-4 relative overflow-hidden">
         {/* Background blur effects */}
         <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-lime opacity-5 blur-[120px] rounded-full pointer-events-none"></div>

         <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
                <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">Our Core Features</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Enjoy hassle-free planning with the leading risk management logic designed specifically for modern prop trading firms.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="bg-brand-card p-8 rounded-3xl border border-gray-800 hover:border-gray-700 transition-colors group">
                    <div className="flex justify-between items-start mb-8">
                        <div className="bg-gray-800 p-3 rounded-full group-hover:bg-brand-lime transition-colors">
                            <MousePointer2 size={24} className="text-white group-hover:text-brand-dark" />
                        </div>
                        <span className="bg-gray-800 text-gray-300 text-xs font-bold px-3 py-1 rounded-full">Easy to Use</span>
                    </div>
                    <h3 className="text-white text-xl font-bold mb-3">Custom Builder</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                        Set your account size, risk profile, and drawdown limits. We calculate the math instantly.
                    </p>
                    {/* Mock Mini UI */}
                    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 opacity-80">
                        <div className="h-2 w-2/3 bg-gray-700 rounded mb-2"></div>
                        <div className="h-2 w-1/2 bg-gray-700 rounded"></div>
                    </div>
                </div>

                {/* Feature 2 */}
                <div className="bg-brand-card p-8 rounded-3xl border border-gray-800 hover:border-gray-700 transition-colors group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-lime opacity-10 rounded-bl-full"></div>
                    <div className="flex justify-between items-start mb-8">
                         <div className="bg-gray-800 p-3 rounded-full group-hover:bg-brand-lime transition-colors">
                            <PieChart size={24} className="text-white group-hover:text-brand-dark" />
                        </div>
                         <span className="bg-brand-lime text-brand-dark text-xs font-bold px-3 py-1 rounded-full">Recommended</span>
                    </div>
                    <h3 className="text-white text-xl font-bold mb-3">1:2 Risk Ratio</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                        Automatically structures your trades with a positive expectancy model. Lose more, still win.
                    </p>
                    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 flex justify-between items-center opacity-80">
                        <span className="text-xs text-red-400">Risk $100</span>
                        <span className="text-xs text-gray-600">vs</span>
                        <span className="text-xs text-green-400">Reward $200</span>
                    </div>
                </div>

                {/* Feature 3 */}
                <div className="bg-brand-card p-8 rounded-3xl border border-gray-800 hover:border-gray-700 transition-colors group">
                     <div className="flex justify-between items-start mb-8">
                         <div className="bg-gray-800 p-3 rounded-full group-hover:bg-brand-lime transition-colors">
                            <BarChart2 size={24} className="text-white group-hover:text-brand-dark" />
                        </div>
                         <span className="bg-gray-800 text-gray-300 text-xs font-bold px-3 py-1 rounded-full">Analytics</span>
                    </div>
                    <h3 className="text-white text-xl font-bold mb-3">Live Tracking</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                        Monitor your daily limits and win-rate requirements to ensure you never breach a rule.
                    </p>
                     {/* Mock Graph */}
                     <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 h-20 flex items-end gap-1 opacity-80">
                        <div className="bg-gray-700 w-1/5 h-[40%] rounded-t"></div>
                        <div className="bg-gray-700 w-1/5 h-[60%] rounded-t"></div>
                        <div className="bg-brand-lime w-1/5 h-[80%] rounded-t"></div>
                        <div className="bg-gray-700 w-1/5 h-[50%] rounded-t"></div>
                        <div className="bg-gray-700 w-1/5 h-[70%] rounded-t"></div>
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* 3. Steps Section - "Let's Start Sending Your Package" Style */}
      <section className="py-24 px-4 bg-white">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
              <div>
                  <h2 className="text-4xl font-extrabold text-slate-900 mb-8 leading-tight">
                      Let's Start Your <br />
                      <span className="text-brand-dark">Trading Journey</span>
                  </h2>
                  <p className="text-slate-600 mb-12 text-lg">
                      Join thousands of disciplined traders who have passed their challenges by following a strict risk management plan.
                  </p>

                  <div className="space-y-8">
                      {/* Step 1 */}
                      <div className="flex gap-6">
                          <div className="flex-shrink-0">
                             <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center text-slate-900 font-bold border border-gray-200">
                                 1
                             </div>
                          </div>
                          <div>
                              <h4 className="text-xl font-bold text-slate-900 mb-2">Create an account</h4>
                              <p className="text-slate-600 leading-relaxed">
                                  Sign up to save your plans and track your progress over time on the dashboard.
                              </p>
                          </div>
                      </div>

                       {/* Step 2 */}
                       <div className="flex gap-6">
                          <div className="flex-shrink-0">
                             <div className="w-12 h-12 bg-brand-lime rounded-full flex items-center justify-center text-brand-dark font-bold shadow-lg shadow-brand-lime/20">
                                 2
                             </div>
                          </div>
                          <div>
                              <h4 className="text-xl font-bold text-slate-900 mb-2">Build your master plan</h4>
                              <p className="text-slate-600 leading-relaxed">
                                  Enter your account size and risk profile (Striker, Midfielder, Defender) to generate your rules.
                              </p>
                          </div>
                      </div>

                       {/* Step 3 */}
                       <div className="flex gap-6">
                          <div className="flex-shrink-0">
                             <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center text-slate-900 font-bold border border-gray-200">
                                 3
                             </div>
                          </div>
                          <div>
                              <h4 className="text-xl font-bold text-slate-900 mb-2">Execute & Track</h4>
                              <p className="text-slate-600 leading-relaxed">
                                  Follow the daily drawdown limits and profit targets to pass the evaluation.
                              </p>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Mock Phone UI for Steps */}
              <div className="relative mx-auto bg-gray-900 rounded-[3rem] border-8 border-gray-900 h-[600px] w-[320px] shadow-2xl overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-20"></div>
                  <div className="bg-white h-full w-full pt-10 px-4 flex flex-col">
                      <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                          <div>
                              <div className="h-2 w-24 bg-gray-200 rounded mb-1"></div>
                              <div className="h-2 w-16 bg-gray-100 rounded"></div>
                          </div>
                      </div>
                      <div className="bg-brand-dark text-white p-4 rounded-2xl mb-4">
                          <div className="text-xs text-gray-400 mb-1">Current Balance</div>
                          <div className="text-2xl font-bold">$102,450.00</div>
                          <div className="text-xs text-brand-lime mt-1">+2.45% This Week</div>
                      </div>
                      <div className="space-y-3">
                          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between">
                             <span className="text-xs font-bold text-slate-700">#TRADE-001</span>
                             <span className="text-xs font-bold text-green-600">+$450</span>
                          </div>
                           <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between">
                             <span className="text-xs font-bold text-slate-700">#TRADE-002</span>
                             <span className="text-xs font-bold text-red-600">-$200</span>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between">
                             <span className="text-xs font-bold text-slate-700">#TRADE-003</span>
                             <span className="text-xs font-bold text-green-600">+$610</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* 4. Highlighted Prop Firms Section */}
      <section className="py-24 px-4 bg-brand-light">
         <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                 <div className="max-w-xl">
                    <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Recommended Partners</h2>
                    <p className="text-lg text-slate-600">
                        We have curated the best prop firms that align with our risk management models. Choose the one that fits your style.
                    </p>
                 </div>
                 <Link to="/about" className="text-slate-900 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                     See Comparison <ArrowRight size={20} />
                 </Link>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {AFFILIATES.map((aff, i) => (
                <div key={i} className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 group relative overflow-hidden">
                  {/* Decorative Gradient */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-dark via-brand-lime to-brand-dark"></div>
                  
                  <div className="mb-6 flex justify-between items-start">
                     <div className="bg-brand-light p-3 rounded-2xl">
                        <UserCheck size={28} className="text-slate-900" />
                     </div>
                     {i === 1 && (
                         <span className="bg-brand-lime text-brand-dark text-xs font-bold px-3 py-1 rounded-full">Top Choice</span>
                     )}
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{aff.name}</h3>
                  <p className="text-slate-500 mb-8 min-h-[50px] leading-relaxed">
                      {aff.desc}
                  </p>
                  
                  <a href={aff.url} target="_blank" rel="noopener noreferrer" className="block w-full py-4 rounded-xl border-2 border-slate-900 text-slate-900 font-bold text-center hover:bg-slate-900 hover:text-white transition-colors">
                    Visit Website
                  </a>
                </div>
              ))}
            </div>
         </div>
      </section>

      {/* 5. CTA Section - "Download Our App" Style */}
      <section className="bg-brand-dark py-20 px-4 mt-12 relative overflow-hidden">
           <div className="max-w-5xl mx-auto bg-gray-900 rounded-[3rem] p-12 md:p-20 relative border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-12">
               
               {/* Decorative Glow */}
               <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-brand-lime opacity-10 blur-[100px] rounded-full pointer-events-none"></div>

               <div className="relative z-10 max-w-xl">
                   <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Start Building Your Future Today</h2>
                   <p className="text-gray-400 text-lg mb-8">
                       Stop gambling and start trading like a professional. The Plan Builder is free, powerful, and ready for you.
                   </p>
                   <Link to="/builder" className="inline-block bg-brand-lime text-brand-dark px-10 py-5 rounded-full font-bold text-lg hover:bg-brand-limeHover transition-transform transform hover:scale-105 shadow-glow">
                       Create My Master Plan
                   </Link>
               </div>

               {/* Abstract Visual Right */}
               <div className="relative z-10">
                   <div className="w-64 h-64 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center border border-gray-700 shadow-2xl animate-spin-slow">
                        <div className="w-40 h-40 bg-brand-dark rounded-full flex items-center justify-center border border-gray-600">
                             <TrendingUp size={60} className="text-brand-lime" />
                        </div>
                   </div>
               </div>
           </div>
      </section>

    </div>
  );
};

export default LandingPage;