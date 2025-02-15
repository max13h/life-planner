import { NavigationModal } from "src/ui/modals/navigationModal";
import { Projects } from "src/classes/projects/projects";
import { AppWithPlugin } from "types";
import { addAutocompleteSelect } from "src/ui/components/suggester";
import { RecurringTask } from "src/classes/recurringTask/recurringTask";
import Task from "src/classes/task/task";

export async function askProject(modal: NavigationModal, task: Task | RecurringTask, isLast: boolean = false) {
  return async (contentEl: typeof modal.contentEl) => {
    modal.setTitle("Choose project related to the new task");

    const projectFiles = await Projects.getFiles(task.app as AppWithPlugin);

    const handleSelection = async (selected: string) => {
      task.update({ projectLink: selected });

      if (isLast) {
        modal.pressDone();  
      } else {
        await modal.pressNext();
      }
    };

    addAutocompleteSelect(contentEl, {
      focus: true,
      suggestions: {
        displayedValues: projectFiles.map(file => file.basename),
        usedValues: projectFiles.map(file => file.path)
      },
      onSelected: handleSelection
    });
  }
}