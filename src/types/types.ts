export interface UserDTO {
 id: number;
 name: string;
}
export interface TaskDTO {
 id: number;
 name: string;
 standard: boolean;
 completed: boolean;
}
export interface StepDTO {
 id: number;
 name: string;
 description: string;
 orderStep: number;
 tasks: TaskDTO[];
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
 reports: any[];
 currentStep: StepDTO;
}