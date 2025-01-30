import { App } from "obsidian";
import { UserInputModal } from "./userInputModal";
import { addButtonComponent } from "./components/button";

/**
 * A modal that supports step-based navigation through multiple pages.
 */
export class NavigationModal<T> extends UserInputModal<T> {
  protected pages: ((contentEl: HTMLElement) => void)[] = [];
  private actualPage: number = 0;
  private previousButton!: HTMLButtonElement;
  private nextButton!: HTMLButtonElement;
  private doneButton!: HTMLButtonElement;

  constructor(app: App) {
    super(app);
  }

  onOpen() {
    this.createHeader();
    this.createNavigationButtons();
    this.updateNavigation();
  }

  private createNavigationButtons(): void {
    this.previousButton = addButtonComponent(this.containerEl, { icon: "chevron-left" });
    this.nextButton = addButtonComponent(this.containerEl, { text: "Suivant", style: "margin-left: auto; margin-top: 1rem" });
    this.doneButton = addButtonComponent(this.containerEl, { text: "Terminer", isPrimary: true, style: "margin-left: auto; margin-top: 1rem;" });

    this.modalEl.insertBefore(this.previousButton, this.modalEl.firstChild);
    this.modalEl.insertAfter(this.nextButton, this.contentEl);
    this.modalEl.insertAfter(this.doneButton, this.contentEl);
  }

  protected updateNavigation(): void {
    if (this.pages.length === 0) throw new Error("No pages provided");

    this.previousButton.disabled = this.actualPage === 0;
    this.previousButton.style.visibility = this.previousButton.disabled ? "hidden" : "";
    this.nextButton.style.display = this.actualPage === this.pages.length - 1 ? "none" : "block";
    this.doneButton.style.display = this.actualPage === this.pages.length - 1 ? "block" : "none";
    
    this.setTitle("")
    this.setDescription("")
    this.contentEl.empty();
    this.pages[this.actualPage](this.contentEl);
  }

  pressPrevious() {
    if (this.actualPage > 0) {
      this.actualPage--;
      this.updateNavigation();
    }
  }

  pressNext() {
    if (this.actualPage < this.pages.length - 1) {
      this.actualPage++;
      this.updateNavigation();
    }
  }

  pressDone() {
    this.complete(null as unknown as T); // Finalize modal with a value
  }
}
