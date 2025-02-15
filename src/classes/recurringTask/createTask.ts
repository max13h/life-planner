import { App } from "obsidian";
import { NavigationModal } from "src/ui/modals/navigationModal";
import { AppWithPlugin } from "types";
import { RecurringTask } from "./recurringTask";
import { askProject } from "../utils/ask/task/askProject";
import { askText } from "../utils/ask/task/askText";

export async function createRecurringTask(app: App) {
  const recurringTask = new RecurringTask(app as AppWithPlugin)
  const modal = new NavigationModal(app)

  modal.pages = [
    await askText(modal, recurringTask),
    await askProject(modal, recurringTask, true),
  ]

  await modal.open()
  await recurringTask.insertRecurringTaskInFile()
}

