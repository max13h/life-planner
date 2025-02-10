import { setIcon } from "obsidian"
import { listenClick } from "src/ui/html"

export const renderHeading = (viewContainer: HTMLElement, refreshView: () => Promise<void>) => {
  const headingContainer = viewContainer.createEl("hgroup", {
    attr: {
      style: `
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
      `
    }
  })
  headingContainer.createEl("h1", { text: "Projects"})
  const refreshButton = headingContainer.createSpan()

  setIcon(refreshButton, "refresh-ccw")
  listenClick(refreshButton, refreshView)
}