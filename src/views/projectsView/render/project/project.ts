import { TFile, WorkspaceLeaf } from "obsidian";
import { AppWithPlugin } from "types";
import { createHeader } from "./createHeader";
import { createTasks } from "./createTask";

export const renderProject = async ({ app, container, file, leaf, headingNumber }: { app: AppWithPlugin, leaf: WorkspaceLeaf, file: TFile, container: HTMLElement, headingNumber: number }) => {
  const projectContainer = container.createDiv({ attr: { style: `display: flex; flex-direction: column; gap: 1rem;` } })

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
}



