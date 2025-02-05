import Task, { ensureInstanceOfTask } from "./task";

export function update(this: Task, updates: Partial<Pick<Task, 'status' | 'text' | 'tags' | 'priority' | 'schedule' | 'start' | 'end' | 'occurrence' | 'projectLink' | 'recurs'>>) {
  ensureInstanceOfTask(this)

  Object.keys(updates).forEach(key => {
    if (key === "status") {
      if (this.status === " " && updates[key] === "x") this.completed = new Date().toISOString()
      if (this.status === "x" && updates[key] === " ") this.completed = undefined
    }
    (this[key as keyof typeof updates] as any) = updates[key as keyof typeof updates];
  });

  this.validate(true, "Cannot update with invalid task properties");

  return this;
}