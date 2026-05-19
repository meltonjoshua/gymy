const STORAGE_KEYS = {
  workouts: 'gymy_workouts',
  bodyStats: 'gymy_body_stats',
  settings: 'gymy_settings',
  profile: 'gymy_profile',
} as const;

export interface ExportedData {
  version: number;
  exportedAt: string;
  app: string;
  data: {
    workouts: unknown;
    bodyStats: unknown;
    settings: unknown;
    profile: unknown;
  };
}

function readKey(key: string): unknown {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function exportAllData(): ExportedData {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    app: 'gymy',
    data: {
      workouts: readKey(STORAGE_KEYS.workouts),
      bodyStats: readKey(STORAGE_KEYS.bodyStats),
      settings: readKey(STORAGE_KEYS.settings),
      profile: readKey(STORAGE_KEYS.profile),
    },
  };
}

export function downloadJson(data: ExportedData, filename?: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename ?? `gymy-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export interface ImportResult {
  success: boolean;
  errors: string[];
}

export function importData(jsonString: string): ImportResult {
  const errors: string[] = [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    return { success: false, errors: ['Invalid JSON format'] };
  }

  if (!parsed || typeof parsed !== 'object') {
    return { success: false, errors: ['Data must be a JSON object'] };
  }

  const data = parsed as Record<string, unknown>;

  if (data.app !== 'gymy') {
    errors.push('Not a Gymy backup file');
  }

  if (typeof data.version !== 'number') {
    errors.push('Missing version field');
  }

  if (!data.data || typeof data.data !== 'object') {
    errors.push('Missing data section');
    return { success: false, errors };
  }

  const innerData = data.data as Record<string, unknown>;

  if (errors.length > 0) {
    return { success: false, errors };
  }

  if (innerData.workouts !== null && innerData.workouts !== undefined) {
    try {
      localStorage.setItem(STORAGE_KEYS.workouts, JSON.stringify(innerData.workouts));
    } catch {
      errors.push('Failed to import workouts data');
    }
  }

  if (innerData.bodyStats !== null && innerData.bodyStats !== undefined) {
    try {
      localStorage.setItem(STORAGE_KEYS.bodyStats, JSON.stringify(innerData.bodyStats));
    } catch {
      errors.push('Failed to import body stats data');
    }
  }

  if (innerData.settings !== null && innerData.settings !== undefined) {
    try {
      localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(innerData.settings));
    } catch {
      errors.push('Failed to import settings data');
    }
  }

  if (innerData.profile !== null && innerData.profile !== undefined) {
    try {
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(innerData.profile));
    } catch {
      errors.push('Failed to import profile data');
    }
  }

  return { success: errors.length === 0, errors };
}

export interface WorkoutRecord {
  id: string;
  name: string;
  date: string;
  exercises: Array<{
    exerciseId: string;
    sets: Array<{ reps: number; weight: number }>;
  }>;
}

export function exportWorkoutsCsv(): string | null {
  const raw = readKey(STORAGE_KEYS.workouts);
  if (!raw) return null;

  const rows: string[] = ['Workout,Date,Exercise,Set,Reps,Weight'];

  try {
    const workouts = Array.isArray(raw) ? raw : [];
    for (const workout of workouts) {
      const w = workout as Record<string, unknown>;
      const name = String(w.name ?? 'Untitled');
      const date = String(w.createdAt ?? w.date ?? '');
      const exercises = Array.isArray(w.exercises) ? w.exercises : [];
      for (const ex of exercises) {
        const e = ex as Record<string, unknown>;
        const exName = String((e as Record<string, unknown>).exerciseId ?? 'Unknown');
        const sets = Array.isArray(e.sets) ? e.sets : [];
        for (let i = 0; i < sets.length; i++) {
          const s = sets[i] as Record<string, unknown>;
          rows.push(`"${name}","${date}","${exName}",${i + 1},${s.reps ?? 0},${s.weight ?? 0}`);
        }
      }
    }
  } catch {
    return null;
  }

  return rows.join('\n');
}

export function downloadCsv(csv: string, filename?: string): void {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename ?? `gymy-workouts-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
