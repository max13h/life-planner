import { App, Modal } from "obsidian";

/**
 * Base class for modals that return a value asynchronously.
 */
export class UserInputModal<T = any> extends Modal {
  private resolvePromise!: (value: T | null) => void;
  protected description?: HTMLDivElement;

  constructor(app: App) {
    super(app);
    this.createHeader()

    this.modalEl.addClass("lp-view")
  }

  async open(): Promise<T | null> {
    return new Promise((resolve) => {
      this.resolvePromise = resolve;
      super.open();
    });
  }

  complete(value: T | null) {
    this.resolvePromise(value);
    this.close();
  }

  protected createHeader(): void {
    this.description = this.modalEl.createDiv({ attr: { style: "white-space: pre-line;" } });
    Object.assign(this.description.style, { margin: "0", marginTop: "0" });
    this.modalEl.insertBefore(this.description, this.modalEl.firstChild);
    
    Object.assign(this.titleEl.style, { margin: "0", marginTop: "8px" });
    this.modalEl.insertBefore(this.titleEl, this.modalEl.firstChild);
  }

  setDescription(text: string): void {
    this.description?.setText(text);
  }
}