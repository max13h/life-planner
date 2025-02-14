import { App, MarkdownView, Editor } from "obsidian";
import { moveFileToBin } from "./moveFileToBin";
import LifePlanner from "main";
import { VIEW_LIFE_PLANNER_DASHBOARD } from "src/views/dashboard/dashboard";
import { AppWithPlugin } from "types";
import Task from "src/classes/task/task";
import { VIEW_LIFE_PLANNER_PROJECTS } from "src/views/projectsView";
import { openView } from "src/views";
import { Project } from "src/classes/project/project";
import { RecurringTask } from "src/classes/recurringTask/recurringTask";

export class Commands {
  private readonly plugin: LifePlanner;

  private get app(): App {
      return this.plugin.app;
  }

  constructor({ plugin }: { plugin: LifePlanner }) {
    this.plugin = plugin;

    plugin.addCommand({
      id: 'lp-move-file-to-bin',
      name: 'Move file to bin',
      icon:'trash-2',
      editorCallback: (editor: Editor, view: MarkdownView) => {
        moveFileToBin(editor, view, plugin.settings)
      }
    });

    plugin.addCommand({
      id: 'lp-create-project',
      name: 'Create project',
      icon: 'folder-heart',
      callback: async () => await Project.new(this.app as AppWithPlugin)
    });
    
    plugin.addCommand({
      id: 'lp-open-dashboard',
      name: 'Open dashboard',
      icon: 'lamp-desk',
      callback: async () => await openView(this.app, VIEW_LIFE_PLANNER_DASHBOARD)
    });

    plugin.addCommand({
      id: 'lp-add-task',
      name: 'Add task',
      icon: 'check-check',
      callback: async () => await Task.new(this.app as AppWithPlugin)
    });
    
    plugin.addCommand({
      id: 'lp-add-recurring-task',
      name: 'Add recurring task',
      icon: 'check-check',
      callback: async () => await RecurringTask.new(this.app as AppWithPlugin)
    });
    
    plugin.addCommand({
      id: 'lp-open-projects-view',
      name: 'Open projects view',
      icon: 'folder-heart',
      callback: async () => await openView(this.app, VIEW_LIFE_PLANNER_PROJECTS)
    });

  }
}