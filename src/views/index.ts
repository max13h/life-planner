import { App } from 'obsidian';
import type Max13hPlugin from 'main';
import { VIEW_DASHBOARD, DashboardView } from './dashboard/dashboard';
import { ProjectsView, VIEW_PROJECTS } from './projects';

export class Views {
    private readonly plugin: Max13hPlugin;

    private get app(): App {
        return this.plugin.app;
    }

    constructor({ plugin }: { plugin: Max13hPlugin }) {
      this.plugin = plugin;

      plugin.registerView(
        VIEW_DASHBOARD,
        (leaf) => new DashboardView(leaf, this.app)
      );
      plugin.registerView(
        VIEW_PROJECTS,
        (leaf) => new ProjectsView(leaf, this.app)
      );
    }
}