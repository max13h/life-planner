import { NavigationModal } from "src/ui/modals/navigationModal";
import { addAutocompleteSelect } from "src/ui/components/autoCompleteSelect/autocompleteSelect";
import Task from "src/classes/task/task";

export async function askPriority(modal: NavigationModal, task: Task, isLast: boolean = false) {
  return async (contentEl: typeof modal.contentEl) => {
    modal.setTitle("Choose start time");
  
    const priorities = ["high", "low"]
  
    addAutocompleteSelect(contentEl, {
      focus: true,
      suggestions: {
        displayedValues: priorities,
        usedValues: priorities
      },
      onSelected: async (usedValue) => {
        if (typeof usedValue === 'function') {
          task.update({ start: await usedValue() || undefined })
        } else {
          task.update({ start: usedValue })
        }
        
        if (isLast) {
          modal.pressDone()  
        } else {
          await modal.pressNext()
        }
      }
    })
  }
}