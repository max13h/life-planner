import { createField } from "../../createField";
import { App } from "obsidian";
import Task from "src/classes/task/task";
import { updateTaskPropertyModal } from "src/classes/task/updateTaskPropertyModal";

type CreateProjectLinkFieldProps = { 
  app: App;
  container: HTMLElement; 
  task: Task; 
  refreshView: () => Promise<void>; 
  allowClick: boolean;
}

export const createProjectLinkField = ({ app, container, task, refreshView, allowClick }: CreateProjectLinkFieldProps) => {
  createField({
    container,
    config: {
      icon: "",
      value: task.projectLink?.match(/^\[\[.*\/([^\/]+)\.md\]\]$/)?.[1] || "+ assign to project",
      cls: `projectLink ${!task.projectLink ? "missing" : ""}`
    },
    clickAction: {
      allow: allowClick,
      onClick: async () => {
        await updateTaskPropertyModal({ app, task, property: "projectLink" })
        await refreshView()
      },
    }
  })
}