import LifePlanner from 'main';
import { App, PluginSettingTab } from 'obsidian';
import { getAllTagsInVault } from 'src/utils/vault';
import { renderBinFolderSetting } from './render/binFolderSettings';
import { renderProjectsSettings } from './render/projectsSettings';
import { renderTasksSettings } from './render/tasksSettings';

export interface LifePlannerSettings {
  binFolder: string;
  dateFormat: string;
  projects: {
    folder: string;
    tag: string;
    templatePath: string;
  };
  tasks: {
    folder: string;
    file: string;
  }
  recurringTasksFile: string;
}

export const DEFAULT_SETTINGS: LifePlannerSettings = {
  binFolder: "",
  dateFormat: "YYYY-MM-DD",
  projects: {
    folder: "",
    tag: "#project/in-progress",
    templatePath: ""
  },
  tasks: {
    folder: "",
    file: "TASKS-" + new Date().getFullYear()
  },
  recurringTasksFile: "RECURRING-TASKS-" + new Date().getFullYear()
}


export class LifePlannerSettingTab extends PluginSettingTab {
  plugin: LifePlanner;

  constructor(app: App, plugin: LifePlanner) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;
    const folders = this.app.vault.getAllFolders()
    const files = this.app.vault.getFiles()
    const tags = getAllTagsInVault(this.app, files)

    containerEl.empty();

    renderBinFolderSetting({ 
      container: containerEl, 
      folders, 
      plugin: this.plugin 
    })
    renderProjectsSettings({ 
      container: containerEl, 
      plugin: this.plugin,
      folders, 
      files,
      tags 
    })
    renderTasksSettings({ 
      container: containerEl, 
      plugin: this.plugin,
      folders
    })
  }
}