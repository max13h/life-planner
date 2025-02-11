import { moment } from "obsidian";
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
  tasks.forEach(task => {
    if (!task.start || !task.end) return

    createShortTaskComponent({
      app, 
      container: tasksColumn, 
      task,
      refreshView: refreshView,
      style: `
        position: absolute;
        left: 0;
        right: 0;
        top: ${defineTopFromStart(task.start)}px;
        height: ${defineHeightFromTime(task.start, task.end)}px;
        border: 1px solid gray;
        margin-left: 4px;
        margin-right: 4px;
      `
    })
  })
}

const defineTopFromStart = (start: string): number => {
  const time = moment(start, "HH:mm", true);

  if (!time.isValid()) {
    throw new Error(`Heure invalide : ${start}`);
  }

  const minutesSinceMidnight = time.hours() * 60 + time.minutes();
  return minutesSinceMidnight * 0.5;
};

const defineHeightFromTime = (start: string, end: string): number => {
  const startTime = moment(start, "HH:mm", true);
  const endTime = moment(end, "HH:mm", true);

  if (!startTime.isValid() || !endTime.isValid()) {
    throw new Error(`Heure invalide : start=${start}, end=${end}`);
  }

  const startMinutes = startTime.hours() * 60 + startTime.minutes();
  const endMinutes = endTime.hours() * 60 + endTime.minutes();

  if (endMinutes < startMinutes) {
    throw new Error(`end (${end}) ne peut pas être avant start (${start})`);
  }

  return (endMinutes - startMinutes) * 0.5;
};
