export const renderHeading = (viewContainer: HTMLElement) => {
  const headingContainer = viewContainer.createEl("hgroup")
    headingContainer.createEl("h1", { text: "Projects"})
}