import { Setting, TFile, TFolder } from "obsidian";
import { addAutocompleteSelect } from "src/ui/components/autoCompleteSelect/autocompleteSelect";
import LifePlanner from "main";

interface RenderProjectsSettingProps {
  container: HTMLElement;
  folders: TFolder[]; 
  tags: string[];
  files: TFile[];
  plugin: LifePlanner;
}

export const renderProjectsSettings = ({container, folders, files, tags, plugin}: RenderProjectsSettingProps) => {
  container.createEl("h2", { text: "Projects settings:" })
  renderProjectsFolderSetting({container, folders, plugin})
  renderProjectsTagsSetting({container, tags, plugin})
  renderProjectsTemplatePathSetting({container, files, plugin})
}


const renderProjectsFolderSetting = ({container, folders, plugin}: Omit<RenderProjectsSettingProps, 'tags' | 'files'>) => {
  const projectFolder = new Setting(container)
    .setName('Project Folder')
    .setDesc("Set name of the project folder")
  addAutocompleteSelect(projectFolder.controlEl, {
    suggestions: {
      displayedValues: folders.map(el => el.path),
      usedValues: folders.map(el => el.path)
    },
    onSelected: async (value) => {
      plugin.settings.projects.folder = value;
      await plugin.saveSettings();
    },
    dropdownStyle: true,
    style: "width: auto;",
    value: plugin.settings.projects.folder,
    allow: "newEntry",
  }) 
}

const renderProjectsTagsSetting = ({container, tags, plugin}: Omit<RenderProjectsSettingProps, 'folders' | 'files'>) => {
  const projectsTag = new Setting(container)
    .setName('Projects tag')
    .setDesc("Set the tag that will identify a project in vault")
  addAutocompleteSelect(projectsTag.controlEl, {
    suggestions: {
      displayedValues: tags,
      usedValues: tags
    },
    onSelected: async (value) => {
      plugin.settings.projects.tag = value;
      await plugin.saveSettings();
    },
    dropdownStyle: true,
    style: "width: auto;",
    value: plugin.settings.projects.tag,
    allow: "newEntry",
  })
}

const renderProjectsTemplatePathSetting = ({container, files, plugin}: Omit<RenderProjectsSettingProps, 'tags' | 'folders'>) => {
  const projectsTemplatePath = new Setting(container)
    .setName('Project Template Path')
    .setDesc("Set path of the project template")
  addAutocompleteSelect(projectsTemplatePath.controlEl, {
    suggestions: {
      displayedValues: files.map(el => el.path),
      usedValues: files.map(el => el.path)
    },
    onSelected: async (value) => {
      plugin.settings.projects.templatePath = value;
      await plugin.saveSettings();
    },
    dropdownStyle: true,
    style: "width: auto;",
    value: plugin.settings.projects.templatePath,
    allow: "newEntry",
  })
}