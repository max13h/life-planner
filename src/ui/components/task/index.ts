import Task from 'src/classes/task/task';
import { App } from 'obsidian';
import { createFirstLine } from './firstLine/createFirstLine';
import { createSecondLine } from './secondLine/createSecondLine';
import { createField } from './secondLine/createField';
import { NavigationModal } from 'src/ui/modals/navigationModal';
import { askProject } from 'src/classes/task/new/askProject';

interface Props {
  refreshView: (() => Promise<void>);
}

export const createTaskComponent = (
  app: App,
  container: HTMLElement,
  task: Task,
  props: Props,
) => {
  const taskContainer = container.createDiv({
    attr: {
      style: `
        display: flex;
        flex-direction: column;
        gap: 4px;
        border-radius: var(--radius-m);
        padding-left: 0.5rem;
        padding-right: 0.5rem;
      `
    }
  });

  createFirstLine(app, task, taskContainer, props.refreshView)
  createSecondLine(app, task, taskContainer)

  if (!task.projectLink) {
    const projectLinkWrapper = taskContainer.createDiv({ attr: { style: `
      width: 100%;
      display: flex;
      justify-content: end;  
    ` } })

    createField(task, projectLinkWrapper, {
      icon: "+",
      key: "other",
      value: "assign to project",
      style: "background-color: lightgreen; padding: 0 9px 0 9px; border-radius: var(--radius-m);"
    }, async () => {
      const modal = new NavigationModal(app);
      const modifyProject = await askProject(modal, task, true);
      modal.pages = [modifyProject];
      await modal.open();
      await task.save();
      if (props.refreshView) await props.refreshView()
    });
  }
  
  return taskContainer;
};
