import { App } from "obsidian";
import { UserInputModal } from "./userInputModal";
import { addButtonComponent } from "../components/button";

export class AlertModal extends UserInputModal {
  constructor(app: App) {
    super(app);
    
    this.setTitle("Confirmation Required ⚠️");
    this.setDescription("You are about to perform an irreversible action.");

    this.modalEl.addClass("alert-modal")

    const buttonsContainer = this.contentEl.createDiv({ cls: "buttons-container" })

    addButtonComponent(buttonsContainer, {
      text: "Cancel",
      isPrimary: true,
      onClick: () => {
        this.complete(false)
      }
    })
    addButtonComponent(buttonsContainer, {
      text: "Continue",
      onClick: () => {
        this.complete(true)
      }
    })
  }
}