import { addButtonComponent } from "src/utils/components/button";
import { addInputComponent } from "src/utils/components/input";
import { UserInputModal } from "src/modals/userInputModal";
import { listenClick, listenKeyEnter, listenKeyUp } from "src/utils/html";
import { openOrCreateFile } from "src/utils/openOrCreateFile";
import { AppWithPlugin } from "types";

export class Project {
  private app: AppWithPlugin
  private name: string | undefined;
  private path: string | undefined

  constructor(app: AppWithPlugin, name?: string) {
    this.app = app
    this.name = name

    this.ensurePath()
  }

  static async new(app: AppWithPlugin) {
    const project = new Project(app);
    const modal = new UserInputModal(app);
    modal.setTitle("Insert name of the new project");

    const input = addInputComponent(modal.contentEl, {
      onEnter: () => modal.complete(null),
      onKeyUp: () => project.setName(input.value)
    });

    const button = addButtonComponent(modal.contentEl, {
        text: "Done",
        style: "margin-top: 1rem; margin-left: auto; display: block",
        isPrimary: true
    });
    listenClick(button, () => modal.complete(null));

    await modal.open();

    await project.createAndOpenFile()
  }

  async createAndOpenFile() {
    if (!this.path) throw new Error("Unable to create project file");

    const settings = this.app.plugins.plugins["life-planner"].settings;

    await openOrCreateFile(this.app, this.path, "source", settings.projectsTemplatePath)
  }

  setName(name: string) {
    this.name = name
    this.ensurePath()
  }

  private ensurePath() {
    if (this.name) this.path = this.retrieveFilePath().filePathFormatted
  }

  private retrieveFilePath() {
    const settings = this.app.plugins.plugins["life-planner"].settings;

    const folderPath = settings.projectsFolder.endsWith('/') ? settings.projectsFolder : settings.projectsFolder + '/';
    const fileName = this.name?.startsWith('/') ? this.name?.slice(1) : this.name;
    const filePathFormatted = folderPath + fileName + ".md";

    return { folderPath, fileName, filePathFormatted }
  }
}