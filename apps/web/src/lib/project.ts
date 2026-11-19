import projectConfig from "../../../../project.json";

export interface ProjectConfig {
  projectId: string;
  portalId: string;
  portalTitle: string;
  displayName: string;
  brandName: string;
  tagline: string;
  studentAuthor: string;
  rollNo: string;
  session: string;
  batch: string;
  section: string;
  officialEmail: string;
  supervisor: string;
  category: string;
  type: string;
  status: string;
  activePhase: string;
  activeMilestone: string;
}

export const project: ProjectConfig = projectConfig as ProjectConfig;
