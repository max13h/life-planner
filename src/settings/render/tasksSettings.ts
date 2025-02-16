import LifePlanner from "main";
import { TFolder, Setting } from "obsidian";
import { addAutocompleteSelect } from "src/ui/components/autoCompleteSelect/autocompleteSelect";

interface RenderTasksSettingsProps {
  container: HTMLElement;
  folders: TFolder[]; 
  plugin: LifePlanner;
}

export const renderTasksSettings = ({container, folders, plugin}: RenderTasksSettingsProps) => {
  container.createEl("h2", { text: "Tasks settings:" })
  renderTasksFolderSetting({container, folders, plugin})
  renderTasksFileSetting({container, plugin})
  renderRecurringTasksFileSetting({container, plugin})
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
    allow: "newEntry",
  })
}
const renderTasksFileSetting = ({container, plugin}: Omit<RenderTasksSettingsProps, 'folders'>) => {
  new Setting(container)
    .setName('Tasks File')
    .setDesc("Set name of the tasks file")
    .addText((text) =>
      text
        .setValue(plugin.settings.tasks.file)
        .onChange(async (value) => {
          plugin.settings.tasks.file = value;
          await plugin.saveSettings();
        })
      )
      .then((el) => {
        const input = el.settingEl.querySelector('input')
        if (input) input.style.width = "auto"
      })
}
const renderRecurringTasksFileSetting = ({container, plugin}: Omit<RenderTasksSettingsProps, 'folders'>) => {
  new Setting(container)
    .setName('Recurring Tasks File')
    .setDesc("Set name of the recurring tasks file (it will use the same folder as the normal task file)")
    .addText((text) =>
      text
        .setValue(plugin.settings.tasks.recurringTasksFile)
        .onChange(async (value) => {
          plugin.settings.tasks.recurringTasksFile = value;
          await plugin.saveSettings();
        })
    )
    .then((el) => {
      const input = el.settingEl.querySelector('input')
      if (input) input.style.width = "auto"
    })
}