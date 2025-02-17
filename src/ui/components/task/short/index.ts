import Task from 'src/classes/task/task';
import { App } from 'obsidian';
import { createProjectLinkField } from '../elements/projectLinkField';
import { createStatus } from '../elements/status/statusField';
import { createText } from '../elements/textField';
import { listenClick } from 'src/ui/html';
import { UserInputModal } from 'src/ui/modals/userInputModal';
import { createFullTaskComponent } from '../full';
import { createOccurenceField } from '../elements/occurenceField';

interface createShortTaskComponentProps {
  app: App;
  container: HTMLElement;
  task: Task;
  refreshView: (() => Promise<void>);
  style?: string
  size?: "small"
}

export const createShortTaskComponent = ({ app, container, task, refreshView, style, size }: createShortTaskComponentProps) => {
  const taskContainer = container.createDiv({ cls: "lp-view task-short", attr: { style: `${style}` }});
  const lineOne = taskContainer.createDiv({ cls: "line-one" });
  const lineTwo = taskContainer.createDiv({ cls: "line-two" });

  createStatus({ task, container: lineOne })
  createText({ app, task, container: lineOne, allowClick: false, size })
  createProjectLinkField({ app, container: lineTwo, task, refreshView, allowClick: false, size });
  if (task.occurrence) createOccurenceField({ container: lineTwo, task, size, allowClick: false })

  listenClick(taskContainer, async (e) => {
    if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') return
    const modal = new UserInputModal(app)

    createFullTaskComponent({ app, container: modal.contentEl, task, refreshView  })

    await modal.open()
  })

  return taskContainer;
};
