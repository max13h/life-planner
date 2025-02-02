import { App, MarkdownView, Editor } from "obsidian";
import { moveFileToBin } from "./moveFileToBin";
import LifePlanner from "main";
import { openDashboard } from "src/views/dashboard/dashboard";
import { AppWithPlugin } from "types";
import { Project } from "src/projects/project";
import { Task } from "src/tasks/task";
import { openProjectsView } from "src/views/projects";

export class Commands {
  private readonly plugin: LifePlanner;

  private get app(): App {
      return this.plugin.app;
  }

  constructor({ plugin }: { plugin: LifePlanner }) {
    this.plugin = plugin;

    plugin.addCommand({
      id: 'move-file-to-bin',
      name: 'Move file to bin',
      icon:'trash-2',
      editorCallback: (editor: Editor, view: MarkdownView) => {
        moveFileToBin(editor, view, plugin.settings)
      }
    });

    plugin.addCommand({
      id: 'create-project',
      name: 'Create project',
      icon: 'folder-heart',
      callback: async () => await Project.new(this.app as AppWithPlugin)
    });
    
    plugin.addCommand({
      id: 'open-dashboard',
      name: 'Open dashboard',
      icon: 'lamp-desk',
      callback: () => openDashboard(this.app)
    });

    plugin.addCommand({
      id: 'add-task',
      name: 'Add task',
      icon: 'check-check',
      callback: async () => await Task.new(this.app)
    });
    
    plugin.addCommand({
      id: 'open-projects-view',
      name: 'Open projects view',
      icon: 'folder-heart',
      callback: async () => await openProjectsView(this.app)
    });

  }
}