import { Tasks } from "src/classes/tasks/tasks";
import { AppWithPlugin } from "types";
import { createShortTaskComponent } from "src/ui/components/task/short";

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
    createShortTaskComponent({
      app: task.app,
      container: taskWrapper, 
      task, 
      refreshView
    });
  })
}