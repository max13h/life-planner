import { App, ItemView, WorkspaceLeaf, moment } from 'obsidian';
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

    const projectsFiles = await Projects.getAllFiles(this.app as AppWithPlugin)
    const projectsElementsContainer = projectsContainer.createDiv()
    projectsFiles.forEach(async file => {
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

export const openProjectsView = async (app: App) => {
  const { workspace } = app;

  let leaf: WorkspaceLeaf | null = null;
  const leaves = workspace.getLeavesOfType(VIEW_LIFE_PLANNER_PROJECTS);

  if (leaves.length > 0) {
    // A leaf with our view already exists, use that
    leaf = leaves[0];
  } else {
    // Our view could not be found in the workspace, create a new leaf
    // in the right sidebar for it
    leaf = workspace.getLeaf(false);
    if (!leaf) throw new Error("There is no leaf");
    await leaf.setViewState({ type: VIEW_LIFE_PLANNER_PROJECTS, active: true });
  }

  // "Reveal" the leaf in case it is in a collapsed sidebar
  workspace.revealLeaf(leaf);
}