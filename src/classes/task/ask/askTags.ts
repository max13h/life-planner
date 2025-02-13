import { NavigationModal } from "src/ui/modals/navigationModal";
import Task from "../task";
import { setIcon } from "obsidian";
import { listenClick } from "src/ui/html";
import { addAutocompleteSelect } from "src/ui/components/suggester";
import { getAllTagsInVault } from "src/utils/vault";

export async function askTags(modal: NavigationModal, task: Task) {
  return async (contentEl: typeof modal.contentEl) => {
    modal.setTitle("Set tags")
    
    const tagsToDisplay = [...task.tags]
    modal.pressDone = () => modal.complete(tagsToDisplay)

    const container = contentEl.createDiv({ cls: "ask-tag" })

    const tagsInVault = getAllTagsInVault(task.app)

    const input = addAutocompleteSelect(container, {
      focus: true,
      placeholder: "Start with #",
      dropdownStyle: true,
      suggestions: {
        displayedValues: tagsInVault,
        usedValues: tagsInVault,
      },
      onSelected: (usedValue) => {
        if(/^#[^\s]*[^/]$/.test(usedValue)) {
          tagsToDisplay.push(usedValue)
          task.tags.push(usedValue)
          input.input.value = ""
          refreshTagsToUI(tagsContainer, tagsToDisplay)
        }
      }
    })

    const tagsContainer = container.createDiv({ cls: "tags-container" })
    refreshTagsToUI(tagsContainer, tagsToDisplay)
  }
}

const refreshTagsToUI = (container: HTMLElement, tagsToDisplay: string[]) => {
  container.empty()

  if (!tagsToDisplay.length) {
    container.createSpan({ text: "No task", cls: "no-task"});
    return;
  }

  tagsToDisplay.forEach((tag, index) => {
    const tagWrapper = container.createDiv({ cls: "tag-wrapper" });

    tagWrapper.createSpan({ text: tag });
    const buttonDelete = tagWrapper.createSpan({ cls: "button-delete" });
    setIcon(buttonDelete, "x");
    listenClick(buttonDelete, () => {
      tagsToDisplay.splice(index, 1);
      refreshTagsToUI(container, tagsToDisplay);
    });
  });
}