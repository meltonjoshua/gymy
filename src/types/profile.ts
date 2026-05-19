export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface UserProfile {
  displayName: string;
  joinDate: string;
  achievements: Achievement[];
}