import { App, TFile } from "obsidian";
import { LifePlannerSettings } from "src/settings/settings";

export interface AppWithPlugin extends App {
  plugins: {
    plugins: {
      "life-planner": {
        settings: LifePlannerSettings
      }
    }
  }
}

export class Task {
  status: " " | "/" | "-" | "x" = " ";
  text: string = "";
  schedule?: string;
  start?: string;
  end?: string;
  occurrence?: string;
  projectLink?: string;
  tags: string[] = [];
  priority?: string;
  recurs?: string;
  created?: string;
  completed?: string;

  app: AppWithPlugin;
  file: TFile

  constructor(app: AppWithPlugin) {
    this.app = app;
  }

  parseFromMarkdownLine(line: string) {
    // Remove leading/trailing pipes and split columns
    const cleanLine = line.trim().replace(/^\|/, "").replace(/\|$/, "");
    const columns = cleanLine.split("|").map((col) => col.trim());

    // Validate the number of columns
    if (columns.length !== 12) {
      throw new Error("The task line does not have the correct number of columns.");
    }

    // Assign values to properties
    this.status = columns[0] as Task["status"] || " " ;
    this.text = columns[1];
    this.schedule = columns[2] || undefined;
    this.start = columns[3] || undefined;
    this.end = columns[4] || undefined;
    this.occurrence = columns[5] || undefined;
    this.projectLink = columns[6] || undefined;
    this.tags = columns[7] ? columns[7].split(" ").filter((tag) => tag.startsWith("#")) : [];
    this.priority = columns[8] || undefined;
    this.recurs = columns[9] || undefined;
    this.created = columns[10] || undefined;
    this.completed = columns[11] || undefined;
  }
  toMarkdownLine(): string {
    const tagsString = this.tags.join(" ");
    return `|${this.status}|${this.text}|${this.schedule || ""}|${this.start || ""}|${this.end || ""}|${this.occurrence || ""}|${this.projectLink || ""}|${tagsString}|${this.priority || ""}|${this.recurs || ""}|${this.created || ""}|${this.completed || ""}|`;
  }

  async insertTaskInFile(): Promise<void> {
    if (!this.created) {
      this.created = new Date().toISOString();
    }
    this.file = await this.ensureExistAndReturnFile();
    await this.app.vault.append(this.file, `\n${this.toMarkdownLine()}`);
  }

  async ensureExistAndReturnFile() {
    const { filePathFormatted, folderPath } = this.filePathFormatted();

    const tableHeader = "|Status|Text|Schedule|Start|End|Occurrence|Project Link|Tags|Priority|Recurs|Created|Completed|\n|------|-----|--------|-----|---|----------|-------------|----|--------|-------|--------|---------|";

    try {
      await this.app.vault.createFolder(folderPath);
    } catch (error) {
      if (!error.message.includes("Folder already exists")) console.error(error);
    }

    try {
      await this.app.vault.create(filePathFormatted, tableHeader);
    } catch (error) {
      if (!error.message.includes("File already exists")) console.error(error);
    }

    const file = this.app.vault.getFileByPath(filePathFormatted);
    if (!file) throw new Error("File doesn't exist");

    return file;
  }

  filePathFormatted() {
    const settings = this.app.plugins.plugins["life-planner"].settings;

    const folderPath = settings.tasksFolder.endsWith('/') ? settings.tasksFolder : settings.tasksFolder + '/';
    const fileName = settings.tasksFile.startsWith('/') ? settings.tasksFile.slice(1) : settings.tasksFile;
    const filePathFormatted = folderPath + fileName + ".md";

    return { folderPath, fileName, filePathFormatted }
  }
}
