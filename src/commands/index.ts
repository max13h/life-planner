import { App, MarkdownView, Editor } from "obsidian";
import { moveFileToBin } from "./moveFileToBin";
import LifePlanner from "main";
import { createProject } from "./createProject";

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
      callback: () => createProject(this.app, plugin.settings)
    });

    // plugin.addCommand({
    //   id: 'add-task',
    //   name: 'Add task',
    //   icon: 'check-check',
    //   callback: () => addTask(this.app)
    // });

  }
}