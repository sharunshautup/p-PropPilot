import React from 'react';
import { PlanData, CalculatedMetrics } from '../types';
import { TrendingUp, Activity, AlertTriangle, CheckCircle } from 'lucide-react';

interface Props {
  plan: PlanData;
  metrics: CalculatedMetrics;
}

const AdvancedAnalytics: React.FC<Props> = ({ plan, metrics }) => {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  // 4. Suggested Daily Trade Limits
  // floor(daily_drawdown_amount / risk_per_trade_amount)
  const maxTradesPerDay = Math.floor(metrics.maxDailyLoss / metrics.riskAmount);
  
  // 1. Win-Rate Scenario Simulator
  // Based on suggested daily trades (maxTradesPerDay) * min_trading_days
  const winRates = [0.30, 0.40, 0.50, 0.60];
  const totalTradesSim = maxTradesPerDay * plan.min_trading_days;
  
  const scenarios = winRates.map(rate => {
    const wins = Math.round(totalTradesSim * rate);
    const losses = totalTradesSim - wins;
    // Expected Profit = (win_rate × reward_amount × number_of_trades) − ((1 − win_rate) × risk_amount × number_of_trades)
    // Using rounded wins/losses for integer trade counts closer to reality
    const profit = (wins * metrics.targetAmount) - (losses * metrics.riskAmount);
    return { rate, wins, losses, profit };
  });

  // 2. Expected Value (EV) per Trade (50% win rate base)
  const winProb = 0.5;
  const ev = (winProb * metrics.targetAmount) - ((1 - winProb) * metrics.riskAmount);
  
  // 3. Break-Even Risk-Reward Ratio
  // Break-even RR = win_rate / (1 − win_rate)
  const breakEvenRates = [0.40, 0.50, 0.60];
  const breakEvenRRs = breakEvenRates.map(rate => ({
    rate,
    rr: rate / (1 - rate)
  }));
  const currentRR = metrics.rewardPerTradePct / metrics.riskPerTradePct;

  // 5. Risk Cycle Analysis
  const lossChainCount = 3;
  const lossChainAmount = metrics.riskAmount * lossChainCount;
  // wins_needed = ceil(loss_amount / reward_amount)
  const winsToRecover = Math.ceil(lossChainAmount / metrics.targetAmount);

  // 6. Summary Logic
  const evText = ev > 0 ? "positive" : "negative";
  const breakEvenText = currentRR > 1.0 ? "higher" : "lower"; // Comparing generally against 1:1 baseline context, or specifically 50%
  const recoveryText = `If you hit a ${lossChainCount}-loss streak, you will need ${winsToRecover} wins to recover.`;
  
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mt-8 animate-fade-in break-inside-avoid">
      <div className="bg-slate-50 border-b border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5" /> Advanced Analytics & Projections
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Deep dive into probability, expectancy, and risk cycles based on your parameters.
        </p>
      </div>

      <div className="p-6 space-y-10">
        
        {/* Win Rate Simulator */}
        <section>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Win-Rate Scenario Simulator</h4>
          <p className="text-sm text-slate-600 mb-4">
            Projected outcome over <strong>{plan.min_trading_days} days</strong> assuming <strong>{maxTradesPerDay} trades/day</strong> ({totalTradesSim} trades total).
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {scenarios.map((s) => (
              <div key={s.rate} className={`p-4 rounded-lg border ${s.profit > 0 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                <div className="text-center">
                  <span className="block text-sm font-medium text-slate-600">{(s.rate * 100)}% Win Rate</span>
                  <span className={`block text-lg font-bold ${s.profit > 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {formatCurrency(s.profit)}
                  </span>
                  <span className="text-xs text-slate-500 mt-1 block">
                    {s.wins}W - {s.losses}L
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          {/* EV & Break Even */}
          <section>
             <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Statistical Expectancy</h4>
             <div className="space-y-4">
               <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-gray-100">
                  <span className="text-sm font-medium text-slate-700">Expected Value (EV) per Trade</span>
                  <span className={`font-mono font-bold ${ev >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(ev)}
                  </span>
               </div>
               <div className="space-y-2">
                 <p className="text-sm text-slate-500 mb-2">Required RR to Break Even:</p>
                 {breakEvenRRs.map((item) => (
                   <div key={item.rate} className="flex justify-between text-sm border-b border-dotted border-gray-200 pb-1 last:border-0">
                     <span className="text-slate-600">At {item.rate * 100}% Win Rate:</span>
                     <span className="font-mono text-slate-900">1:{item.rr.toFixed(2)}</span>
                   </div>
                 ))}
                 <div className="flex justify-between text-sm pt-2 font-medium">
                    <span className="text-slate-900">Your Current System:</span>
                    <span className="font-mono text-blue-600">1:{currentRR.toFixed(2)}</span>
                 </div>
               </div>
             </div>
          </section>

          {/* Daily Limits & Risk Cycles */}
          <section>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Risk Limits & Cycles</h4>
            
            <div className="mb-6">
               <div className="flex items-start gap-3 p-3 bg-blue-50 text-blue-800 rounded-lg border border-blue-100">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold">Safe Daily Trade Limit: {maxTradesPerDay} Trades</p>
                    <p className="text-xs mt-1 text-blue-700">Stop trading immediately after reaching the limit.</p>
                  </div>
               </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm text-slate-700">
                <span className="font-medium text-slate-900">Cycle 1 (Early Loss Chain):</span><br/>
                3 consecutive losses = <span className="text-red-600 font-mono">{formatCurrency(lossChainAmount)}</span> drawdown.
              </div>
              <div className="text-sm text-slate-700">
                <span className="font-medium text-slate-900">Cycle 2 (Recovery):</span><br/>
                Requires <span className="font-bold">{winsToRecover}</span> winning trades to recover.
              </div>
              <div className="text-sm text-slate-500 italic mt-2">
                 Your system becomes high-risk if you regularly take your maximum allowed trades per day.
              </div>
            </div>
          </section>
        </div>

        {/* Professional Summary */}
        <section className="bg-slate-900 text-slate-300 p-6 rounded-xl relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-white font-bold mb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" /> Professional Assessment
            </h4>
            <p className="text-sm leading-relaxed">
              Your expected value per trade is <span className="text-white font-medium">{evText}</span>. 
              Your current Risk-Reward ratio (1:{currentRR.toFixed(2)}) is <span className="text-white font-medium">{breakEvenText}</span> than the break-even requirement for a 50% win rate. 
              You can safely take <span className="text-white font-medium">{maxTradesPerDay} trades per day</span> without violating daily limits. 
              {recoveryText} 
              Stopping early reduces psychological stress and prevents violation of drawdown rules. 
              Stay within your calculated boundaries to maintain consistency.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AdvancedAnalytics;