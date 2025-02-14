import { AppWithPlugin, Metadata } from "types";

export const getMetadata = (app: AppWithPlugin, of: 'projects' | 'recurringTasks' | 'tasks', projectFileName?: string): Metadata => {
  validateParameters(of, projectFileName);
  
  const settings = app.plugins.plugins["life-planner"].settings;
  const { folderPath, fileName } = getPaths(settings, of, projectFileName);

  const filePathFormatted = `${folderPath}${fileName}.md`;

  return { folderPath, fileName, filePathFormatted };
}

const validateParameters = (of: 'projects' | 'recurringTasks' | 'tasks', projectFileName?: string) => {
  if (of === 'projects' && !projectFileName) {
    throw new Error("Cannot retrieve metadata without accurate parameters");
  }
}

const getPaths = (settings: any, of: 'projects' | 'recurringTasks' | 'tasks', projectFileName?: string) => {
  let folderPath: string;
  let fileName: string;

  switch (of) {
    case 'projects':
      folderPath = cleanString(settings.projects.folder, "folderPath");
      fileName = cleanString(projectFileName!, "fileName");
      break;
      
    case 'recurringTasks':
      folderPath = cleanString(settings.tasks.folder, "folderPath");
      fileName = cleanString(settings.tasks.recurringTasksFile, "fileName");
      break;

    case 'tasks':
      folderPath = cleanString(settings.tasks.folder, "folderPath");
      fileName = cleanString(settings.tasks.file, "fileName");
      break;

    default:
      throw new Error("Param of should be one of 'projects' | 'recurringTasks' | 'tasks'");
  }

  return { folderPath, fileName };
}

const cleanString = (string: string, element: 'folderPath' | 'fileName') => {
  if (!string) return "";
  return element === 'folderPath' 
    ? (string.endsWith('/') ? string : `${string}/`) 
    : (string.startsWith('/') ? string.slice(1) : string);
}