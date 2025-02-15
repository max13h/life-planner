import { addInputComponent } from "src/ui/components/input";
import { NavigationModal } from "src/ui/modals/navigationModal";
import { Project } from "../project";

export async function askName(modal: NavigationModal, project: Project, isLast: boolean = false) {
  return (contentEl: typeof modal.contentEl) => {
    modal.setTitle("Insert name of the new project");

    addInputComponent(contentEl, {
      focus: true,
      onKeyUp: async (input) => {
        await project.setName(input.value);
      },
      onEnter: async () => {
        if (!project.name) return;
        
        if (isLast) {
          modal.pressDone()  
        } else {
          await modal.pressNext()
        }
      },
      value: project.name,
    });
  };
}