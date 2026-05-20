'use client';

import { useState } from 'react';
import { useProfile } from '@/hooks/use-profile';
import ProfileHeader from '@/components/profile/ProfileHeader';

export default function ProfilePage() {
  const { profile, updateProfile } = useProfile();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.displayName);

  const handleSave = () => {
    updateProfile('displayName', name);
    setEditing(false);
  };

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
      <ProfileHeader
        profile={profile}
        onEditName={(name: string) => updateProfile('displayName', name)}
      />

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
        {editing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
              placeholder="Display name"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setName(profile.displayName);
                }}
                className="px-4 py-2 bg-zinc-700 text-white text-sm rounded-lg hover:bg-zinc-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="w-full text-center py-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Quick Links</h3>
        <div className="space-y-2">
          <a
            href="/analytics"
            className="block py-2 text-sm text-zinc-300 hover:text-white transition-colors"
          >
            📊 Analytics
          </a>
          <a
            href="/analytics/body"
            className="block py-2 text-sm text-zinc-300 hover:text-white transition-colors"
          >
            📏 Body Stats
          </a>
          <a
            href="/settings"
            className="block py-2 text-sm text-zinc-300 hover:text-white transition-colors"
          >
            ⚙️ Settings
          </a>
        </div>
      </div>
    </div>
  );
}
