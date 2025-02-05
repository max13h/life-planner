import { TFile, WorkspaceLeaf } from "obsidian"
import { Projects } from "src/projects/projects"
import { AppWithPlugin } from "types"
import { renderProject } from "../project/project"

export const renderProjects = async (app: AppWithPlugin, viewContainer: HTMLElement, leaf: WorkspaceLeaf) => {
  const projectsFiles = await Projects.getAllFiles(app as AppWithPlugin)
  const topProjectFiles = getTopProjectsFiles(app, projectsFiles)

  const container = viewContainer.createDiv()

  topProjectFiles.forEach(async file => {
    await renderProject({
      app,
      file, 
      container,
      leaf,
      headingNumber: 2
    })
  })
}

const getTopProjectsFiles = (app: AppWithPlugin, projectsFiles: TFile[]) => {
  return projectsFiles.filter(file => {
    const fileCache = app.metadataCache.getFileCache(file)
    if (!fileCache || !fileCache.frontmatter || !fileCache.frontmatter['parent_project']) return true
  })
}
