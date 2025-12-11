export type RiskProfile = 'Striker' | 'Midfielder' | 'Defender';

export interface PlanData {
  id?: string;
  user_id?: string;
  challenge_name: string;
  account_size: number;
  number_of_steps: number;
  profit_target_each_step_pct: number;
  min_trading_days: number;
  daily_drawdown_pct: number;
  overall_drawdown_pct: number;
  consistency_requirement: string;
  risk_profile: RiskProfile;
  notes: string;
  created_at?: string;
  updated_at?: string;
}

export interface Trade {
  id: string;
  plan_id: string;
  result: 'WIN' | 'LOSS' | 'BE';
  profit_loss: number;
  notes: string;
  created_at: string;
}

export interface CalculatedMetrics {
  riskPerTradePct: number;
  rewardPerTradePct: number;
  riskAmount: number;
  targetAmount: number;
  expectedStepProfit: number;
  maxDailyLoss: number;
  maxTotalLoss: number;
}