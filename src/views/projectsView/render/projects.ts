import { TFile, WorkspaceLeaf } from "obsidian"
import { Projects } from "src/projects/projects"
import { Tasks } from "src/tasks/tasks"
import { createTaskComponent } from "src/ui/components/task"
import { listenClick, listenOverAndOut } from "src/ui/html"
import { AppWithPlugin } from "types"

export const renderProjects = async (app: AppWithPlugin, viewContainer: HTMLElement, leaf: WorkspaceLeaf) => {
  const projectsFiles = await Projects.getAllFiles(app as AppWithPlugin)
  const topProjectFiles = getTopProjectsFiles(app, projectsFiles)

  const container = viewContainer.createDiv()

  topProjectFiles.forEach(async file => {
    const projectContainer = container.createDiv({ attr: { style: `display: flex; flex-direction: column; gap: 1rem;` } })

    createHeader({
      projectContainer,
      file,
      leaf,
      h: 2
    })

    createTasks({
      projectContainer,
      app,
      projectLink: file.path
    })
  })
}

const getTopProjectsFiles = (app: AppWithPlugin, projectsFiles: TFile[]) => {
  return projectsFiles.filter(file => {
    const fileCache = app.metadataCache.getFileCache(file)
    if (!fileCache || !fileCache.frontmatter || !fileCache.frontmatter['parent_project']) return true
  })
}

const createHeader = ({ projectContainer, file, leaf, h}: { projectContainer: HTMLElement, file: TFile, leaf: WorkspaceLeaf, h: number }) => {
  const header = projectContainer.createEl(`h${h}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6", { text: file.basename, attr: { style: "cursor: pointer;" } })
    listenClick(header, () => leaf.openFile(file))
    listenOverAndOut(header, () => header.style.color = "hsl(var(--accent-h), var(--accent-s), var(--accent-l))", () => header.style.color = "")
}

const createTasks = async ({ app, projectLink, projectContainer }: { app: AppWithPlugin, projectLink: string, projectContainer: HTMLElement }) => {
  const tasksNotDone = await Tasks.getTasksFromProperties(app, { projectLink });

  tasksNotDone.forEach(task => {
    if (task.projectLink !== projectLink) return;

    createTaskComponent(projectContainer, task, { onStatusChange: () => console.log("click on status") });
  });
}
