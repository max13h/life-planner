import { App, ItemView, WorkspaceLeaf, getAllTags, moment } from 'obsidian';
import { AppWithPlugin } from 'types';
import { renderHeading } from './render/heading';
import { renderProjects } from './render/projects/projects';

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
    container.addClass("projectsView")

    const viewContainer = container.createDiv({ attr: { style: `
      max-width: var(--file-line-width); 
      margin-left: auto; 
      margin-right: auto;
    `}});

    renderHeading(viewContainer)
    await renderProjects(this.app as AppWithPlugin, viewContainer, this.leaf)
  }
}