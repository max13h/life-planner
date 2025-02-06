import { NavigationModal } from "src/ui/modals/navigationModal";
import Task from "../task";
import { addInputComponent } from "src/ui/components/input";

export async function askText(modal: NavigationModal, task: Task, isLast: boolean = false) {
  return (contentEl: typeof modal.contentEl) => {
    modal.setTitle("Insert content of the new task");
    let newTaskText: string;

    addInputComponent(contentEl, {
      value: task.text,
      focus: true,
      onKeyUp: async (input) => {
        newTaskText = input.value
      },
      onEnter: async () => {
        task.update({ text: newTaskText })
        if (!task.text) return;
        
        if (isLast) {
          modal.pressDone()  
        } else {
          await modal.pressNext()
        }
      },
    });
  };
}