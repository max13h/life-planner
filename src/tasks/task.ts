import {  App, TFile, moment } from "obsidian";
import { AppWithPlugin } from "types";
import { ITask, TaskStatus, TaskValidationResult } from "types";
import { TaskParseError, TaskValidationError } from "errors";
import { Tasks } from "./tasks";
import { TaskFileError } from "errors";
import { NavigationModal } from "src/ui/modals/navigationModal";
import { addInputComponent } from "src/ui/components/input";
import { Projects } from "src/projects/projects";
import { addAutocompleteSelect } from "src/ui/components/suggester";
import { DayName, getDayDate, timeFromDurationAndStartTime, timeNow, isTimeAfterTime } from "src/utils/time";
import { dateModal } from "src/ui/modals/dateModal";
import { timeModal } from "src/ui/modals/timeModal";

export class Task implements ITask {
  status: TaskStatus = " ";
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
  file?: TFile;

  private static readonly TABLE_HEADER = "|Status|Text|Schedule|Start|End|Occurrence|Project Link|Tags|Priority|Recurs|Created|Completed|\n|------|-----|--------|-----|---|----------|-------------|----|--------|-------|--------|---------|";

  constructor(app: AppWithPlugin) {
    this.app = app;
  }

  parseFromMarkdownLine(line: string): void {
    const cleanLine = line.trim().replace(/^\|/, "").replace(/\|$/, "");
    const columns = cleanLine.split("|").map((col) => col.trim());

    if (columns.length !== 12) {
      throw new TaskParseError("The task line does not have the correct number of columns.");
    }

    try {
      this.status = columns[0] as TaskStatus || " ";
      this.text = columns[1];
      this.schedule = columns[2] || undefined;
      this.start = columns[3] || undefined;
      this.end = columns[4] || undefined;
      this.occurrence = columns[5] || undefined;
      this.projectLink = columns[6] ? columns[6].replace(/\[\[(.*?)\]\]/, "$1") : undefined;
      this.tags = columns[7] ? columns[7].split(" ").filter((tag) => tag.startsWith("#")) : [];
      this.priority = columns[8] || undefined;
      this.recurs = columns[9] || undefined;
      this.created = columns[10] || undefined;
      this.completed = columns[11] || undefined;
    } catch (error) {
      throw new TaskParseError(`Failed to parse task line: ${error.message}`);
    }
  }

  validate(): TaskValidationResult {
    const errors: string[] = [];

    if (!this.text.trim()) {
      errors.push("Task text is required");
    }

    if (this.tags.some(tag => !tag.startsWith("#"))) {
      errors.push("All tags must start with #");
    }

    if (this.priority && !["low", "medium", "high"].includes(this.priority)) {
      errors.push("Priority must be low, medium, or high");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toMarkdownLine(): string {
    const validation = this.validate();
    if (!validation.isValid) {
      throw new TaskValidationError(`Invalid task: ${validation.errors.join(", ")}`);
    }

    const tagsString = this.tags.join(" ");
    const projectLinkFormatted = this.projectLink ? `[[${this.projectLink}]]` : "";

    return `|${this.status}|${this.text}|${this.schedule || ""}|${this.start || ""}|${
      this.end || ""}|${this.occurrence || ""}|${projectLinkFormatted}|${tagsString}|${
      this.priority || ""}|${this.recurs || ""}|${this.created || ""}|${this.completed || ""}|`;
  }

  async insertTaskInFile(): Promise<void> {
    if (!this.created) {
      this.created = new Date().toISOString();
    }

    const validation = this.validate();
    if (!validation.isValid) {
      throw new TaskValidationError(`Cannot insert invalid task: ${validation.errors.join(", ")}`);
    }

    this.file = await this.ensureExistAndReturnFile();
    await this.app.vault.append(this.file, `\n${this.toMarkdownLine()}`);
  }

  private async ensureExistAndReturnFile(): Promise<TFile> {
    const { filePathFormatted, folderPath } = Tasks.retrieveFilePath(this.app);

    try {
      console.log("try creating folder");
      await this.app.vault.createFolder(folderPath);
    } catch (error) {
      if (!error.message.includes("Folder already exists")) throw error;
    }

    try {
      console.log("try creating file");
      await this.app.vault.create(filePathFormatted, Task.TABLE_HEADER);
    } catch (error) {
      if (!error.message.includes("File already exists")) throw error;
    }

    const file = this.app.vault.getFileByPath(filePathFormatted);
    if (!file) throw new TaskFileError("Failed to create or find task file");

    return file;
  }

  // Comparison methods
  compareTo(other: Task): number {
    // Default comparison by date, then priority
    if (this.schedule && other.schedule) {
      const dateComparison = this.schedule.localeCompare(other.schedule);
      if (dateComparison !== 0) return dateComparison;
    }

    const priorityValues: { [key: string]: number } = { high: 3, medium: 2, low: 1 };
    const thisPriority = this.priority && this.priority in priorityValues ? priorityValues[this.priority] : 0;
    const otherPriority = other.priority && other.priority in priorityValues ? priorityValues[other.priority] : 0;
    
    return otherPriority - thisPriority;
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

      const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      const displayedValues = [
        "⚡ Today",
        `📅 Tomorrow ${getDayDate('tomorrow')}`,
        "🤷 No date yet",
        "✏️ Personalized",
        ...daysOfWeek.map(day => `🕔 Next ${day.charAt(0).toUpperCase() + day.slice(1)} (${getDayDate(day as DayName)})`)
      ];

      const usedValues = [
        getDayDate('today'),
        getDayDate('tomorrow'),
        "",
        async () => await new dateModal(app).open(),
        ...daysOfWeek.map(day => getDayDate(day as DayName))
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
          await modal.pressNext();
        }
      })
    }

    const askStart = async (contentEl: typeof modal.contentEl) => {
      if (!task.schedule) return await modal.pressNext()

      const now = timeNow()
      modal.setTitle("Choose start time");
      modal.setDescription("Actual time: " + now)


      const timeIntervals = [5, 10, 15, 20, 25, 30, 45, 60];
      const displayedValues = [
        "⚡ Now",
        "🤷 No date yet",
        "✏️ Personalized",
        ...timeIntervals.map(minutes => `🕔 In ${minutes} minutes (${timeFromDurationAndStartTime(now, minutes, "after")})`),
        ...timeIntervals.map(minutes => `⌛ ${minutes} minutes ago (${timeFromDurationAndStartTime(now, minutes, "before")})`)
      ];

      const usedValues = [
        now,
        "",
        async () => await new timeModal(app).open(),
        ...timeIntervals.map(minutes => timeFromDurationAndStartTime(now, minutes, "after")),
        ...timeIntervals.map(minutes => timeFromDurationAndStartTime(now, minutes, "before"))
      ];

      addAutocompleteSelect(contentEl, {
        suggestions: {
          displayedValues: displayedValues,
          usedValues: usedValues
        },
        onSelected: async (usedValue) => {
          if (typeof usedValue === 'function') {
            task.start = await usedValue();
          } else {
            task.start = usedValue;
          }
          await modal.pressNext();
        }
      })
    }

    const askEnd = async (contentEl: typeof modal.contentEl) => {
      if (!task.schedule || !task.start) return modal.pressDone()

      const now = moment().format("HH:mm");
      const isStartAfterNow = isTimeAfterTime(task.start, now)
      const isStartIsNow = task.start === now
      
      modal.setTitle("Choose end time");
      modal.setDescription(`Actual time ${now === task.start ? `and task start time: ${task.start}` : `${now} \nTask start time: ${task.start}`}`)

      const timeIntervals = [5, 10, 15, 20, 25, 30, 45, 60];
      const displayedValues = [
        "🤷 No date yet",
        "✏️ Personalized",
        ...timeIntervals.map(minutes => `🕔 ${minutes} minutes after task begin (${timeFromDurationAndStartTime(task.start || "", minutes, "after")})`),
      ];

      const usedValues = [
        "",
        async () => await new timeModal(app).open(),
        ...timeIntervals.map(minutes => timeFromDurationAndStartTime(task.start || "", minutes, "after")),
      ];

      if (!isStartAfterNow && !isStartIsNow) {
        displayedValues.unshift("⚡ Now")
        usedValues.unshift(now)
      }

      addAutocompleteSelect(contentEl, {
        suggestions: {
          displayedValues: displayedValues,
          usedValues: usedValues
        },
        onSelected: async (usedValue) => {
          if (typeof usedValue === 'function') {
            task.end = await usedValue();
          } else {
            task.end = usedValue;
          }
          modal.pressDone();
        }
      })
    }

    modal.pages = [
      askText,
      askProject,
      askDate,
      askStart,
      askEnd
    ]

    await modal.open()
    await task.insertTaskInFile()
  }
}