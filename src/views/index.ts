import { App, WorkspaceLeaf } from 'obsidian';
import type Max13hPlugin from 'main';
import { DashboardView, VIEW_LIFE_PLANNER_DASHBOARD } from './dashboard/dashboard';
import { ProjectsView, VIEW_LIFE_PLANNER_PROJECTS } from './projectsView';

export class Views {
    private readonly plugin: Max13hPlugin;

    private get app(): App {
        return this.plugin.app;
    }

    constructor({ plugin }: { plugin: Max13hPlugin }) {
      this.plugin = plugin;

      plugin.registerView(
        VIEW_LIFE_PLANNER_DASHBOARD,
        (leaf) => new DashboardView(leaf, this.app)
      );
      plugin.registerView(
        VIEW_LIFE_PLANNER_PROJECTS,
        (leaf) => new ProjectsView(leaf, this.app)
      );
    }
}

export const openView = async (app: App, viewType: string) => {
  const { workspace } = app;

  let leaf: WorkspaceLeaf | null = null;
  const leaves = workspace.getLeavesOfType(viewType);

  if (leaves.length > 0) {
    // A leaf with our view already exists, use that
    leaf = leaves[0];
  } else {
    // Our view could not be found in the workspace, create a new leaf
    leaf = workspace.getLeaf(true);
    if (!leaf) throw new Error("There is no leaf");
    await leaf.setViewState({ type: viewType, active: true });
  }

  // "Reveal" the leaf in case it is in a collapsed sidebar
  workspace.revealLeaf(leaf);
}