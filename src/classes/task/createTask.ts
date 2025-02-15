import { App } from "obsidian";
import { NavigationModal } from "src/ui/modals/navigationModal";
import { AppWithPlugin } from "types";
import Task from "./task";
import { askText } from "../utils/ask/task/askText";
import { askEnd } from "../utils/ask/task/askEnd";
import { askProject } from "../utils/ask/task/askProject";
import { askSchedule } from "../utils/ask/task/askSchedule";
import { askStart } from "../utils/ask/task/askStart";


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

