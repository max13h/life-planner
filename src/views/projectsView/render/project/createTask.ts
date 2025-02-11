import { Tasks } from "src/classes/tasks/tasks";
import { createFullTaskComponent } from "src/ui/components/task/full";
import { AppWithPlugin } from "types";

export const createTasks = async ({ app, projectLink, projectContainer, refreshView }: { app: AppWithPlugin, projectLink: string, projectContainer: HTMLElement, refreshView: (() => Promise<void>) }) => {
  const tasksNotDone = await Tasks.getTasksFromProperties(app, { projectLink: `[[${projectLink}]]` });

  tasksNotDone.forEach(task => {
    createFullTaskComponent({
      app,
      container: projectContainer, 
      task, 
      refreshView
    });
  });
}