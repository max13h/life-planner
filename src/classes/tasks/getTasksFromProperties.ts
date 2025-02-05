import { AppWithPlugin, TaskFilterProperties } from "types";
import Task from "../task/task";
import { Tasks } from "./tasks";

export const getTasksFromProperties = async (app: AppWithPlugin, properties: TaskFilterProperties): Promise<Task[]> => {
  const tasks = await Tasks.getTasks(app);

  return tasks.filter(task => {
    return Object.entries(properties).every(([key, value]) => {
      const taskValue = task[key as keyof Task];
      // console.log("taskValue", taskValue);
      // console.log("value", value);
      // console.log("========");

      if (key === 'tags' && Array.isArray(value)) {
        return JSON.stringify(task.tags) === JSON.stringify(value);
      }

      return taskValue === value;
    });
  });
}