import { NavigationModal } from "src/ui/modals/navigationModal";
import { addInputComponent } from "src/ui/components/input";
import { RecurringTask } from "src/classes/recurringTask/recurringTask";
import Task from "src/classes/task/task";

export async function askText(modal: NavigationModal, task: Task | RecurringTask, isLast: boolean = false) {
  return (contentEl: typeof modal.contentEl) => {
    modal.setTitle("Insert content of the new task");

    const handleEnter = async () => {
      if (!task.text) return;

      if (isLast) {
        modal.pressDone();
      } else {
        await modal.pressNext();
      }
    };

    addInputComponent(contentEl, {
      value: task.text,
      focus: true,
      onKeyUp: async (input) => {
        task.update({ text: input.value })
      },
      onEnter: handleEnter,
    });
  };
}