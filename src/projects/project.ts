import { addInputComponent } from "src/ui/components/input";
import { openOrCreateFile } from "src/utils/openOrCreateFile";
import { AppWithPlugin } from "types";
import { NavigationModal } from "src/ui/modals/navigationModal";
import { addAutocompleteSelect } from "src/ui/components/suggester";
import { TimeType } from "types";

export class Project {
  private app: AppWithPlugin
  name: string | undefined;
  path: string | undefined
  timeType: TimeType | undefined

  constructor(app: AppWithPlugin, name?: string, timeType?: TimeType) {
    this.app = app
    this.name = name
    this.timeType = timeType


    this.ensurePath()
  }

  static async new(app: AppWithPlugin) {
    const project = new Project(app);
    const modal = new NavigationModal(app);
    
    const askName = () => {
      modal.setTitle("Insert name of the new project");

      const input = addInputComponent(modal.contentEl, {
        onEnter: async () => await modal.pressNext(),
        onKeyUp: () => project.setName(input.value)
      });
    }

    const askTimeType = () => {
      modal.setTitle("Choose time type of the new project");

      const settings = app.plugins.plugins["life-planner"].settings;
      const timeTypeList = settings.timeTypesList as TimeType[]

      addAutocompleteSelect(modal.contentEl, {
        suggestions: {
          displayedValues: timeTypeList.map(el => el.name),
          usedValues: timeTypeList
        },
        onSelected: (selected) => {
          project.timeType = selected
          modal.complete(null)
        }
      })
    }

    modal.pages = [
      askName,
      askTimeType
    ]
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