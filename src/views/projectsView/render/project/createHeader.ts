import { TFile, WorkspaceLeaf } from "obsidian"
import { listenClick, listenOverAndOut } from "src/ui/html"

export const createHeader = ({ projectContainer, file, leaf, h}: { projectContainer: HTMLElement, file: TFile, leaf: WorkspaceLeaf, h: number }) => {
  const header = projectContainer.createEl(`h${h}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6", { text: file.basename, attr: { style: "cursor: pointer;" } })
    listenClick(header, () => leaf.openFile(file))
    listenOverAndOut(header, () => header.style.color = "hsl(var(--accent-h), var(--accent-s), var(--accent-l))", () => header.style.color = "")
}