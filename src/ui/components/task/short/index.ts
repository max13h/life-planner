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
        align-items: center;
        gap: 4px;
        border-radius: var(--radius-m);
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        background-color: white;
        ${style}
      `
    }
  });

  createStatus({ task, container: taskContainer })
  createText({ app, task, container: taskContainer, allowClick: false })
  createProjectLinkField({ app, container: taskContainer, task, refreshView, allowClick: false });

  listenClick(taskContainer, async (e) => {
    if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') return
    const modal = new UserInputModal(app)

    createFullTaskComponent({ app, container: modal.contentEl, task, refreshView  })

    await modal.open()
  })

  return taskContainer;
};
