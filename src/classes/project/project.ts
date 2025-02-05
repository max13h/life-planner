import { AppWithPlugin } from "types";
import { getOrCreateFile, openFile } from "src/utils/vault";
import { Projects } from "../projects/projects";
import { createProject } from "./new/new";
import { ProjectFileError } from "errors";

export class Project {
  private app: AppWithPlugin
  name: string | undefined;
  path: string | undefined;
  parentProjectPath: string | undefined;

  constructor(app: AppWithPlugin, name?: string) {
    this.app = app
    this.name = name
    this.parentProjectPath = undefined
  }

  static async new(app: AppWithPlugin) {
    await createProject(app)
  }

  async createAndOpenFile() {
    if (!this.path) throw new ProjectFileError("Unable to create project file");
    const settings = this.app.plugins.plugins["life-planner"].settings;

    const file = await getOrCreateFile(this.app, this.path, settings.projectsTemplatePath)
    if (!file) throw new Error("Not able to create file");

    this.app.fileManager.processFrontMatter(file, (frontmatter) => {
      if (this.parentProjectPath) frontmatter['parent_project'] = `[[${this.parentProjectPath}]]`;

      if (!frontmatter.tags || !frontmatter.tags.includes(settings.projectsTag)) {
        if (frontmatter.tags) {
          frontmatter.tags.push(settings.projectsTag)
        } else {
          frontmatter.tags = [settings.projectsTag.replace(/^#/, '')]
        }
      }
    });

    await openFile(this.app, file, "source")
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