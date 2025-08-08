// src/types/onboardingTypes.ts

/** Role pode ser apenas uma string (nome) ou um objeto mais rico devolvido pelo backend */
export type Role = string | { id?: number; name?: string };

/** User vindo da API — muitos campos podem faltar em respostas parciais, então são opcionais */
export interface UserDTO {
  id?: number;
  name?: string;
  lastName?: string;
  email?: string;
  position?: string;
  telephone?: string;
  role?: Role;
  teamId?: number | null;
  onboardingIds?: number[];
}

/** Task: marca opcional para maior robustez (backend pode retornar outras flags) */
export interface TaskDTO {
  id: number;
  name: string;
  completed?: boolean;
  standard?: boolean;
  // permite campos extras que o backend possa enviar
  [key: string]: any;
}

/** Step: aceita tanto `task` quanto `tasks` e torna os campos opcionais */
export interface StepDTO {
  id: number;
  name?: string;
  description?: string;
  orderStep?: number;
  // compatibilidade com variações do backend
  task?: TaskDTO[];
  tasks?: TaskDTO[];
  // flag auxiliar (alguns backends marcam a step atual)
  current?: boolean;
  [key: string]: any;
}

/** Report: campos alinhados com seu modelo (feeling = feeling/int) */
export interface ReportDTO {
  id?: number;
  createdAt?: string; // LocalDate ou ISO string
  feeling?: number;
  question?: string;
  event?: string;
  comment?: string;
  [key: string]: any;
}

/** Team (útil para tipar respostas mais ricas do usuário/teams) */
export interface TeamDTO {
  id?: number;
  name?: string;
  department?: string;
  platformIds?: number[];
  users?: UserDTO[];
  [key: string]: any;
}

/** Onboarding: torna muitos campos opcionais e aceita dt_begin/dt_end como string | Date */
export interface Onboarding {
  id?: number;
  dt_begin?: string | Date;
  dt_end?: string | Date;
  active?: boolean;
  manager?: UserDTO;
  buddy?: UserDTO;
  collaborator?: UserDTO;
  steps?: StepDTO[];
  reports?: ReportDTO[];
  currentStep?: StepDTO;
  // permite campos extras
  [key: string]: any;
}
