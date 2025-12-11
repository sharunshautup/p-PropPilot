import React from 'react';
import { CalculatedMetrics, PlanData } from '../types';

interface Props {
  plan: PlanData;
  metrics: CalculatedMetrics;
}

const PlanCalculations: React.FC<Props> = ({ plan, metrics }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mt-8">
      <div className="bg-slate-50 border-b border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900">Trading Plan Summary: {plan.challenge_name}</h3>
        <p className="text-sm text-slate-500 mt-1">Profile: <span className="font-medium text-slate-900">{plan.risk_profile}</span></p>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Risk Parameters</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-slate-600">Risk Per Trade</span>
              <span className="font-mono font-medium text-red-600">{metrics.riskPerTradePct}% ({formatCurrency(metrics.riskAmount)})</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-slate-600">Reward Target</span>
              <span className="font-mono font-medium text-green-600">{metrics.rewardPerTradePct}% ({formatCurrency(metrics.targetAmount)})</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-slate-600">Daily Loss Limit</span>
              <span className="font-mono font-medium text-slate-900">{plan.daily_drawdown_pct}% ({formatCurrency(metrics.maxDailyLoss)})</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-slate-600">Total Loss Limit</span>
              <span className="font-mono font-medium text-slate-900">{plan.overall_drawdown_pct}% ({formatCurrency(metrics.maxTotalLoss)})</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Strategic Goals</h4>
           <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-slate-600">Account Size</span>
              <span className="font-mono font-medium text-slate-900">{formatCurrency(plan.account_size)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-slate-600">Profit Target (Per Step)</span>
              <span className="font-mono font-medium text-slate-900">{formatCurrency(metrics.expectedStepProfit)}</span>
            </div>
             <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-slate-600">Minimum Trading Days</span>
              <span className="font-mono font-medium text-slate-900">{plan.min_trading_days} Days</span>
            </div>
             <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-slate-600">Est. Trades to Pass (Wins)</span>
              <span className="font-mono font-medium text-slate-900">
                {Math.ceil(metrics.expectedStepProfit / metrics.targetAmount)} Trades
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-slate-900 mb-3">Suggested Daily Routine</h4>
        <ul className="text-sm text-slate-600 space-y-2 list-disc pl-5">
          <li>Check news calendar 30 minutes before session.</li>
          <li>Mark key levels (Support/Resistance) on H1 and H4 timeframes.</li>
          <li>Wait for setup alignment with <strong>{plan.risk_profile}</strong> risk ({metrics.riskPerTradePct}%).</li>
          <li>Stop trading immediately if Daily Loss of <strong>{formatCurrency(metrics.maxDailyLoss)}</strong> is hit.</li>
          <li>Journal every trade execution and emotion.</li>
        </ul>
      </div>
    </div>
  );
};

export default PlanCalculations;