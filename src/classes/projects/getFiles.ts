import { TFile } from "obsidian";
import { AppWithPlugin } from "types";

export const getFiles = async (app: AppWithPlugin): Promise<TFile[]> => {
  const files = app.vault.getMarkdownFiles();
  const settings = app.plugins.plugins["life-planner"].settings;
  const projectTag = settings.projectsTag.replace(/^#/, '');

  const projectFiles: TFile[] = []

  for (const file of files) {
    await app.fileManager.processFrontMatter(file, (fm) => {
      if (fm.tags && fm.tags.length && fm.tags.includes(projectTag)) projectFiles.push(file)
    })
  }

  return projectFiles.sort((a, b) => a.name.localeCompare(b.name));
}