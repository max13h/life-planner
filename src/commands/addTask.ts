import { App, Modal } from "obsidian"
import { NavigationModal } from "src/modals/navigationModal";
import { AppWithPlugin, Task } from "src/tasks/task/task";

export const addTask = async (app: App) => {
  const task = await Task.new(app)
  console.log("Task result from COMMAND ADD TASK", task);
}