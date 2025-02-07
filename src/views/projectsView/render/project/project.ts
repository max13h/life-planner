import { WorkspaceLeaf } from "obsidian";
import { AppWithPlugin, ProjectViewObject } from "types";
import { createHeader } from "./createHeader";
import { createTasks } from "./createTask";

export const renderProject = async ({ app, container, projectObject, leaf, headingNumber, refreshView }: { app: AppWithPlugin, leaf: WorkspaceLeaf, projectObject: ProjectViewObject, container: HTMLElement, headingNumber: number, refreshView: (() => Promise<void>) }) => {
  const projectContainer = container.createDiv({ attr: { style: `
    display: flex; 
    flex-direction: column; 
    gap: 0.5rem;
    border: 1px solid hsla(var(--accent-h) var(--accent-s) var(--accent-l));
    border-radius: var(--radius-m);
    padding: 4px 8px 4px 16px;
  ` } })

  createHeader({
    projectContainer,
    projectObject,
    leaf,
    h: headingNumber
  })

  await createTasks({
    projectContainer,
    app,
    projectLink: projectObject.file.path,
    refreshView
  })

  projectObject.childrenProjects.forEach(async childrenFile => {
    await renderProject({
      app,
      projectObject: childrenFile,
      container: projectContainer,
      leaf,
      headingNumber: headingNumber + 1,
      refreshView
    })
  })
}
