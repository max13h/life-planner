import { App, setIcon } from "obsidian";
import { InputModal } from "./inputModal";

/**
 * A modal that supports step-based navigation through multiple pages.
 */
export class NavigationModal<T> extends InputModal<T> {
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
    this.previousButton = this.createButton("", "chevron-left", this.pressPrevious.bind(this));
    this.nextButton = this.createButton("Suivant", undefined, this.pressNext.bind(this), "margin-left: auto;");
    this.doneButton = this.createButton("Terminer", undefined, this.pressDone.bind(this), "margin-left: auto; background-color: hsla(var(--accent-h) var(--accent-s) var(--accent-l) / 0.3");

    this.modalEl.insertBefore(this.previousButton, this.modalEl.firstChild);
    this.modalEl.insertAfter(this.nextButton, this.contentEl);
    this.modalEl.insertAfter(this.doneButton, this.contentEl);
  }

  private createButton(text: string, icon: string | undefined, onClick: () => void, style?: string): HTMLButtonElement {
    const button = this.containerEl.createEl("button", {
      text: text,
      attr: { style: `width: fit-content; box-shadow: none; ${style}` },
    });
    if (icon) setIcon(button, icon);
    button.onClickEvent(onClick);
    return button;
  }

  protected updateNavigation(): void {
    if (this.pages.length === 0) throw new Error("No pages provided");

    this.previousButton.disabled = this.actualPage === 0;
    this.previousButton.style.visibility = this.previousButton.disabled ? "hidden" : "";
    this.nextButton.style.display = this.actualPage === this.pages.length - 1 ? "none" : "block";
    this.doneButton.style.display = this.actualPage === this.pages.length - 1 ? "block" : "none";
    
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
