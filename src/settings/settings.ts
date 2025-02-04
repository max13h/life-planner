import LifePlanner from 'main';
import { App, getAllTags, PluginSettingTab, Setting } from 'obsidian';
import { addAutocompleteSelect } from 'src/ui/components/suggester';
import { getAllTagsInVault } from 'src/utils/vault';
import { TimeType } from 'types';

export interface LifePlannerSettings {
  binFolder: string;
  dateFormat: string
  timeTypesList: TimeType[];
  projectsFolder: string;
  projectsTag: string;
  projectsTemplatePath: string;
  tasksFolder: string;
  tasksFile: string;
  recurringTasksFile: string;
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
  tasksFolder: "_bin",
  tasksFile: "TASKS-" + new Date().getFullYear(),
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

    new Setting(containerEl)
      .setName('Time Types List')
      .setDesc("Here is the time type list")
    containerEl.createDiv({ attr: { style: "white-space: pre-line; margin-bottom: 8px" }, text: JSON.stringify(this.plugin.settings.timeTypesList).slice(1, -1).split("},{").join("},\n{").replace(/"/g, " ") });

    const binFolder = new Setting(containerEl)
      .setName('Bin Folder')
      .setDesc("Set name of the bin folder")
    addAutocompleteSelect(binFolder.controlEl, {
      suggestions: {
        displayedValues: folders.map(el => el.path),
        usedValues: folders.map(el => el.path)
      },
      onSelected: async (value) => {
        this.plugin.settings.binFolder = value;
        await this.plugin.saveSettings();
      },
      dropdownStyle: true,
      style: "width: auto;",
      value: this.plugin.settings.binFolder
    })

    const projectFolder = new Setting(containerEl)
      .setName('Project Folder')
      .setDesc("Set name of the project folder")
    addAutocompleteSelect(projectFolder.controlEl, {
      suggestions: {
        displayedValues: folders.map(el => el.path),
        usedValues: folders.map(el => el.path)
      },
      onSelected: async (value) => {
        this.plugin.settings.projectsFolder = value;
        await this.plugin.saveSettings();
      },
      dropdownStyle: true,
      style: "width: auto;",
      value: this.plugin.settings.projectsFolder
    })  

    const projectsTemplatePath = new Setting(containerEl)
      .setName('Project Template Path')
      .setDesc("Set path of the project template")
    addAutocompleteSelect(projectsTemplatePath.controlEl, {
      suggestions: {
        displayedValues: files.map(el => el.path),
        usedValues: files.map(el => el.path)
      },
      onSelected: async (value) => {
        this.plugin.settings.projectsTemplatePath = value;
        await this.plugin.saveSettings();
      },
      dropdownStyle: true,
      style: "width: auto;",
      value: this.plugin.settings.projectsTemplatePath
    })
    
    const projectsTag = new Setting(containerEl)
      .setName('Projects tag')
      .setDesc("Set the tag that will identify a project in vault")
    addAutocompleteSelect(projectsTag.controlEl, {
      suggestions: {
        displayedValues: tags,
        usedValues: tags
      },
      onSelected: async (value) => {
        this.plugin.settings.projectsTag = value;
        await this.plugin.saveSettings();
      },
      dropdownStyle: true,
      style: "width: auto;",
      value: this.plugin.settings.projectsTag
    })

    const taskFolder = new Setting(containerEl)
      .setName('Tasks Folder')
      .setDesc("Set name of the tasks folder")
    addAutocompleteSelect(taskFolder.controlEl, {
      suggestions: {
        displayedValues: folders.map(el => el.path),
        usedValues: folders.map(el => el.path)
      },
      onSelected: async (value) => {
        this.plugin.settings.tasksFolder = value;
        await this.plugin.saveSettings();
      },
      dropdownStyle: true,
      style: "width: auto;",
      value: this.plugin.settings.tasksFolder
    })

    const taskFile = new Setting(containerEl)
      .setName('Tasks File')
      .setDesc("Set name of the tasks file")
      .addText((text) =>
        text
          .setPlaceholder(this.plugin.settings.binFolder + '/TASKS-' + new Date().getFullYear)
          .setValue(this.plugin.settings.tasksFile)
          .onChange(async (value) => {
            this.plugin.settings.tasksFile = value;
            await this.plugin.saveSettings();
          })
      );
  }
}