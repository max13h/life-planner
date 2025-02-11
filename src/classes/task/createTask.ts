import { App } from "obsidian";
import { NavigationModal } from "src/ui/modals/navigationModal";
import { AppWithPlugin } from "types";
import Task from "./task";
import { askEnd } from "./ask/askEnd";
import { askProject } from "./ask/askProject";
import { askSchedule } from "./ask/askSchedule";
import { askStart } from "./ask/askStart";
import { askText } from "./ask/askText";

export async function createTask(app: App) {
  const task = new Task(app as AppWithPlugin)
  const modal = new NavigationModal(app)

  modal.pages = [
    await askText(modal, task),
    await askProject(modal, task),
    await askSchedule(modal, task),
    await askStart(modal, task),
    await askEnd(modal, task, true)
  ]

  await modal.open()
  await task.insertTaskInFile()
}

