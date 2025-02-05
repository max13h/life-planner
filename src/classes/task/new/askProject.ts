import { NavigationModal } from "src/ui/modals/navigationModal";
import Task from "../task";
import { Projects } from "src/classes/projects/projects";
import { AppWithPlugin } from "types";
import { addAutocompleteSelect } from "src/ui/components/suggester";

export async function askProject(modal: NavigationModal, task: Task, isLast: boolean = false) {
  return async (contentEl: typeof modal.contentEl) => {
    modal.setTitle("Choose project related the new task");

    const projectFiles = await Projects.getAllFiles(task.app as AppWithPlugin)

    addAutocompleteSelect(contentEl, {
      focus: true,
      suggestions: {
        displayedValues: projectFiles.map(file => file.basename),
        usedValues: projectFiles.map(file => file.path)
      },
      onSelected: async (selected) => {
        task.setProjectLink(selected)

        if (isLast) {
          modal.pressDone()  
        } else {
          await modal.pressNext()
        }
      }
    })
  }
}