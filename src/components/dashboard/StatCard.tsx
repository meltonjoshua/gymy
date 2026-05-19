'use client';

import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  gradient?: string;
}

export function StatCard({
  icon,
  value,
  label,
  trend,
  trendValue,
  gradient = 'from-emerald-500/10 to-emerald-600/5',
}: StatCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor =
    trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-gray-500';

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} backdrop-blur-xl border border-white/[0.06] p-5 transition-all duration-300 hover:border-white/[0.12] hover:shadow-lg hover:shadow-emerald-500/5`}
    >
      <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-sm" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 rounded-xl bg-white/[0.06] text-emerald-400">{icon}</div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
              <TrendIcon className="w-3 h-3" />
              {trendValue && <span>{trendValue}</span>}
            </div>
          )}
        </div>
        <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
        <div className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wider">
          {label}
        </div>
      </div>
    </div>
  );
}
