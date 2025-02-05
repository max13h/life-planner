import { TFile } from "obsidian"
import { AppWithPlugin } from "types"

export const getChildrenProjects = (app: AppWithPlugin, projectFile: TFile, projectsFiles: TFile[]) => {
  return projectsFiles.filter(file => {
    const fileCache = app.metadataCache.getFileCache(file)
    if (fileCache 
      && fileCache.frontmatter 
      && fileCache.frontmatter['parent_project']
      && fileCache.frontmatter['parent_project'] === `[[${projectFile.path}]]`
    ) {
      return true
    }
  })
}

export const getTopProjectsFiles = (app: AppWithPlugin, projectsFiles: TFile[]) => {
  return projectsFiles.filter(file => {
    const fileCache = app.metadataCache.getFileCache(file)
    if (!fileCache || !fileCache.frontmatter || !fileCache.frontmatter['parent_project']) return true
  })
}