import { AppWithPlugin, TaskFilterProperties } from "types";
import Task from "../task/task";
import { Tasks } from "./tasks";

export const getTasksFromProperties = async (
  app: AppWithPlugin, 
  properties: TaskFilterProperties
): Promise<Task[]> => {
  const tasks = await Tasks.getTasks(app);

  return tasks.filter(task => {
    return Object.entries(properties).every(([key, filterValue]) => {
      const taskValue = task[key as keyof Task];
      
      // Handle FilterOperator objects
      if (filterValue && typeof filterValue === 'object' && 'type' in filterValue) {
        switch (filterValue.type) {
          case 'regex':
            if (!filterValue.pattern) return false;
            return new RegExp(filterValue.pattern).test(String(taskValue));
          
          case 'exists':
            return taskValue !== undefined && taskValue !== null;
          
          case 'notExists':
            return taskValue === undefined || taskValue === null;
          
          case 'equals':
            return taskValue === filterValue.value;
        }
      }

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