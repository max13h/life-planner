import { AppWithPlugin } from "types";
import { Projects } from "../projects/projects";
import { createProject } from "./new/new";
import { createAndOpenFile } from "./createAndOpenFile";

export class Project {
  app: AppWithPlugin
  name: string | undefined;
  path: string | undefined;
  parentProjectPath: string | undefined;

  constructor(app: AppWithPlugin, name?: string) {
    this.app = app
    this.name = name
    this.parentProjectPath = undefined
  }

  static async new(app: AppWithPlugin): Promise<void> {
    await createProject(app)
  }

  async createAndOpenFile(): Promise<void> {
    return createAndOpenFile.call(this); 
  }

  async setName(name: string) {
    this.name = name
    await this.setPath()
  }

  async setPath() {
    if (!this.name) return
    this.path = (await Projects.getMetadata(this.app, this.name)).filePathFormatted
  }
}

export const ensureInstanceOfProject = (projectInstance: any): void => {
  if (!(projectInstance instanceof Project)) throw new Error("Not instance of Project");
};