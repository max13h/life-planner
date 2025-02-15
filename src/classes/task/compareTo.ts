import Task, { ensureInstanceOfTask } from "./task";

export const compareTo = (task: Task, other: Task): number => {
  ensureInstanceOfTask(task)

  if (task.schedule && other.schedule) {
    const dateComparison = task.schedule.localeCompare(other.schedule);
    if (dateComparison !== 0) return dateComparison;
  }

  const priorityValues: { [key: string]: number } = { high: 3, medium: 2, low: 1 };
  const taskPriority = task.priority && task.priority in priorityValues ? priorityValues[task.priority] : 0;
  const otherPriority = other.priority && other.priority in priorityValues ? priorityValues[other.priority] : 0;
  
  return otherPriority - taskPriority;
}