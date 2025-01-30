import { App, ItemView, WorkspaceLeaf, moment } from 'obsidian';
import { Projects } from 'src/projects/projects';
import { Tasks } from 'src/tasks/tasks';
import { listenClick, listenOverAndOut } from 'src/utils/html';
import { AppWithPlugin } from 'types';

export const VIEW_PROJECTS = 'VIEW_PROJECTS';

export class ProjectsView extends ItemView {
  protected selectedWeek: string | undefined 

  constructor(leaf: WorkspaceLeaf, app: App) {
    super(leaf);
    this.app = app
    this.icon = "folder-heart"
    this.navigation = true
  }

  getViewType() {
    return VIEW_PROJECTS;
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
        const taskElementContainer = projectElementContainer.createDiv({
          attr: {
            style: `
              display: flex;
              flex-direction: column;
              gap: 0.75rem;
              border: 1px solid var(--background-modifier-border);
              padding: 1rem;
              border-radius: 5px;
              background: var(--background-primary);
            `
          }
        });
      
        // Status and Text Container
        const statusTextContainer = taskElementContainer.createDiv({
          attr: {
            style: `
              display: flex;
              align-items: flex-start;
              gap: 0.5rem;
            `
          }
        });
      
        // Status
        if (task.status === " " || task.status === "x") {
          const checkbox = statusTextContainer.createEl("input", {
            attr: {
              type: "checkbox",
              checked: task.status === "x",
              style: "margin-top: 0.25rem;"
            }
          });
        } else {
          const statusSymbol = statusTextContainer.createSpan({
            text: task.status === "-" ? "❌" : "⚒️",
            attr: {
              style: `
                font-size: 1.1em;
                line-height: 1.5;
              `
            }
          });
        }
      
        // Task Text
        statusTextContainer.createSpan({
          text: task.text,
          attr: {
            style: `
              flex: 1;
              line-height: 1.5;
            `
          }
        });
      
        // Schedule Info Container
        if (task.schedule || task.start || task.end) {
          const scheduleContainer = taskElementContainer.createDiv({
            attr: {
              style: `
                display: flex;
                gap: 1rem;
                align-items: center;
                padding: 0.5rem;
                background: var(--background-secondary);
                border-radius: 4px;
              `
            }
          });
      
          if (task.schedule) {
            scheduleContainer.createDiv({
              text: `📅 ${task.schedule}`,
              attr: {
                style: "font-size: 0.9em;"
              }
            });
          }
      
          if (task.start) {
            scheduleContainer.createDiv({
              text: `▶️ ${task.start}`,
              attr: {
                style: "font-size: 0.9em;"
              }
            });
          }
      
          if (task.end) {
            scheduleContainer.createDiv({
              text: `⏹️ ${task.end}`,
              attr: {
                style: "font-size: 0.9em;"
              }
            });
          }
        }
      
        // Tags Container
        if (task.tags && task.tags.length > 0) {
          const tagsContainer = taskElementContainer.createDiv({
            attr: {
              style: `
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
              `
            }
          });
      
          task.tags.forEach(tag => {
            tagsContainer.createSpan({
              text: tag,
              attr: {
                style: `
                  background: var(--background-modifier-success);
                  color: var(--text-on-accent);
                  padding: 0.25rem 0.5rem;
                  border-radius: 1rem;
                  font-size: 0.85em;
                `
              }
            });
          });
        }
      });
    })
  }
}

export const openProjectsView = async (app: App) => {
  const { workspace } = app;

  let leaf: WorkspaceLeaf | null = null;
  const leaves = workspace.getLeavesOfType(VIEW_PROJECTS);

  if (leaves.length > 0) {
    // A leaf with our view already exists, use that
    leaf = leaves[0];
  } else {
    // Our view could not be found in the workspace, create a new leaf
    // in the right sidebar for it
    leaf = workspace.getLeaf(false);
    if (!leaf) throw new Error("There is no leaf");
    await leaf.setViewState({ type: VIEW_PROJECTS, active: true });
  }

  // "Reveal" the leaf in case it is in a collapsed sidebar
  workspace.revealLeaf(leaf);
}