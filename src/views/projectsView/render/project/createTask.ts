import { Tasks } from "src/classes/tasks/tasks";
import { createTaskComponent } from "src/ui/components/task";
import { AppWithPlugin } from "types";

export const createTasks = async ({ app, projectLink, projectContainer }: { app: AppWithPlugin, projectLink: string, projectContainer: HTMLElement }) => {
  const tasksNotDone = await Tasks.getTasksFromProperties(app, { projectLink: `[[${projectLink}]]` });

  tasksNotDone.forEach(task => {
    createTaskComponent(projectContainer, task, { onStatusChange: () => console.log("click on status") });
  });
}