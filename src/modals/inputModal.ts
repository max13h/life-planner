import { App, Modal } from "obsidian";

/**
 * Base class for modals that return a value asynchronously.
 */
export class InputModal<T> extends Modal {
  private resolvePromise!: (value: T | null) => void;
  protected title: string = "";
  protected description?: string;

  constructor(app: App, title?: string, description?: string) {
    super(app);
    this.title = title || "";
    this.description = description;
  }

  async open(): Promise<T | null> {
    return new Promise((resolve) => {
      this.resolvePromise = resolve;
      super.open();
    });
  }

  protected complete(value: T) {
    this.resolvePromise(value);
    this.close();
  }

  protected createHeader(): void {
    if (this.description) {
      const descriptionEl = this.modalEl.createEl("span", { text: this.description });
      Object.assign(descriptionEl.style, { margin: "1rem", marginTop: "0.4rem" });
      this.modalEl.insertBefore(descriptionEl, this.modalEl.firstChild);
    }
    if (this.title) {
      this.setTitle(this.title);
      Object.assign(this.titleEl.style, { margin: "1rem", marginBottom: "0" });
      this.modalEl.insertBefore(this.titleEl, this.modalEl.firstChild);
    }
  }
}
