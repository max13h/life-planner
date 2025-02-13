import { NavigationModal } from "src/ui/modals/navigationModal";
import { Project } from "../project";
import { Projects } from "src/classes/projects/projects";
import { addAutocompleteSelect } from "src/ui/components/suggester";

export async function askParentProject(modal: NavigationModal, project: Project, isLast: boolean = false) {
  return async (contentEl: typeof modal.contentEl) => {
    modal.setTitle("Choose parent project of the new project");

    const projects = await Projects.getFiles(this.app)

    addAutocompleteSelect(contentEl, {
      focus: true,
      suggestions: {
        displayedValues: projects.map(el => el.basename),
        usedValues: projects.map(el => el.path)
      },
      onSelected: async (selected: string) => {
        project.parentProjectPath = selected
        if (!project.parentProjectPath) return;
        
        if (isLast) {
          modal.pressDone()  
        } else {
          await modal.pressNext()
        }
      },
    })
  };
}