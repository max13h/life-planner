import { ensureInstanceOfRecurringTask, RecurringTask } from "./recurringTask";

export function update(this: RecurringTask, updates: Partial<Pick<RecurringTask, 'text' | 'tags' | 'priority' | 'projectLink'>>) {
  ensureInstanceOfRecurringTask(this)

  Object.keys(updates).forEach(key => {
    if (key === "projectLink" && updates["projectLink"]) {
      if (/^\[\[[^\[\]]+\.md\]\]$/.test(updates["projectLink"])) {
        this.projectLink = updates["projectLink"];
      } else {
        this.projectLink = `[[${updates["projectLink"].replace(/\.md$/, '')}.md]]`;
      }
      return
    }

    (this[key as keyof typeof updates] as any) = updates[key as keyof typeof updates];
  });

  this.validate(true, "Cannot update with invalid recurring task properties");
  return this;
}