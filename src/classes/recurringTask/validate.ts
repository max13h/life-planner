import { TaskValidationResult } from "types";
import { TaskValidationError } from "errors";
import { ensureInstanceOfRecurringTask, RecurringTask } from "./recurringTask";

export function validate(this: RecurringTask, isStrict: boolean = false, message?: string): TaskValidationResult {
  ensureInstanceOfRecurringTask(this)

  const errors: string[] = [];

  if (!this.text.trim()) {
    errors.push("this text is required");
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