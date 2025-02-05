import { TaskValidationResult } from "types";
import Task, { ensureInstanceOfTask } from "./task";
import { moment } from "obsidian";
import { TaskValidationError } from "errors";

export function validate(this: Task, isStrict: boolean = false, message?: string): TaskValidationResult {
  ensureInstanceOfTask(this)

  const errors: string[] = [];
  const settings = this.app.plugins?.plugins["life-planner"]?.settings || {};


  if (this.status !== " " && this.status !== "x" && this.status !== "/" && this.status !== "-") {
    errors.push("Status must be ' ' or 'x' or '/' or '-'");
  }

  if (!this.text.trim()) {
    errors.push("this text is required");
  }

  if (this.schedule && !moment(this.schedule, settings.dateFormat).isValid()) {
    errors.push(`Schedule must be in format ${settings.dateFormat}`);
  }

  if (this.start && !moment(this.start, "HH:mm").isValid()) {
    errors.push(`Start must be in format "HH:mm"`);
  }

  if (this.end && !moment(this.end, "HH:mm").isValid()) {
    errors.push(`End must be in format "HH:mm"`);
  }

  if (this.occurrence && !(/^\d+\/\d+$/.test(this.occurrence))) {
    errors.push("Occurrence must be in format like 1/2 or 16/37");
  }

  if (this.projectLink && !(/^\[\[[^\[\]]+\.md\]\]$/.test(this.projectLink))) {
    errors.push("ProjectLink must be in format like [[exemple.md]] or [[exemple/.../exemple.md]]");
  }

  if (this.tags.some((tag: string) => !tag.startsWith("#"))) {
    errors.push("All tags must start with #");
  }

  if (this.priority && !["low", "medium", "high"].includes(this.priority)) {
    errors.push("Priority must be low, medium, or high");
  }

  if (isStrict && errors.length > 0) {
    throw new TaskValidationError(`${message ? message + "\n" : ""}Invalid task: ${errors.join(", ")}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}