import { getOrCreateFile, openFile } from "src/utils/vault";
import { ensureInstanceOfProject, Project } from "./project";
import { ProjectFileError } from "errors";

export async function createAndOpenFile(this: Project): Promise<void> {
  ensureInstanceOfProject(this)
  
  if (!this.path) throw new ProjectFileError("Unable to create project file");
  const settings = this.app.plugins.plugins["life-planner"].settings;

  const file = await getOrCreateFile(this.app, this.path, settings.projects.templatePath)
  if (!file) throw new Error("Not able to create file");

  this.app.fileManager.processFrontMatter(file, (frontmatter) => {
    if (this.parentProjectPath) frontmatter['parent_project'] = `[[${this.parentProjectPath}]]`;

    if (!frontmatter.tags || !frontmatter.tags.includes(settings.projects.tag)) {
      if (frontmatter.tags) {
        frontmatter.tags.push(settings.projects.tag)
      } else {
        frontmatter.tags = [settings.projects.tag.replace(/^#/, '')]
      }
    }
  });

  await openFile(this.app, file, "source")
}