import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ProjectDetails } from "@/types/report";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDepartmentName = (branch: string): string => {
  const b = (branch || '').toLowerCase();
  if (b.includes('information technology') || b.includes('it')) {
    return 'Information technology and Engineering';
  }
  if (b.includes('computer science') || b.includes('cs')) {
    return 'Computer Science and Engineering';
  }
  if (b.includes('electronics')) {
    return 'Electronics and Communication Engineering';
  }
  if (b.includes('electrical')) {
    return 'Electrical Engineering';
  }
  if (b.includes('mechanical')) {
    return 'Mechanical Engineering';
  }
  if (b.includes('civil')) {
    return 'Civil Engineering';
  }
  return branch || 'Engineering';
};

export const getDefaultAcknowledgement = (projectDetails: ProjectDetails): string => {
  const deptName = getDepartmentName(projectDetails.branch);
  const formattedGuide = projectDetails.guideName ? `**${projectDetails.guideName}**` : '**Project Guide**';
  const isPlural = projectDetails.students && projectDetails.students.length > 1;

  if (isPlural) {
    return `We are thankful to the technical university Rajiv Gandhi Proudyogiki Vishwavidyalaya, Bhopal for giving us opportunity to convert our theoretical knowledge into the practical skills through this project.

We are thankful to our college SVCE for giving us every resource to complete this project. The project work has been made successful by the group member some effort of the college and faculties.

We express our sincere thanks and gratitude to Principal, **Dr. Neha Khandelwal**, Swami Vivekanand College of Engineering, Indore (M.P.), for providing all the necessary facilities and encouraging environment to bring out the best of our endeavors.

We would like to express gratitude to **Mr. Chandershekhar Kothari**, HOD ${deptName} Department under whose valuable guidance, for encouraging us regularly and explaining each and every concept, we were able to execute our project smoothly.

We give thanks to ${formattedGuide}, ${deptName} department, Swami Vivekanand College of Engineering, Indore (M.P.), for making us confident about the research platform and helping us a lot in research work implementation.

We give special thanks to Project Coordinator **Ms. Suchita Rathore**, ${deptName} department for their willingness to help us in finding solutions to any problems we had with our work.

We would like to acknowledge all our friends & family members for the moral support they extended to us in the completion of this dissertation.`;
  }

  return `I am thankful to the technical university Rajiv Gandhi Proudyogiki Vishwavidyalaya, Bhopal for giving me opportunity to convert my theoretical knowledge into the practical skills through this project.

I am thankful to my college SVCE for giving me every resource to complete this project. The project work has been made successful by the group member some effort of the college and faculties.

I express my sincere thanks and gratitude to Principal, **Dr. Neha Khandelwal**, Swami Vivekanand College of Engineering, Indore (M.P.), for providing all the necessary facilities and encouraging environment to bring out the best of my endeavors.

I would like to express gratitude to **Mr. Chandershekhar Kothari**, HOD ${deptName} Department under whose valuable guidance, for encouraging me regularly and explaining each and every concept, I was able to execute my project smoothly.

I give thanks to ${formattedGuide}, ${deptName} department, Swami Vivekanand College of Engineering, Indore (M.P.), for making me confident about the research platform and helping me a lot in research work implementation.

I give special thanks to Project Coordinator **Ms. Suchita Rathore**, ${deptName} department for their willingness to help me in finding solutions to any problems I had with my work.

I would like to acknowledge all my friends & family members for the moral support they extended to me in the completion of this dissertation.`;
};
