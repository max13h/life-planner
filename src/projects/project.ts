import { AppWithPlugin } from "types";
import { getOrCreateFile, openFile } from "src/utils/vault";
import { Projects } from "./projects";
import { NavigationModal } from "src/ui/modals/navigationModal";
import { addInputComponent } from "src/ui/components/input";
import { addAutocompleteSelect } from "src/ui/components/suggester";

export class Project {
  private app: AppWithPlugin
  name: string | undefined;
  path: string | undefined;
  parentProjectPath: string | undefined;

  constructor(app: AppWithPlugin, name?: string) {
    this.app = app
    this.name = name
    this.parentProjectPath = undefined

    if (this.name) this.path = this.retrieveFilePath()
  }

  async ask() {
    return {
      name: async (pModal?: NavigationModal) => {
        const modal = pModal || new NavigationModal(this.app);
        modal.setTitle("Insert name of the new project");
  
        const input = addInputComponent(modal.contentEl, {
          onEnter: async () => await modal.pressNext(),
          onKeyUp: () => this.setName(input.value),
          focus: true
        });
      },
      parentProject: async (pModal?: NavigationModal) => {
        const projects = await Projects.getAllFiles(this.app)
  
        const modal = pModal || new NavigationModal(this.app);
        modal.setTitle("Choose time type of the new project");
  
        addAutocompleteSelect(modal.contentEl, {
          suggestions: {
            displayedValues: projects.map(el => el.name),
            usedValues: projects.map(el => el.path)
          },
          onSelected: (selected: string) => {
          this.parentProjectPath = selected
            modal.complete(null)
          },
          focus: true
        })
      }
    }
  }

  async createAndOpenFile() {
    if (!this.path) throw new Error("Unable to create project file");

    const settings = this.app.plugins.plugins["life-planner"].settings;

    const file = await getOrCreateFile(this.app, this.path, settings.projectsTemplatePath)
    if (!file) throw new Error("Not able to create file");

    if (this.parentProjectPath) {
      this.app.fileManager.processFrontMatter(file, (frontmatter) => {
        frontmatter['parent_project'] = `[[${this.parentProjectPath}]]`;
      });
    }

    await openFile(this.app, file, "source")
  }

  setName(name: string) {
    this.name = name
    if (this.name) this.path = this.retrieveFilePath()
  }

  retrieveFilePath() {
    const settings = this.app.plugins.plugins["life-planner"].settings;

    const folderPath = settings.projectsFolder.endsWith('/') ? settings.projectsFolder : settings.projectsFolder + '/';
    const fileName = this.name?.startsWith('/') ? this.name?.slice(1).replace(/\.md$/, '') : this.name?.replace(/\.md$/, '');
    const filePath = folderPath + fileName + ".md";

    return filePath
  }
}