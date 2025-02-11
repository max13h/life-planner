import Task from 'src/classes/task/task';
import { App } from 'obsidian';
import { createSecondLine } from './secondLine';
import { createFirstLine } from './firstLine';
import { createProjectLinkField } from '../elements/projectLinkField';

interface CreateFullTaskComponentProps {
  app: App;
  container: HTMLElement;
  task: Task;
  refreshView: (() => Promise<void>);
}

export const createFullTaskComponent = ({ app, container, task, refreshView }: CreateFullTaskComponentProps) => {
  const taskContainer = container.createDiv({
    attr: {
      style: `
        display: flex;
        flex-direction: column;
        gap: 4px;
        border-radius: var(--radius-m);
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        background-color: white;
      `
    }
  });

  createFirstLine(app, task, taskContainer, refreshView)
  createSecondLine(app, task, taskContainer)

  if (!task.projectLink) {
    const projectLinkContainer = taskContainer.createDiv({ attr: { style: `
      width: 100%;
      display: flex;
      justify-content: end;
    ` } })

    createProjectLinkField({ app, container: projectLinkContainer, task, refreshView, allowClick: true });
  }
  
  return taskContainer;
};
