import { App } from "obsidian";
import Task from "src/classes/task/task";
import { createTagField } from "../elements/tagField";
import { createEndField } from "../elements/endField";
import { createScheduleField } from "../elements/scheduleField";
import { createStartField } from "../elements/startField";

export const createSecondLine = (app: App, task: Task, container: HTMLElement) => {
  const secondLine = container.createDiv({ cls: "second-line" });

  const dateContainer = secondLine.createDiv({ cls: "date-container" })
  createScheduleField({ app, container: dateContainer, task, allowClick: true });
  createStartField({ app, container: dateContainer, task, allowClick: true });
  createEndField({ app, container: dateContainer, task, allowClick: true });

  const tagsContainer = secondLine.createDiv({ cls: "tags-container" })
  createTagField({ app, container: tagsContainer, task, allowClick: true });
}