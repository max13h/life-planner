import LifePlanner from "main";
import { TFolder, TFile, Setting } from "obsidian";
import { addAutocompleteSelect } from "src/ui/components/suggester";

interface RenderTasksSettingsProps {
  container: HTMLElement;
  folders: TFolder[]; 
  plugin: LifePlanner;
}

export const renderTasksSettings = ({container, folders, plugin}: RenderTasksSettingsProps) => {
  container.createEl("h2", { text: "Tasks settings:" })
  renderTasksFolderSetting({container, folders, plugin})
  renderTasksFileSetting({container, plugin})
}

const renderTasksFolderSetting = ({container, folders, plugin}: Omit<RenderTasksSettingsProps, 'tags' | 'files'>) => {
  const taskFolder = new Setting(container)
    .setName('Tasks Folder')
    .setDesc("Set name of the tasks folder")
  addAutocompleteSelect(taskFolder.controlEl, {
    suggestions: {
      displayedValues: folders.map(el => el.path),
      usedValues: folders.map(el => el.path)
    },
    onSelected: async (value) => {
      plugin.settings.tasks.folder = value;
      await plugin.saveSettings();
    },
    dropdownStyle: true,
    style: "width: auto;",
    value: plugin.settings.tasks.folder,
    allowNewEntry: true
  })
}
const renderTasksFileSetting = ({container, plugin}: Omit<RenderTasksSettingsProps, 'folders'>) => {
  new Setting(container)
    .setName('Tasks File')
    .setDesc("Set name of the tasks file")
    .addText((text) =>
      text
        .setPlaceholder(plugin.settings.binFolder + '/TASKS-' + new Date().getFullYear)
        .setValue(plugin.settings.tasks.file)
        .onChange(async (value) => {
          plugin.settings.tasks.file = value;
          await plugin.saveSettings();
        })
    );
}