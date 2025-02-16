import { Setting, TFolder } from "obsidian";
import { addAutocompleteSelect } from "src/ui/components/autoCompleteSelect/autocompleteSelect";
import LifePlanner from "main";

type renderBinFolderSettingProps = {
  container: HTMLElement;
  folders: TFolder[];
  plugin: LifePlanner;
}

export const renderBinFolderSetting = ({container, folders, plugin}: renderBinFolderSettingProps) => {
  const binFolder = new Setting(container)
    .setName('Bin Folder')
    .setDesc("Set name of the bin folder")
  addAutocompleteSelect(binFolder.controlEl, {
    dropdownStyle: true,
    style: "width: auto;",
    value: plugin.settings.binFolder,
    allow: "newEntry",
    suggestions: {
      displayedValues: folders.map(el => el.path),
      usedValues: folders.map(el => el.path),
    },
    onSelected: async (value) => {
      plugin.settings.binFolder = value;
      await plugin.saveSettings();
    }
  })
}