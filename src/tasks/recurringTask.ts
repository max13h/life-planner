import { dateNow, timeNow } from "src/utils/time";
import Task from "./task";
import { AppWithPlugin } from "types";

export class RecurringTask extends Task {
  constructor(app: AppWithPlugin) {
    super(app)

    this.schedule = dateNow()
    this.start = timeNow()
  }

  static retrieveFilePath(app: AppWithPlugin) {
    const settings = app.plugins.plugins["life-planner"].settings;

    const folderPath = settings.tasksFolder.endsWith('/') ? settings.tasksFolder : settings.tasksFolder + '/';
    const fileName = settings.recurringTasksFile.startsWith('/') ? settings.recurringTasksFile.slice(1) : settings.recurringTasksFile;
    const filePathFormatted = folderPath + fileName + ".md";

    return { folderPath, fileName, filePathFormatted }
  }
}