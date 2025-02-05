import { App, ItemView, WorkspaceLeaf, getAllTags, moment } from 'obsidian';
import { Projects } from 'src/projects/projects';
import { Tasks } from 'src/tasks/tasks';
import { createTaskComponent } from 'src/ui/components/task';
import { listenClick, listenOverAndOut } from 'src/ui/html';
import { AppWithPlugin } from 'types';

export const VIEW_LIFE_PLANNER_PROJECTS = 'VIEW_LIFE_PLANNER_PROJECTS';

export class ProjectsView extends ItemView {
  protected selectedWeek: string | undefined 

  constructor(leaf: WorkspaceLeaf, app: App) {
    super(leaf);
    this.app = app
    this.icon = "folder-heart"
    this.navigation = true
  }

  getViewType() {
    return VIEW_LIFE_PLANNER_PROJECTS;
  }

  getDisplayText() {
    return 'Projects';
  }

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    container.addClass("projects")

    const projectsContainer = container.createDiv({ attr: { style: `
      max-width: var(--file-line-width); 
      margin-left: auto; 
      margin-right: auto;
    `}});

    // Heading
    const headingContainer = projectsContainer.createEl("hgroup")
    headingContainer.createEl("h1", { text: "Projects"})


    // PROJECTS
    const projectsFiles = await Projects.getAllFiles(this.app as AppWithPlugin)
    const topProjectFiles = projectsFiles.filter(file => {
      const fileCache = this.app.metadataCache.getFileCache(file)
      if (!fileCache || !fileCache.frontmatter || !fileCache.frontmatter['parent_project']) return
    })

    const projectsElementsContainer = projectsContainer.createDiv()

    topProjectFiles.forEach(async file => {
      const projectElementContainer = projectsElementsContainer.createDiv({ attr: { style: `display: flex; flex-direction: column; gap: 4rem;` } })

      const header = projectElementContainer.createEl("h2", { text: file.basename, attr: { style: "cursor: pointer;" } })
      listenClick(header, () => this.leaf.openFile(file))
      listenOverAndOut(header, () => header.style.color = "hsl(var(--accent-h), var(--accent-s), var(--accent-l))", () => header.style.color = "")

      const tasksNotDone = await Tasks.getTasksFromProperties(this.app, { status: " ", projectLink: file.path })

      tasksNotDone.forEach(task => {
        if (task.projectLink !== file.path) return

        createTaskComponent(projectElementContainer, task, { onStatusChange: () => console.log("click on status") })
      });
    })
  }
}