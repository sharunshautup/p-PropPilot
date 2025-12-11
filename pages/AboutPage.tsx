import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Master Your Trading Discipline</h1>
        <p className="text-xl text-slate-600">Understanding the core philosophy of PropPilot.</p>
      </div>

      <div className="space-y-12">
        {/* Section 1 */}
        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Why a 1:2 Risk-to-Reward Ratio Is Better</h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            A 1:2 risk-to-reward ratio means for every ₹1 you risk, you aim to make ₹2. This instantly improves your long-term profitability because you can afford to lose more trades than you win and still end up profitable. For example, with a 1:2 RR, even a 40% win rate can grow your account. This structure protects traders from small gains and big losses, and encourages disciplined, selective trading.
          </p>
        </section>

        {/* Section 2 */}
        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">How a Low Risk-Reward Can Help You Become Profitable Faster</h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            Many traders try to take big targets, but the truth is simple: even a small risk-to-reward like 1:1 or 1:1.5 can help you become profitable faster because the target is easier to hit. When your RR is realistic, your wins come more frequently, your psychology improves, and your confidence grows. Lower RR also reduces pressure during prop challenges, where consistency and discipline matter more than massive profits.
          </p>
        </section>

        {/* Section 3 */}
        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Why Risk Management Is Extremely Important</h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            Risk management is the foundation of survival in trading. Without controlling risk, even the best strategy fails. Proper risk management protects your account from emotional decisions, limits drawdown, and keeps you trading long enough to reach your goals. Most traders don’t blow accounts because of bad entries — they blow accounts because they risk too much. Controlling risk means controlling your future.
          </p>
        </section>

        {/* Section 4 */}
        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Why Knowing Your Exact Risk Per Trade Is Critical</h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            When you know exactly how much you are risking per trade, you remove randomness from your trading. This prevents oversized losses, keeps your psychology stable, and helps you grow consistently. Fixed risk per trade creates structure. You know when to stop, when to continue, and how much damage a loss can cause. Uncertainty destroys traders; clarity builds professionals.
          </p>
        </section>

        {/* Section 5 */}
        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">How This Platform Helps Traders</h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            This website generates a complete, personalized master plan for your prop challenge. It tells you exactly how much to risk per trade, what your profit targets are, how much you can lose daily, how much you can lose overall, and how many days you should trade. It removes guesswork and emotion by giving you a clear roadmap to follow. With the Striker, Midfielder, and Defender profiles, traders of all styles get a structured plan that improves discipline, consistency, and long-term performance.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;