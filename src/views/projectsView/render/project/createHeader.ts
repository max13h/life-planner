import { WorkspaceLeaf } from "obsidian"
import { listenClick, listenOverAndOut } from "src/ui/html"
import { ProjectViewObject } from "types"

export const createHeader = ({ projectContainer, projectObject, leaf, h}: { projectContainer: HTMLElement, projectObject: ProjectViewObject, leaf: WorkspaceLeaf, h: number }) => {
  const header = projectContainer.createEl(`h${h}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6", { 
    text: projectObject.file.basename, 
    attr: { 
      style: `
        cursor: pointer;
        margin: 0;
        font-style: underline;
        font-size: clamp(1rem, 3vw, 1.5rem);
        ${
          !projectObject.tasks.length ? `
            font-size: 1rem;
            opacity: 0.5;
          ` : ""
        }
      ` 
    } 
  })
  listenClick(header, () => leaf.openFile(projectObject.file))
  listenOverAndOut(header, () => header.style.color = "hsl(var(--accent-h), var(--accent-s), var(--accent-l))", () => header.style.color = "")
}