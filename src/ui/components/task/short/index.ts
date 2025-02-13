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
  const taskContainer = container.createDiv({ cls: "lp-view task-short", attr: { style: `${style}` }});
  const line = taskContainer.createDiv({ cls: "line" });

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
