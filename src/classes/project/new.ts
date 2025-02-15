import { NavigationModal } from "src/ui/modals/navigationModal";
import { Project } from "./project";
import { AppWithPlugin } from "types";
import { askName } from "../utils/ask/project/askName";
import { askParentProject } from "../utils/ask/project/askParentProjects";

export async function createProject(app: AppWithPlugin) {
  const project = new Project(app as AppWithPlugin)
  const modal = new NavigationModal(app)


  modal.pages = [
    await askName(modal, project),
    await askParentProject(modal, project),
  ]

  await modal.open()
  await project.createAndOpenFile()
}