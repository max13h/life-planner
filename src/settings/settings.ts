import LifePlanner from 'main';
import { App, PluginSettingTab, Setting } from 'obsidian';

export interface TimeType {
  name: string;
  tag: string;
}

export interface LifePlannerSettings {
  binFolder: string;
  dateFormat: string
  timeTypesList: TimeType[];
  projectsFolder: string;
  projectsTag: string;
  projectsTemplatePath: string;
  tasksFolder: string;
  taskFile: string
}

export const DEFAULT_SETTINGS: LifePlannerSettings = {
  binFolder: "_bin",
  dateFormat: "YYYY-MM-DD",
	timeTypesList: [
    {name: "obligatoire", tag: "#temps/obligatoire"},
    {name: "professionnel", tag: "#temps/professionnel"},
    {name: "personnel", tag: "#temps/personnel"},
    {name: "pour-moi", tag: "#temps/pour-moi"},
  ],
  projectsFolder: "_bin/projects",
  projectsTag: "#projet/en-cours",
  projectsTemplatePath: "",
  tasksFolder: "daily/YYYY/MM/WW",
  taskFile: "tasks-WW",
}


export class LifePlannerSettingTab extends PluginSettingTab {
  plugin: LifePlanner;

  constructor(app: App, plugin: LifePlanner) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName('Time Types List')
      .setDesc("Here is the time type list")
    containerEl.createDiv({ text: JSON.stringify(this.plugin.settings.timeTypesList)})

    new Setting(containerEl)
      .setName('Bin Folder')
      .setDesc("Set name of the bin folder")
      .addText((text) =>
        text
          .setPlaceholder('_bin')
          .setValue(this.plugin.settings.binFolder)
          .onChange(async (value) => {
            this.plugin.settings.binFolder = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName('Project Folder')
      .setDesc("Set name of the project folder")
      .addText((text) =>
        text
          .setPlaceholder('_bin')
          .setValue(this.plugin.settings.projectsFolder)
          .onChange(async (value) => {
            this.plugin.settings.projectsFolder = value;
            await this.plugin.saveSettings();
          })
      );
    new Setting(containerEl)
      .setName('Project Template Path')
      .setDesc("Set path of the project template")
      .addText((text) =>
        text
          .setPlaceholder('_bin')
          .setValue(this.plugin.settings.projectsTemplatePath)
          .onChange(async (value) => {
            this.plugin.settings.projectsTemplatePath = value;
            await this.plugin.saveSettings();
          })
      );
    new Setting(containerEl)
      .setName('Tasks Folder')
      .setDesc("Set name of the tasks folder")
      .addText((text) =>
        text
          .setPlaceholder('_bin')
          .setValue(this.plugin.settings.tasksFolder)
          .onChange(async (value) => {
            this.plugin.settings.tasksFolder = value;
            await this.plugin.saveSettings();
          })
      );
    new Setting(containerEl)
      .setName('Tasks File')
      .setDesc("Set name of the tasks file")
      .addText((text) =>
        text
          .setPlaceholder('_bin')
          .setValue(this.plugin.settings.taskFile)
          .onChange(async (value) => {
            this.plugin.settings.taskFile = value;
            await this.plugin.saveSettings();
          })
      );
  }
}