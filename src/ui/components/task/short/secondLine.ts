import { App } from "obsidian";
import Task from "src/classes/task/task";
import { createTagField } from "../elements/tagField";
import { createEndField } from "../elements/endField";
import { createScheduleField } from "../elements/scheduleField";
import { createStartField } from "../elements/startField";

export const createSecondLine = (app: App, task: Task, container: HTMLElement) => {
  const secondLine = container.createDiv({
    attr: {
      style: `
        display: flex;
        gap: 4px;
        align-items: center;
        justify-content: space-between;
      `
    }
  });

  const dateWrapper = secondLine.createDiv({
    attr: {
      style: `
        display: flex;
        align-items: center;
        gap: 4px;
        flex-wrap: wrap;
      `
    }
  })
  createScheduleField({ app, container: dateWrapper, task, allowClick: true });
  createStartField({ app, container: dateWrapper, task, allowClick: true });
  createEndField({ app, container: dateWrapper, task, allowClick: true });

  const otherWrapper = secondLine.createDiv({
    attr: {
      style: `
        display: flex;
        align-items: center;
        justify-content: end;
        gap: 4px;
        flex-wrap: wrap;
      `
    }
  })
  createTagField({ app, container: otherWrapper, task, allowClick: true });
}