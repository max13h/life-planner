import { AppWithPlugin, TaskFilterProperties } from "types";
import Task from "../task/task";
import { Tasks } from "./tasks";

export const getTasksFromProperties = async (app: AppWithPlugin, properties: TaskFilterProperties): Promise<Task[]> => {
  const tasks = await Tasks.getTasks(app);

  return tasks.filter(task => {
    return Object.entries(properties).every(([key, filterValue]) => {
      const taskValue = task[key as keyof Task];
      
      // Handle array values in filter
      if (Array.isArray(filterValue)) {
        // For tags property, check if arrays match exactly
        if (key === 'tags') {
          return JSON.stringify(task.tags) === JSON.stringify(filterValue);
        }
        // For other properties, check if task value is in the array
        return filterValue.includes(taskValue as string);
      }

      // Handle non-array values (direct comparison)
      return taskValue === filterValue;
    });
  });
};