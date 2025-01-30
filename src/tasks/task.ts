import { App, TFile } from "obsidian";
import { AppWithPlugin } from "types";
import { Tasks } from "./tasks";
import { NavigationModal } from "src/modals/navigationModal";
import { addInputComponent } from "src/modals/components/input";
import { Projects } from "src/projects/projects";
import { addAutocompleteSelect } from "src/modals/components/suggester";
import { getDayDate } from "src/utils/time";
import { dateModal } from "src/modals/dateModal";

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
    const { filePathFormatted, folderPath } = Tasks.retrieveFilePath(this.app);

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

  static async new(app: App) {
    const task = new Task(app as AppWithPlugin)
    const modal = new NavigationModal(app)

    const askText = (contentEl: typeof modal.contentEl) => {
      modal.setTitle("Insert content of the new task");

      addInputComponent(contentEl, {
        onKeyUp: async (input) => {
          task.text = input.value
        },
        onEnter: async () => {
          if (!task.text) return
          await modal.pressNext()
        },
        value: task.text
      });
    }

    const askProject = async (contentEl: typeof modal.contentEl) => {
      modal.setTitle("Choose project related the new task");

      const projectFiles = await Projects.getAllFiles(app as AppWithPlugin)

      addAutocompleteSelect(contentEl, {
        suggestions: {
          displayedValues: projectFiles.map(file => file.basename),
          usedValues: projectFiles.map(file => file.path)
        },
        onSelected: async (selected) => {
          task.projectLink = selected
          await modal.pressNext()
        }
      })
    }

    const askDate = async (contentEl: typeof modal.contentEl) => {
      modal.setTitle("Choose task date");

      const displayedValues = [
        "✏️ Personnaliser",
        "🤷 Ne pas encore donner de date",
        `📅 Demain ${getDayDate('tomorrow')}`,
        `🕔 Lundi prochain (${getDayDate('monday')})`,
        `🕔 Mardi prochain (${getDayDate('tuesday')})`,
        `🕔 Mercredi prochain (${getDayDate('wednesday')})`,
        `🕔 Jeudi prochain (${getDayDate('thursday')})`,
        `🕔 Vendredi prochain (${getDayDate('friday')})`,
        `🕔 Samedi prochain (${getDayDate('saturday')})`,
        `🕔 Dimanche prochain (${getDayDate('sunday')})`,
      ];

      const usedValues = [
        async () => {
          return await new dateModal(app).open()
        },
        "",
        getDayDate('tomorrow'),
        getDayDate('monday'),
        getDayDate('tuesday'),
        getDayDate('wednesday'),
        getDayDate('thursday'),
        getDayDate('friday'),
        getDayDate('saturday'),
        getDayDate('sunday'),
      ];

      addAutocompleteSelect(contentEl, {
        suggestions: {
          displayedValues: displayedValues,
          usedValues: usedValues
        },
        onSelected: async (usedValue) => {
          if (typeof usedValue === 'function') {
            task.schedule = await usedValue();
          } else {
            task.schedule = usedValue;
          }
          modal.pressDone();
        }
      })
    }

    modal.pages = [
      askText,
      askProject,
      askDate
    ]

    await modal.open()
    console.log("taskaaaa", task);
  }
}
