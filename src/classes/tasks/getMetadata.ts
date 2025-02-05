import { AppWithPlugin, Metadata } from "types";

export const getMetadata = (app: AppWithPlugin): Metadata => {
  const settings = app.plugins.plugins["life-planner"].settings;
  const folderPath = settings.tasksFolder.endsWith('/') ? settings.tasksFolder : settings.tasksFolder + '/';
  const fileName = settings.tasksFile.startsWith('/') ? settings.tasksFile.slice(1) : settings.tasksFile;
  const filePathFormatted = folderPath + fileName + ".md";

  return { folderPath, fileName, filePathFormatted };
}