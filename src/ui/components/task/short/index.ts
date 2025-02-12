import Task from 'src/classes/task/task';
import { App } from 'obsidian';
import { createProjectLinkField } from '../elements/projectLinkField';
import { createStatus } from '../elements/status/statusField';
import { createText } from '../elements/textField';
import { listenClick } from 'src/ui/html';
import { UserInputModal } from 'src/ui/modals/userInputModal';
import { createFullTaskComponent } from '../full';

interface CreateFullTaskComponentProps {
  app: App;
  container: HTMLElement;
  task: Task;
  refreshView: (() => Promise<void>);
  style?: string
}

export const createShortTaskComponent = ({ app, container, task, refreshView, style }: CreateFullTaskComponentProps) => {
  const taskContainer = container.createDiv({
    attr: {
      style: `
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        border-radius: var(--radius-m);
        border: var(--lp-task-borders);
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        background-color: var(--color-base-00);
        cursor: pointer;
        ${style}
      `
    }
  });
  const line = taskContainer.createDiv({
    attr: {
      style: `
        display: flex;
        width: 100%;
        height: fit-content;
        align-items: center;
        flex-wrap: wrap;
        gap: 4px;
        padding-top: 8px;
      `
    }
  });

  createStatus({ task, container: line })
  createText({ app, task, container: line, allowClick: false, style: "font-size: 1rem;" })
  createProjectLinkField({ app, container: line, task, refreshView, allowClick: false });

  listenClick(taskContainer, async (e) => {
    if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') return
    const modal = new UserInputModal(app)

    createFullTaskComponent({ app, container: modal.contentEl, task, refreshView  })

    await modal.open()
  })

  return taskContainer;
};
