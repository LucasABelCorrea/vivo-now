export interface UserDTO {
  id: number;
  name: string;
  lastName: string;
  email: string;
  position: string;
  telephone: string;
  role: string;
  teamId: number;
  onboardingIds: number[];
}

export interface TaskDTO {
  id: number;
  name: string;
  completed: boolean;
  standard: boolean;
}

export interface StepDTO {
  id: number;
  name: string;
  description: string;
  orderStep: number;
  task: TaskDTO[];
}

export interface ReportDTO {
  id: number;
  comment: string;
  createdAt: string;
}

export interface Onboarding {
  id: number;
  dt_begin: string;
  dt_end: string;
  active: boolean;
  manager: UserDTO;
  buddy: UserDTO;
  collaborator: UserDTO;
  steps: StepDTO[];
  reports: ReportDTO[];
  currentStep: StepDTO;
}


