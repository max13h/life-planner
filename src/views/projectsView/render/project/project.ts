import { TFile, WorkspaceLeaf } from "obsidian";
import { AppWithPlugin } from "types";
import { createHeader } from "./createHeader";
import { createTasks } from "./createTask";
import { getChildrenProjects } from "src/utils/projects/filters";

export const renderProject = async ({ app, container, file, leaf, headingNumber, projectsFiles }: { app: AppWithPlugin, leaf: WorkspaceLeaf, file: TFile, container: HTMLElement, headingNumber: number, projectsFiles: TFile[] }) => {
  const projectContainer = container.createDiv({ attr: { style: `
    display: flex; 
    flex-direction: column; 
    gap: 0.5rem;
    border: 1px solid hsla(var(--accent-h) var(--accent-s) var(--accent-l));
    border-radius: var(--radius-m);
    padding-left: 16px;
    padding-right: 8px;
    padding-bottom: 8px;
  ` } })

  createHeader({
    projectContainer,
    file,
    leaf,
    h: headingNumber
  })

  await createTasks({
    projectContainer,
    app,
    projectLink: file.path
  })

  const childrenProjects = getChildrenProjects(app, file, projectsFiles)

  childrenProjects.forEach(async childrenFile => {
    await renderProject({
    app,
    file: childrenFile, 
    container: projectContainer,
    leaf,
    projectsFiles,
    headingNumber: headingNumber + 1
  })
  })
}
