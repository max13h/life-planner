import { TaskValidationResult } from "types";
import { TaskValidationError } from "errors";
import { moment } from "obsidian";
import { RecurringTask, ensureInstanceOfRecurringTask } from "../recurringTask/recurringTask";
import Task, { ensureInstanceOfTask } from "../task/task";

export const validate = (task: Task | RecurringTask, isStrict: boolean = false, message?: string): TaskValidationResult => {
  const errors: string[] = [];
  
  const isRecurring = task instanceof RecurringTask;
  const ensureInstance = isRecurring ? ensureInstanceOfRecurringTask : ensureInstanceOfTask;
  ensureInstance(task);

  validateCommonFields(task, errors);
  if (!isRecurring) validateTaskSpecificFields(task as Task, errors);

  if (isStrict && errors.length > 0) {
    throw new TaskValidationError(`${message ? message + "\n" : ""}Invalid task: ${errors.join(", ")}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

const validateCommonFields = (task: Task | RecurringTask, errors: string[]) => {
  if (!task.text.trim()) {
    errors.push("Text is required");
  } else if (task.text.includes('#')) {
    errors.push("Text should not have '#'");
  }

  if (task.projectLink && !/^\[\[[^\[\]]+\.md\]\]$/.test(task.projectLink)) {
    errors.push("ProjectLink must be in format like [[exemple.md]] or [[exemple/.../exemple.md]]");
  }

  if (task.tags.some(tag => !tag.startsWith("#"))) {
    errors.push("All tags must start with #");
  }

  if (task.priority && !["low", "medium", "high"].includes(task.priority)) {
    errors.push("Priority must be low, medium, or high");
  }
}

const validateTaskSpecificFields = (task: Task, errors: string[]) => {
  if (!task.id) {
    errors.push("Task should have an ID")
  }

  if (![" ", "x", "/", "-"].includes(task.status)) {
    errors.push("Status must be ' ' or 'x' or '/' or '-'");
  } else if (task.status === "x" && !task.completed) {
    errors.push("A completed task should have a completed date");
  }

  if (task.schedule && !moment(task.schedule, "YYYY-MM-DD").isValid()) {
    errors.push(`Schedule must be in format ${"YYYY-MM-DD"}`);
  }

  if (task.start && !moment(task.start, "HH:mm").isValid()) {
    errors.push(`Start must be in format "HH:mm"`);
  }

  if (task.end && !moment(task.end, "HH:mm").isValid()) {
    errors.push(`End must be in format "HH:mm"`);
  }

  if ((!task.start && task.end) || (task.start && !task.end)) {
    errors.push("Both start and end times must be provided or neither should be");
  }

  if (task.occurrence && !/^\d+\/\d+$/.test(task.occurrence)) {
    errors.push("Occurrence must be in format like 1/2 or 16/37");
  }
}
