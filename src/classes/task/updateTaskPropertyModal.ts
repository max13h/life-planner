import { NavigationModal } from "src/ui/modals/navigationModal"
import { App, Notice } from "obsidian"
import Task from "./task";
import { askText } from "../utils/ask/task/askText";
import { askSchedule } from "../utils/ask/task/askSchedule";
import { askStart } from "../utils/ask/task/askStart";
import { askEnd } from "../utils/ask/task/askEnd";
import { askProject } from "../utils/ask/task/askProject";
import { askTags } from "../utils/ask/task/askTags";

type RequireOptions = {
  allow: boolean
  message?: string;
}

type UpdateTaskPropertyModalProps = {
  app: App;
  task: Task;
  property: "text" | "schedule" | "start" | "end" | "projectLink" | "tags" | "priority";
  requireOptions?: RequireOptions
}
export const updateTaskPropertyModal = async ({ app, task, property, requireOptions }: UpdateTaskPropertyModalProps) => {
  if (requireOptions && !requireOptions.allow) {
    new Notice(requireOptions.message || `The property '${property}' requires another element`)
    return
  } 

  const modal = new NavigationModal(app)

    let modifyProperty

    if (property === "text") modifyProperty = await askText(modal, task, true)
    if (property === "schedule") modifyProperty = await askSchedule(modal, task, true)
    if (property === "start") modifyProperty = await askStart(modal, task, true)
    if (property === "end") modifyProperty = await askEnd(modal, task, true)
    if (property === "projectLink") modifyProperty = await askProject(modal, task, true)
    if (property === "tags") modifyProperty = await askTags(modal, task)
    if (property === "priority") modifyProperty = await askPriority(modal, task)

    if (!modifyProperty) throw new Error("No property to modify");

    modal.pages = [
      modifyProperty
    ]

    await modal.open()
    await task.save()
}