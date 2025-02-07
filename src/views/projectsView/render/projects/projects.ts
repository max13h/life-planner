import { WorkspaceLeaf } from "obsidian"
import { AppWithPlugin, ProjectViewObject } from "types"
import { renderProject } from "../project/project"

export const renderProjects = async (app: AppWithPlugin, viewContainer: HTMLElement, leaf: WorkspaceLeaf, projectsObject: ProjectViewObject[], refreshView: (() => Promise<void>)) => {
  const container = viewContainer.createDiv({ attr: { style: `
    display: flex;
    flex-direction: column;
    gap: 1rem;
  ` }})

  projectsObject
    .filter(el => !el.hasParentProject)
    .forEach(async (projectObject) => {
      await renderProject({
        app,
        projectObject, 
        container,
        leaf,
        headingNumber: 2,
        refreshView
      })
    })
}


