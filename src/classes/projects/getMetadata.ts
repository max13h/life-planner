import { AppWithPlugin, Metadata } from "types";

export const getMetadata = (app: AppWithPlugin, projectFileName?: string): Metadata => {
  const settings = app.plugins.plugins["life-planner"].settings;

  const folderPath = settings.projectsFolder.endsWith('/') ? settings.projectsFolder : settings.projectsFolder + '/';
  const fileName = (projectFileName?.startsWith('/') ? projectFileName?.slice(1).replace(/\.md$/, '') : projectFileName?.replace(/\.md$/, '')) || "";
  const filePathFormatted = fileName ? folderPath + fileName + ".md" : "undefined";

  return { folderPath, fileName, filePathFormatted }
}