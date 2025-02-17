import { App } from "obsidian";
import Task from "src/classes/task/task";
import { createTagField } from "../elements/tagField";
import { createEndField } from "../elements/endField";
import { createScheduleField } from "../elements/scheduleField";
import { createStartField } from "../elements/startField";
import { createCreatedField } from "../elements/createdField";
import { createOccurenceField } from "../elements/occurenceField";
import { createPriorityField } from "../elements/priorityField";

export const createOtherLines = (app: App, task: Task, container: HTMLElement) => {
  const otherLines = container.createDiv({ cls: "other-lines" });

  const dateContainer = otherLines.createDiv({ cls: "line" })
  createScheduleField({ app, container: dateContainer, task, allowClick: true });
  createStartField({ app, container: dateContainer, task, allowClick: true });
  createEndField({ app, container: dateContainer, task, allowClick: true });

  const tagsContainer = otherLines.createDiv({ cls: "line" })
  createTagField({ app, container: tagsContainer, task, allowClick: true });

  const metadataContainer = otherLines.createDiv({ cls: "line" })
  createCreatedField({ container: metadataContainer, task })
  createOccurenceField({ container: metadataContainer, task, allowClick: true })
  createPriorityField({ app, container: metadataContainer, task })

}