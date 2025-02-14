import { AppWithPlugin, Metadata } from "types";

export const getMetadata = (app: AppWithPlugin): Metadata => {
  const settings = app.plugins.plugins["life-planner"].settings;
  const folderPath = settings.tasks.folder.endsWith('/') ? settings.tasks.folder : settings.tasks.folder + '/';
  const fileName = settings.tasks.file.startsWith('/') ? settings.tasks.file.slice(1) : settings.tasks.file;
  const filePathFormatted = folderPath + fileName + ".md";

  return { folderPath, fileName, filePathFormatted };
}