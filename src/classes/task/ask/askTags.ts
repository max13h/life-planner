import { NavigationModal } from "src/ui/modals/navigationModal";
import Task from "../task";
import { addInputComponent } from "src/ui/components/input";
import { setIcon } from "obsidian";
import { listenClick } from "src/ui/html";
import { addAutocompleteSelect } from "src/ui/components/suggester";
import { getAllTagsInVault } from "src/utils/vault";

export async function askTags(modal: NavigationModal, task: Task) {
  return async (contentEl: typeof modal.contentEl) => {
    modal.setTitle("Set tags")
    
    const tagsToDisplay = [...task.tags]
    modal.pressDone = () => modal.complete(tagsToDisplay)

    const container = contentEl.createDiv({
      attr: {
        style: `
          display: flex;
          flex-direction: column;
          gap: 1rem;
        `
      }
    })

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

    const tagsContainer = container.createDiv({
      attr: {
        style: `
          display: flex;
          align-items: center;
          gap: 4px;
        `
      }
    })
    refreshTagsToUI(tagsContainer, tagsToDisplay)
  }
}

const refreshTagsToUI = (container: HTMLElement, tagsToDisplay: string[]) => {
  container.empty()

  if (!tagsToDisplay.length) {
    container.createSpan({ text: "No task", attr: { style: `
      font-size: var(--font-smallest);
    ` } });

    return;
  }

  tagsToDisplay.forEach((tag, index) => {
    const tagWrapper = container.createDiv({
      attr: {
        style: `
          display: flex;
          align-items: center;
          gap: 2px;
          font-size: var(--font-smallest);
          border: 1px solid hsla(var(--accent-h) var(--accent-s) var(--accent-l) / 0.3);
          padding: 2px 8px 2px 8px;
          border-radius: var(--radius-m);
        `
      }
    });

    tagWrapper.createSpan({ text: tag });
    const buttonDelete = tagWrapper.createSpan({ attr: { style: `
      display: flex; 
      justify-content: center; 
      align-items: center;
    ` } });
    setIcon(buttonDelete, "x");
    listenClick(buttonDelete, () => {
      tagsToDisplay.splice(index, 1); // Remove the tag from tagsToDisplay
      refreshTagsToUI(container, tagsToDisplay); // Refresh the UI to reflect the change
    });
  });
}