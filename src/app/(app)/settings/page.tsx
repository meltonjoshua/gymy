'use client';

import SettingsPageContent from '@/components/settings/SettingsPageContent';
import { exportAllData, importData, exportWorkoutsCsv } from '@/lib/data-export';
import { useState } from 'react';

export default function SettingsPage() {
  const [importStatus, setImportStatus] = useState('');

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gymy-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const csv = exportWorkoutsCsv();
    if (!csv) return;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gymy-workouts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const success = importData(ev.target?.result as string);
        setImportStatus(success ? 'Import successful!' : 'Import failed. Invalid file.');
        setTimeout(() => setImportStatus(''), 3000);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      <SettingsPageContent />

      <div>
        <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">
          Data
        </h2>
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 divide-y divide-zinc-800">
          <button
            onClick={handleExport}
            className="w-full text-left px-4 py-3 hover:bg-zinc-800 transition-colors"
          >
            <div className="text-sm text-white">Export All Data</div>
            <div className="text-xs text-zinc-500">Download all Gymy data as JSON</div>
          </button>
          <button
            onClick={handleExportCSV}
            className="w-full text-left px-4 py-3 hover:bg-zinc-800 transition-colors"
          >
            <div className="text-sm text-white">Export Workouts as CSV</div>
            <div className="text-xs text-zinc-500">Download workout data for spreadsheets</div>
          </button>
          <button
            onClick={handleImport}
            className="w-full text-left px-4 py-3 hover:bg-zinc-800 transition-colors"
          >
            <div className="text-sm text-white">Import Data</div>
            <div className="text-xs text-zinc-500">Restore from a JSON backup</div>
          </button>
        </div>
        {importStatus && <p className="text-sm text-emerald-400 mt-2">{importStatus}</p>}
      </div>
    </div>
  );
}
