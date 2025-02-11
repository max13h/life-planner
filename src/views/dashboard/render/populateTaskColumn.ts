import Task from "src/classes/task/task";
import { createShortTaskComponent } from "src/ui/components/task/short";
import { AppWithPlugin } from "types";

type PopulateTaskColumnOptions = {
  app: AppWithPlugin
  tasksColumn: HTMLDivElement;
  tasks: Task[];
  refreshView: (() => Promise<void>)
}

export const populateTaskColumn = ({ app, tasksColumn, tasks, refreshView }: PopulateTaskColumnOptions) => {
  // tasks.forEach(task => {
  //   createShortTaskComponent({
  //     app, 
  //     container: tasksColumn, 
  //     task,
  //     refreshView: refreshView 
  //   })
  // })
}