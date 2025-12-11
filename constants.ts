import { RiskProfile } from './types';

export const SUPABASE_URL = "https://ksaxiszkpsyuxrgkerdr.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_-xe4saWCPLxWtZSHzS0MdQ_jMpO5Kjj";

export const MOTIVATIONAL_QUOTES = [
  "Discipline beats motivation — every single time.",
  "Trade the plan, not the emotion.",
  "Small wins build big accounts.",
  "Protect your capital; profits will follow.",
  "Your rules matter more than your feelings.",
  "A good trader waits. A great trader waits longer.",
  "Consistency creates success.",
  "Think in probabilities, not certainties.",
  "Master the mindset, and the market follows.",
  "One good trade is better than ten random ones."
];

export const ACCOUNT_SIZES = [50000, 100000, 200000, 400000];

export const RISK_PROFILES: Record<RiskProfile, { risk: number; reward: number }> = {
  Striker: { risk: 2.0, reward: 4.0 },
  Midfielder: { risk: 1.2, reward: 2.4 },
  Defender: { risk: 0.5, reward: 1.0 }
};

export const AFFILIATES = [
  {
    name: "QT Funded",
    desc: "Best for low budget traders seeking opportunity.",
    url: "https://qtfunded.quanttekel.com/ref/5217/"
  },
  {
    name: "The 5%ers",
    desc: "Best for long-term scaling and career growth.",
    url: "https://www.the5ers.com/?afmc=fft"
  },
  {
    name: "E8 Markets",
    desc: "Best for bigger account sizes and flexible rules.",
    url: "https://e8markets.com/d/AFF30918"
  }
];