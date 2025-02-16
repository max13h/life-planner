import { NavigationModal } from "src/ui/modals/navigationModal";
import { addAutocompleteSelect } from "src/ui/components/autoCompleteSelect/autocompleteSelect";
import Task from "src/classes/task/task";
import { TaskPriorities } from "types";

export async function askPriority(modal: NavigationModal, task: Task, isLast: boolean = false) {
  return async (contentEl: typeof modal.contentEl) => {
    modal.setTitle("Choose priority");
  
    const priorities: Exclude<TaskPriorities, undefined>[] = ["high", "low"]
  
    addAutocompleteSelect(contentEl, {
      focus: true,
      allow: "undefined",
      suggestions: {
        displayedValues: [...priorities],
        usedValues: [...priorities],
      },
      onSelected: async (usedValue: TaskPriorities) => {
        task.update({ priority: usedValue })
        if (isLast) {
          modal.pressDone()  
        } else {
          await modal.pressNext()
        }
      }
    })
  }
}