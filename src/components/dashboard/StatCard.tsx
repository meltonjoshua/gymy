'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  trend?: 'up' | 'down';
  trendValue?: string;
}

export default function StatCard({ icon, value, label, trend, trendValue }: StatCardProps) {
  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 hover:border-emerald-500/30 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trendValue}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
    </div>
  );
}