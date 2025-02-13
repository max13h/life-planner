import { App} from "obsidian";
import Task from "src/classes/task/task";
import { createField } from "../../createField";
import { updateTaskPropertyModal } from "src/classes/task/updateTaskPropertyModal";

type CreateTagFieldProps = { 
  app: App, 
  container: HTMLElement, 
  task: Task ;
  allowClick: boolean;
}

export const createTagField = ({ app, container, task, allowClick }: CreateTagFieldProps) => {
  const tagsWrapper = container.createDiv({ cls: "tags-container" })
  updateUI({ app, task, container: tagsWrapper, allowClick })
}

const updateUI = ({ app, container, task, allowClick }: { app: App, container: HTMLElement, task: Task, allowClick: boolean }) => {
  container.empty()

  if (!task.tags.length) {
    createField({
      container,
      config: {
        value: "+#",
      },
      clickAction: {
        allow: allowClick,
        onClick: async () => {
          await updateTaskPropertyModal({ app, task, property: "tags" })
          updateUI({ app, task, container, allowClick })
        }
      }
    })
  }

  task.tags.forEach(tag => {
    createField({
      container,
      config: {
        value: tag,
      },
      clickAction: {
        allow: allowClick,
        onClick: async () => {
          await updateTaskPropertyModal({ app, task, property: "tags" })
          updateUI({ app, task, container, allowClick })
        }
      }
    })
  })
}