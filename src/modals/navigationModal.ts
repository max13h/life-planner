import { App } from "obsidian";
import { UserInputModal } from "./userInputModal";
import { addButtonComponent } from "./components/button";
import { listenClick } from "src/utils/html";

export class NavigationModal extends UserInputModal {
  pages: ((contentEl: HTMLElement) => Promise<void> | void)[] = [];
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
    listenClick(this.previousButton, () => this.pressPrevious())

    this.nextButton = addButtonComponent(this.containerEl, { text: "Suivant", style: "margin-left: auto; margin-top: 1rem" });
    listenClick(this.nextButton, () => this.pressNext())

    this.doneButton = addButtonComponent(this.containerEl, { text: "Terminer", isPrimary: true, style: "margin-left: auto; margin-top: 1rem;" });
    listenClick(this.doneButton, () => this.pressDone())

    this.modalEl.insertBefore(this.previousButton, this.modalEl.firstChild);
    this.modalEl.insertAfter(this.nextButton, this.contentEl);
    this.modalEl.insertAfter(this.doneButton, this.contentEl);
  }

  protected async updateNavigation(): Promise<void> {
    if (this.pages.length === 0) throw new Error("No pages provided");

    this.previousButton.disabled = this.actualPage === 0;
    this.previousButton.style.visibility = this.previousButton.disabled ? "hidden" : "";
    this.nextButton.style.display = this.actualPage === this.pages.length - 1 ? "none" : "block";
    this.doneButton.style.display = this.actualPage === this.pages.length - 1 ? "block" : "none";
    
    this.setTitle("")
    this.setDescription("")
    this.contentEl.empty();
    
    await this.pages[this.actualPage](this.contentEl);
  }

  async pressPrevious() {
    if (this.actualPage > 0) {
      this.actualPage--;
      await this.updateNavigation();
    }
  }

  async pressNext() {
    if (this.actualPage < this.pages.length - 1) {
      this.actualPage++;
      await this.updateNavigation();
    }
  }

  pressDone() {
    this.complete(null); // Finalize modal with a value
  }
}
