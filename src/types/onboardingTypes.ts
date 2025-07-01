export interface ChecklistItem {
  id: number;
  label: string;
  completed: boolean;
}

export interface RoadmapStage {
  id: number;
  title: string;
  progress: number;
  checklist: ChecklistItem[];
  status: "active" | "locked" | "completed";
}

export interface UserStatus {
  name: string;
  currentLevel: number;
  journeyDays: number;
}

export interface OnboardingDashboard {
  user: UserStatus;
  stages: RoadmapStage[];
}
