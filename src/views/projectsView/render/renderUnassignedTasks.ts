import { createTaskComponent } from "src/ui/components/task";
import { Tasks } from "src/classes/tasks/tasks";
import { AppWithPlugin } from "types";

export async function renderUnassignedTasks(app: AppWithPlugin, container: HTMLElement, refreshView: () => Promise<void>) {
  const unassignedTasks = await Tasks.getTasksFromProperties(app, { projectLink: undefined });

  const taskWrapper = container.createDiv({
    attr: {
      style: `
        display: flex;
        flex-direction: column;
        gap: 4rem;
      `
    }
  })
  unassignedTasks.forEach(task => {
    createTaskComponent(task.app, taskWrapper, task, { refreshView });
  })
}