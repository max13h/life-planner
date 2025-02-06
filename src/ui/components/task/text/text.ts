import { App } from "obsidian";
import { askText } from "src/classes/task/new/askText";
import Task from "src/classes/task/task";
import { listenClick } from "src/ui/html";
import { NavigationModal } from "src/ui/modals/navigationModal";

export const createText = (app: App, task: Task, container: HTMLElement) => {
  const text = container.createSpan({
    text: task.text,
    attr: {
      style: `
        flex: 1;
        font-size: var(--font-ui-large);
        padding-top: 4px;
        padding-bottom: 4px;
      `
    }
  });

  listenClick(text, async () => {
    const modal = new NavigationModal(app)

    const modifyText = await askText(modal, task, true)
    modal.pages = [
      modifyText
    ]

    await modal.open()
    text.setText(task.text)
    await task.save()
  })
}