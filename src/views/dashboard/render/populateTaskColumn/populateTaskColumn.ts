import Task from "src/classes/task/task";
import { LifePlannerSettings } from "src/settings/settings";
import { createShortTaskComponent } from "src/ui/components/task/short";
import { AppWithPlugin } from "types";
import { calculateTaskPositions } from "./calculateTaskPositions";

type PopulateTaskColumnOptions = {
  app: AppWithPlugin
  tasksColumn: HTMLDivElement;
  tasks: Task[];
  refreshView: (() => Promise<void>);
  dashboardSettings: LifePlannerSettings["dashboard"]
}

export const populateTaskColumn = ({ app, tasksColumn, tasks, refreshView, dashboardSettings }: PopulateTaskColumnOptions) => {
  const { startingHour, endingHour, numberOfPixelForOneMinute } = dashboardSettings

  const positionedTasks = calculateTaskPositions({ 
    tasks,
    startingHour,
    endingHour,
    numberOfPixelForOneMinute
  })

  positionedTasks.forEach(positionedTask => {
    createShortTaskComponent({
      app, 
      container: tasksColumn, 
      task: positionedTask.task,
      refreshView: refreshView,
      style: `
        left: ${positionedTask.left}%;
        right: ${positionedTask.right}%;
        top: ${positionedTask.top}px;
        height: ${positionedTask.height}px;
        margin-left: ${positionedTask.left === 0 ? "4px" : "2px"};
        margin-right: ${positionedTask.right === 0 ? "4px" : "2px"};
      `
    })
  })
}

