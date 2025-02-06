import { App } from "obsidian";
import { UserInputModal } from "./userInputModal";
import { addButtonComponent } from "../components/button";

export class AlertModal extends UserInputModal {
  constructor(app: App) {
    super(app);
    
    this.setTitle("Confirmation Required ⚠️");
    this.setDescription("You are about to perform an irreversible action.");

    const buttons = this.contentEl.createDiv({
      attr: {
        style: "display: flex; align-items: center; gap: 0.5rem; justify-content: end"
      }
    })

    addButtonComponent(buttons, {
      text: "Cancel",
      isPrimary: true,
      onClick: () => {
        this.complete(false)
      }
    })
    addButtonComponent(buttons, {
      text: "Continue",
      onClick: () => {
        this.complete(true)
      }
    })
  }
}