import { TFile, WorkspaceLeaf } from "obsidian"
import { Projects } from "src/classes/projects/projects"
import { AppWithPlugin } from "types"
import { renderProject } from "../project/project"
import { getTopProjectsFiles } from "src/utils/projects/filters"

export const renderProjects = async (app: AppWithPlugin, viewContainer: HTMLElement, leaf: WorkspaceLeaf) => {
  const projectsFiles = await Projects.getFiles(app as AppWithPlugin)
  const topProjectFiles = getTopProjectsFiles(app, projectsFiles)

  const container = viewContainer.createDiv({ attr: { style: `
    display: flex;
    flex-direction: column;
    gap: 1rem;
  ` } })

  topProjectFiles.forEach(async file => {
    await renderProject({
      app,
      file, 
      container,
      leaf,
      projectsFiles,
      headingNumber: 2
    })
  })
}


