export type RoadmapType = 'frontend' | 'backend' | 'devops' | 'mobile';

export const ROADMAP_GITHUB_URLS: Record<RoadmapType, string> = {
  frontend:
    'https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/src/data/roadmaps/frontend/frontend.json',
  backend:
    'https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/src/data/roadmaps/backend/backend.json',
  devops:
    'https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/src/data/roadmaps/devops/devops.json',
  mobile:
    'https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/src/data/roadmaps/android/android.json',
};

export const ROADMAP_TABS: { key: RoadmapType; icon: string }[] = [
  { key: 'frontend', icon: '🖥️' },
  { key: 'backend', icon: '⚙️' },
  { key: 'devops', icon: '🚀' },
  { key: 'mobile', icon: '📱' },
];
