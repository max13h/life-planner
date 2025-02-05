import { App } from "obsidian";
import { NavigationModal } from "src/ui/modals/navigationModal";
import { AppWithPlugin } from "types";
import Task from "..";
import { askText } from "./askText";
import { askProject } from "./askProject";
import { askDate } from "./askDate";
import { askStart } from "./askStart";
import { askEnd } from "./askEnd";

export async function createTask(app: App) {
  const task = new Task(app as AppWithPlugin)
  const modal = new NavigationModal(app)

  modal.pages = [
    await askText(modal, task),
    await askProject(modal, task),
    await askDate(modal, task),
    await askStart(modal, task),
    await askEnd(modal, task, true)
  ]

  await modal.open()
  await task.insertTaskInFile()
}

