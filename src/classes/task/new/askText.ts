import { NavigationModal } from "src/ui/modals/navigationModal";
import Task from "..";
import { addInputComponent } from "src/ui/components/input";

export async function askText(modal: NavigationModal, task: Task, isLast: boolean = false) {
  return (contentEl: typeof modal.contentEl) => {
    modal.setTitle("Insert content of the new task");

    addInputComponent(contentEl, {
      focus: true,
      onKeyUp: async (input) => {
        task.text = input.value;
      },
      onEnter: async () => {
        if (!task.text) return;
        
        if (isLast) {
          modal.pressDone()  
        } else {
          await modal.pressNext()
        }
      },
      value: task.text,
    });
  };
}