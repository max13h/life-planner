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
  const firstLine = taskContainer.createDiv({ cls: "line-one" });

  createStatus({ task, container: firstLine })
  createText({ app, task, container: firstLine, allowClick: false, size: "small" })
  createProjectLinkField({ app, container: taskContainer, task, refreshView, allowClick: false, size: "small" });

  listenClick(taskContainer, async (e) => {
    if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') return
    const modal = new UserInputModal(app)

    createFullTaskComponent({ app, container: modal.contentEl, task, refreshView  })

    await modal.open()
  })

  return taskContainer;
};
