import { App, Modal } from "obsidian";

/**
 * Base class for modals that return a value asynchronously.
 */
export class UserInputModal<T> extends Modal {
  private resolvePromise!: (value: T | null) => void;
  protected description?: HTMLDivElement;

  constructor(app: App) {
    super(app);
  }

  async open(): Promise<T | null> {
    return new Promise((resolve) => {
      this.resolvePromise = resolve;
      super.open();
    });
  }

  complete(value: T) {
    this.resolvePromise(value);
    this.close();
  }

  protected createHeader(): void {
    this.description = this.modalEl.createDiv();
    Object.assign(this.description.style, { margin: "0", marginTop: "0" });
    this.modalEl.insertBefore(this.description, this.modalEl.firstChild);
    
    Object.assign(this.titleEl.style, { margin: "0", marginTop: "8px" });
    this.modalEl.insertBefore(this.titleEl, this.modalEl.firstChild);
  }

  protected setDescription(text: string): void {
    this.description?.setText(text);
  }
}
