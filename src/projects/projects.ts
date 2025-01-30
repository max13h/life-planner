import { App, TFile } from "obsidian";
import { AppWithPlugin } from "types";

export class Projects {
  private app: App

  constructor (app: App) {
    this.app = app
  }

  static async getAllFiles(app: AppWithPlugin): Promise<TFile[]> {
    const files = app.vault.getMarkdownFiles();
    const settings = app.plugins.plugins["life-planner"].settings;
    const projectTag = settings.projectsTag.replace(/^#/, '');

    const projectFiles: TFile[] = []

    for (const file of files) {
      await app.fileManager.processFrontMatter(file, (fm) => {
        if (fm.tags && fm.tags.length && fm.tags.includes(projectTag)) projectFiles.push(file)
      })
    }

    return projectFiles
  }
}