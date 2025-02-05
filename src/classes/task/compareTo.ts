import Task, { ensureInstanceOfTask } from "./task";

export function compareTo(other: Task): number {
  ensureInstanceOfTask(this)

  if (this.schedule && other.schedule) {
    const dateComparison = this.schedule.localeCompare(other.schedule);
    if (dateComparison !== 0) return dateComparison;
  }

  const priorityValues: { [key: string]: number } = { high: 3, medium: 2, low: 1 };
  const thisPriority = this.priority && this.priority in priorityValues ? priorityValues[this.priority] : 0;
  const otherPriority = other.priority && other.priority in priorityValues ? priorityValues[other.priority] : 0;
  
  return otherPriority - thisPriority;
}