import { Project } from "src/projects/project";
import { NavigationModal } from "src/ui/modals/navigationModal";
import { AppWithPlugin } from "types";

export const newProject = async (app: AppWithPlugin) => {
  const project = new Project(app);
  const modal = new NavigationModal(app);
  
  modal.pages = [
    async () => (await project.ask()).name(modal),
    async () => (await project.ask()).parentProject(modal),
  ]
  await modal.open();

  await project.createAndOpenFile()
}