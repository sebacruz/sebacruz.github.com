export interface ContactData {
  label: string;
  value: string;
}

export interface ExperienceData {
  role: string;
  company: string;
  period: string;
  responsibilities?: string[];
}

export interface ProjectData {
  name: string;
  url?: string;
  technologies: string[];
  description: string;
}

export interface SkillsData {
  name: string;
  items: string[];
}

export interface Data {
  name: string;
  title: string;
  summary: string;
  contact: {
    title: string;
    data: ContactData[];
  };
  experience: {
    title: string;
    data: ExperienceData[];
  };
  projects: {
    title: string;
    data: ProjectData[];
  };
  skills: {
    title: string;
    data: SkillsData[];
  };
}
