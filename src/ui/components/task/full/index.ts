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
  const taskContainer = container.createDiv({ cls: "task-full"});

  createFirstLine(app, task, taskContainer, refreshView)
  createSecondLine(app, task, taskContainer)

  if (!task.projectLink) {
    const projectLinkContainer = taskContainer.createDiv({ cls: "project-link-container" })
    createProjectLinkField({ app, container: projectLinkContainer, task, refreshView, allowClick: true });
  }
  
  return taskContainer;
};
