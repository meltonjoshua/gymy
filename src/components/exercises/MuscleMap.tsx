'use client';

import { useState } from 'react';

type MuscleRegion = {
  id: string;
  label: string;
  category: string;
};

const MUSCLE_REGIONS: MuscleRegion[] = [
  { id: 'chest', label: 'Chest', category: 'chest' },
  { id: 'upper-chest', label: 'Upper Chest', category: 'chest' },
  { id: 'shoulders', label: 'Shoulders', category: 'shoulders' },
  { id: 'front-delts', label: 'Front Delts', category: 'shoulders' },
  { id: 'biceps', label: 'Biceps', category: 'arms' },
  { id: 'forearms-front', label: 'Forearms', category: 'arms' },
  { id: 'abs', label: 'Abs', category: 'core' },
  { id: 'obliques-front', label: 'Obliques', category: 'core' },
  { id: 'quads', label: 'Quads', category: 'legs' },
  { id: 'hip-flexors', label: 'Hip Flexors', category: 'legs' },
  { id: 'front-tibialis', label: 'Tibialis', category: 'legs' },
  { id: 'traps', label: 'Traps', category: 'back' },
  { id: 'upper-back', label: 'Upper Back', category: 'back' },
  { id: 'lats', label: 'Lats', category: 'back' },
  { id: 'rear-delts', label: 'Rear Delts', category: 'shoulders' },
  { id: 'triceps', label: 'Triceps', category: 'arms' },
  { id: 'forearms-back', label: 'Forearms', category: 'arms' },
  { id: 'lower-back', label: 'Lower Back', category: 'core' },
  { id: 'glutes', label: 'Glutes', category: 'legs' },
  { id: 'hamstrings', label: 'Hamstrings', category: 'legs' },
  { id: 'calves', label: 'Calves', category: 'legs' },
];

interface MuscleMapProps {
  onMuscleSelect: (muscleId: string, category: string) => void;
  activeMuscle: string | null;
}

const REGION_COLORS: Record<string, string> = {
  chest: '#10b981',
  back: '#6366f1',
  shoulders: '#f59e0b',
  arms: '#ec4899',
  legs: '#3b82f6',
  core: '#f97316',
};

function AnteriorView({
  onMuscleSelect,
  activeMuscle,
}: {
  onMuscleSelect: (id: string) => void;
  activeMuscle: string | null;
}) {
  const baseStyle =
    'cursor-pointer transition-all duration-200 hover:brightness-125 hover:scale-[1.02] origin-center';
  const getFill = (id: string, category: string) => {
    const color = REGION_COLORS[category] ?? '#6b7280';
    return activeMuscle === id ? color : `${color}99`;
  };
  const getStroke = (id: string) => {
    return activeMuscle === id ? '#fff' : 'rgba(255,255,255,0.1)';
  };

  return (
    <svg viewBox="0 0 200 400" className="w-full h-full">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g className={baseStyle} onClick={() => onMuscleSelect('shoulders')}>
        <path
          d="M55,60 L75,50 L85,55 L85,70 L75,72 L60,68 Z"
          fill={getFill('shoulders', 'shoulders')}
          stroke={getStroke('shoulders')}
          strokeWidth={activeMuscle === 'shoulders' ? 1.5 : 0.5}
          filter={activeMuscle === 'shoulders' ? 'url(#glow)' : undefined}
        />
        <path
          d="M115,55 L125,50 L145,60 L140,68 L125,72 L115,70 Z"
          fill={getFill('shoulders', 'shoulders')}
          stroke={getStroke('shoulders')}
          strokeWidth={activeMuscle === 'shoulders' ? 1.5 : 0.5}
          filter={activeMuscle === 'shoulders' ? 'url(#glow)' : undefined}
        />
      </g>

      <g className={baseStyle} onClick={() => onMuscleSelect('chest')}>
        <path
          d="M75,72 L85,70 L97,78 L100,95 L83,95 L75,85 Z"
          fill={getFill('chest', 'chest')}
          stroke={getStroke('chest')}
          strokeWidth={activeMuscle === 'chest' ? 1.5 : 0.5}
          filter={activeMuscle === 'chest' ? 'url(#glow)' : undefined}
        />
        <path
          d="M103,78 L115,70 L125,72 L125,85 L117,95 L100,95 Z"
          fill={getFill('chest', 'chest')}
          stroke={getStroke('chest')}
          strokeWidth={activeMuscle === 'chest' ? 1.5 : 0.5}
          filter={activeMuscle === 'chest' ? 'url(#glow)' : undefined}
        />
      </g>

      <g className={baseStyle} onClick={() => onMuscleSelect('biceps')}>
        <path
          d="M58,68 L75,72 L75,120 L60,115 L55,95 Z"
          fill={getFill('biceps', 'arms')}
          stroke={getStroke('biceps')}
          strokeWidth={activeMuscle === 'biceps' ? 1.5 : 0.5}
          filter={activeMuscle === 'biceps' ? 'url(#glow)' : undefined}
        />
        <path
          d="M125,72 L142,68 L145,95 L140,115 L125,120 Z"
          fill={getFill('biceps', 'arms')}
          stroke={getStroke('biceps')}
          strokeWidth={activeMuscle === 'biceps' ? 1.5 : 0.5}
          filter={activeMuscle === 'biceps' ? 'url(#glow)' : undefined}
        />
      </g>

      <g className={baseStyle} onClick={() => onMuscleSelect('abs')}>
        <path
          d="M83,95 L117,95 L120,105 L117,130 L112,145 L88,145 L83,130 L80,105 Z"
          fill={getFill('abs', 'core')}
          stroke={getStroke('abs')}
          strokeWidth={activeMuscle === 'abs' ? 1.5 : 0.5}
          filter={activeMuscle === 'abs' ? 'url(#glow)' : undefined}
        />
      </g>

      <g className={baseStyle} onClick={() => onMuscleSelect('obliques-front')}>
        <path
          d="M75,85 L83,95 L80,105 L83,130 L78,140 L72,135 L68,115 L70,95 Z"
          fill={getFill('obliques-front', 'core')}
          stroke={getStroke('obliques-front')}
          strokeWidth={activeMuscle === 'obliques-front' ? 1.5 : 0.5}
        />
        <path
          d="M117,95 L125,85 L130,95 L132,115 L128,135 L122,140 L117,130 L120,105 Z"
          fill={getFill('obliques-front', 'core')}
          stroke={getStroke('obliques-front')}
          strokeWidth={activeMuscle === 'obliques-front' ? 1.5 : 0.5}
        />
      </g>

      <g className={baseStyle} onClick={() => onMuscleSelect('quads')}>
        <path
          d="M80,148 L100,145 L103,165 L108,210 L105,260 L95,262 L88,255 L82,210 L78,168 Z"
          fill={getFill('quads', 'legs')}
          stroke={getStroke('quads')}
          strokeWidth={activeMuscle === 'quads' ? 1.5 : 0.5}
          filter={activeMuscle === 'quads' ? 'url(#glow)' : undefined}
        />
        <path
          d="M100,145 L120,148 L122,168 L118,210 L112,255 L107,262 L95,260 L92,210 L97,165 Z"
          fill={getFill('quads', 'legs')}
          stroke={getStroke('quads')}
          strokeWidth={activeMuscle === 'quads' ? 1.5 : 0.5}
          filter={activeMuscle === 'quads' ? 'url(#glow)' : undefined}
        />
      </g>

      <g className={baseStyle} onClick={() => onMuscleSelect('forearms-front')}>
        <path
          d="M55,118 L75,120 L78,155 L72,185 L60,185 L52,175 L50,148 Z"
          fill={getFill('forearms-front', 'arms')}
          stroke={getStroke('forearms-front')}
          strokeWidth={activeMuscle === 'forearms-front' ? 1.5 : 0.5}
        />
        <path
          d="M125,120 L142,118 L148,148 L146,175 L135,185 L128,185 L125,148 Z"
          fill={getFill('forearms-front', 'arms')}
          stroke={getStroke('forearms-front')}
          strokeWidth={activeMuscle === 'forearms-front' ? 1.5 : 0.5}
        />
      </g>

      <g className={baseStyle} onClick={() => onMuscleSelect('calves')}>
        <path
          d="M87,262 L95,260 L98,290 L97,330 L95,355 L87,358 L83,340 L82,300 Z"
          fill={getFill('calves', 'legs')}
          stroke={getStroke('calves')}
          strokeWidth={activeMuscle === 'calves' ? 1.5 : 0.5}
        />
        <path
          d="M105,260 L112,262 L118,300 L117,340 L113,358 L105,355 L103,330 L102,290 Z"
          fill={getFill('calves', 'legs')}
          stroke={getStroke('calves')}
          strokeWidth={activeMuscle === 'calves' ? 1.5 : 0.5}
        />
      </g>
    </svg>
  );
}

function PosteriorView({
  onMuscleSelect,
  activeMuscle,
}: {
  onMuscleSelect: (id: string) => void;
  activeMuscle: string | null;
}) {
  const baseStyle =
    'cursor-pointer transition-all duration-200 hover:brightness-125 hover:scale-[1.02] origin-center';
  const getFill = (id: string, category: string) => {
    const color = REGION_COLORS[category] ?? '#6b7280';
    return activeMuscle === id ? color : `${color}99`;
  };
  const getStroke = (id: string) => {
    return activeMuscle === id ? '#fff' : 'rgba(255,255,255,0.1)';
  };

  return (
    <svg viewBox="0 0 200 400" className="w-full h-full">
      <defs>
        <filter id="glow-back">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g className={baseStyle} onClick={() => onMuscleSelect('traps')}>
        <path
          d="M80,45 L100,40 L120,45 L122,60 L115,65 L100,58 L85,65 L78,60 Z"
          fill={getFill('traps', 'back')}
          stroke={getStroke('traps')}
          strokeWidth={activeMuscle === 'traps' ? 1.5 : 0.5}
          filter={activeMuscle === 'traps' ? 'url(#glow-back)' : undefined}
        />
      </g>

      <g className={baseStyle} onClick={() => onMuscleSelect('rear-delts')}>
        <path
          d="M55,55 L78,60 L80,75 L65,78 L52,68 Z"
          fill={getFill('rear-delts', 'shoulders')}
          stroke={getStroke('rear-delts')}
          strokeWidth={activeMuscle === 'rear-delts' ? 1.5 : 0.5}
          filter={activeMuscle === 'rear-delts' ? 'url(#glow-back)' : undefined}
        />
        <path
          d="M122,60 L145,55 L148,68 L135,78 L120,75 Z"
          fill={getFill('rear-delts', 'shoulders')}
          stroke={getStroke('rear-delts')}
          strokeWidth={activeMuscle === 'rear-delts' ? 1.5 : 0.5}
          filter={activeMuscle === 'rear-delts' ? 'url(#glow-back)' : undefined}
        />
      </g>

      <g className={baseStyle} onClick={() => onMuscleSelect('upper-back')}>
        <path
          d="M78,60 L85,65 L100,58 L115,65 L122,60 L122,80 L100,88 L78,80 Z"
          fill={getFill('upper-back', 'back')}
          stroke={getStroke('upper-back')}
          strokeWidth={activeMuscle === 'upper-back' ? 1.5 : 0.5}
          filter={activeMuscle === 'upper-back' ? 'url(#glow-back)' : undefined}
        />
      </g>

      <g className={baseStyle} onClick={() => onMuscleSelect('lats')}>
        <path
          d="M75,80 L100,88 L100,108 L85,115 L70,105 L65,92 Z"
          fill={getFill('lats', 'back')}
          stroke={getStroke('lats')}
          strokeWidth={activeMuscle === 'lats' ? 1.5 : 0.5}
          filter={activeMuscle === 'lats' ? 'url(#glow-back)' : undefined}
        />
        <path
          d="M100,88 L125,80 L135,92 L130,105 L115,115 L100,108 Z"
          fill={getFill('lats', 'back')}
          stroke={getStroke('lats')}
          strokeWidth={activeMuscle === 'lats' ? 1.5 : 0.5}
          filter={activeMuscle === 'lats' ? 'url(#glow-back)' : undefined}
        />
      </g>

      <g className={baseStyle} onClick={() => onMuscleSelect('triceps')}>
        <path
          d="M58,68 L65,78 L63,100 L65,118 L55,120 L48,105 L45,85 Z"
          fill={getFill('triceps', 'arms')}
          stroke={getStroke('triceps')}
          strokeWidth={activeMuscle === 'triceps' ? 1.5 : 0.5}
          filter={activeMuscle === 'triceps' ? 'url(#glow-back)' : undefined}
        />
        <path
          d="M135,78 L142,68 L155,85 L152,105 L145,120 L135,118 L137,100 Z"
          fill={getFill('triceps', 'arms')}
          stroke={getStroke('triceps')}
          strokeWidth={activeMuscle === 'triceps' ? 1.5 : 0.5}
          filter={activeMuscle === 'triceps' ? 'url(#glow-back)' : undefined}
        />
      </g>

      <g className={baseStyle} onClick={() => onMuscleSelect('lower-back')}>
        <path
          d="M75,115 L100,110 L125,115 L128,130 L120,140 L100,145 L80,140 L72,130 Z"
          fill={getFill('lower-back', 'core')}
          stroke={getStroke('lower-back')}
          strokeWidth={activeMuscle === 'lower-back' ? 1.5 : 0.5}
          filter={activeMuscle === 'lower-back' ? 'url(#glow-back)' : undefined}
        />
      </g>

      <g className={baseStyle} onClick={() => onMuscleSelect('glutes')}>
        <path
          d="M75,142 L100,146 L100,175 L87,180 L75,170 Z"
          fill={getFill('glutes', 'legs')}
          stroke={getStroke('glutes')}
          strokeWidth={activeMuscle === 'glutes' ? 1.5 : 0.5}
          filter={activeMuscle === 'glutes' ? 'url(#glow-back)' : undefined}
        />
        <path
          d="M100,146 L125,142 L125,170 L113,180 L100,175 Z"
          fill={getFill('glutes', 'legs')}
          stroke={getStroke('glutes')}
          strokeWidth={activeMuscle === 'glutes' ? 1.5 : 0.5}
          filter={activeMuscle === 'glutes' ? 'url(#glow-back)' : undefined}
        />
      </g>

      <g className={baseStyle} onClick={() => onMuscleSelect('hamstrings')}>
        <path
          d="M78,180 L87,182 L90,210 L92,255 L82,260 L72,255 L70,210 Z"
          fill={getFill('hamstrings', 'legs')}
          stroke={getStroke('hamstrings')}
          strokeWidth={activeMuscle === 'hamstrings' ? 1.5 : 0.5}
          filter={activeMuscle === 'hamstrings' ? 'url(#glow-back)' : undefined}
        />
        <path
          d="M113,182 L122,180 L128,210 L130,255 L118,260 L108,255 L110,210 Z"
          fill={getFill('hamstrings', 'legs')}
          stroke={getStroke('hamstrings')}
          strokeWidth={activeMuscle === 'hamstrings' ? 1.5 : 0.5}
          filter={activeMuscle === 'hamstrings' ? 'url(#glow-back)' : undefined}
        />
      </g>

      <g className={baseStyle} onClick={() => onMuscleSelect('calves')}>
        <path
          d="M72,260 L82,255 L85,290 L87,330 L85,355 L77,358 L72,340 L70,300 Z"
          fill={getFill('calves', 'legs')}
          stroke={getStroke('calves')}
          strokeWidth={activeMuscle === 'calves' ? 1.5 : 0.5}
        />
        <path
          d="M118,260 L128,255 L130,300 L128,340 L123,358 L115,355 L113,330 L115,290 Z"
          fill={getFill('calves', 'legs')}
          stroke={getStroke('calves')}
          strokeWidth={activeMuscle === 'calves' ? 1.5 : 0.5}
        />
      </g>

      <g className={baseStyle} onClick={() => onMuscleSelect('forearms-back')}>
        <path
          d="M48,120 L58,120 L62,155 L58,185 L46,185 L42,168 L40,145 Z"
          fill={getFill('forearms-back', 'arms')}
          stroke={getStroke('forearms-back')}
          strokeWidth={activeMuscle === 'forearms-back' ? 1.5 : 0.5}
        />
        <path
          d="M135,120 L145,120 L152,145 L150,168 L146,185 L138,185 L138,155 Z"
          fill={getFill('forearms-back', 'arms')}
          stroke={getStroke('forearms-back')}
          strokeWidth={activeMuscle === 'forearms-back' ? 1.5 : 0.5}
        />
      </g>
    </svg>
  );
}

const MUSCLE_TO_CATEGORY: Record<string, string> = {
  chest: 'chest',
  'upper-chest': 'chest',
  shoulders: 'shoulders',
  'front-delts': 'shoulders',
  'rear-delts': 'shoulders',
  biceps: 'arms',
  forearms: 'arms',
  'forearms-front': 'arms',
  'forearms-back': 'arms',
  triceps: 'arms',
  abs: 'core',
  'obliques-front': 'core',
  'lower-back': 'core',
  traps: 'back',
  'upper-back': 'back',
  lats: 'back',
  quads: 'legs',
  'hip-flexors': 'legs',
  'front-tibialis': 'legs',
  glutes: 'legs',
  hamstrings: 'legs',
  calves: 'legs',
};

const MUSCLE_LABELS: Record<string, string> = {
  chest: 'Chest',
  'upper-chest': 'Upper Chest',
  shoulders: 'Shoulders',
  'front-delts': 'Front Delts',
  'rear-delts': 'Rear Delts',
  biceps: 'Biceps',
  forearms: 'Forearms',
  'forearms-front': 'Forearms',
  'forearms-back': 'Forearms',
  triceps: 'Triceps',
  abs: 'Abs',
  'obliques-front': 'Obliques',
  'lower-back': 'Lower Back',
  traps: 'Traps',
  'upper-back': 'Upper Back',
  lats: 'Lats',
  quads: 'Quads',
  'hip-flexors': 'Hip Flexors',
  'front-tibialis': 'Tibialis',
  glutes: 'Glutes',
  hamstrings: 'Hamstrings',
  calves: 'Calves',
};

export default function MuscleMap({ onMuscleSelect, activeMuscle }: MuscleMapProps) {
  const [view, setView] = useState<'front' | 'back'>('front');

  const handleMuscleClick = (muscleId: string) => {
    const region = MUSCLE_REGIONS.find((r) => r.id === muscleId);
    const category = region?.category ?? MUSCLE_TO_CATEGORY[muscleId] ?? 'chest';
    onMuscleSelect(muscleId, category);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setView('front')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            view === 'front'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'bg-gray-800 text-gray-400 border border-gray-700/50 hover:text-gray-300'
          }`}
        >
          Front
        </button>
        <button
          onClick={() => setView('back')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            view === 'back'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'bg-gray-800 text-gray-400 border border-gray-700/50 hover:text-gray-300'
          }`}
        >
          Back
        </button>
      </div>

      <div className="relative w-48 h-80 mx-auto">
        {view === 'front' ? (
          <AnteriorView onMuscleSelect={handleMuscleClick} activeMuscle={activeMuscle} />
        ) : (
          <PosteriorView onMuscleSelect={handleMuscleClick} activeMuscle={activeMuscle} />
        )}
      </div>

      {activeMuscle && (
        <div className="mt-3 text-center">
          <span className="text-sm font-medium text-emerald-400">
            {MUSCLE_LABELS[activeMuscle] ?? activeMuscle}
          </span>
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
        {Object.entries(REGION_COLORS).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[10px] text-gray-500 capitalize">{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
