import { setIcon } from "obsidian"
import { listenClick } from "src/ui/html"

export const renderHeading = (viewContainer: HTMLElement, refreshView: () => Promise<void>) => {
  const headingContainer = viewContainer.createEl("hgroup")
  headingContainer.createEl("h1", { text: "Projects"})
  
  const refreshButton = headingContainer.createSpan({ cls: "cursor-pointer" })
  setIcon(refreshButton, "refresh-ccw")
  listenClick(refreshButton, refreshView)
}