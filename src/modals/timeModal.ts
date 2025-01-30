import { App } from "obsidian";
import { UserInputModal } from "./userInputModal";
import { listenKeyEnter, listenKeyUp } from "src/utils/html";
import { addButtonComponent } from "./components/button";
import { moment } from "obsidian";

export class timeModal extends UserInputModal {
  protected previousValueOfInput: string | undefined;

  constructor(app: App) {
    super(app);
    this.setTitle("Choose time");

    const container = this.contentEl.createDiv({ attr: { style: "display: flex; align-items: center; gap: 4px; width: 100%" } })
    const hours = container.createEl("input", { attr: { type: "number", placeholder: "HH", style: "width: 3rem", max: 2 } })
    hours.focus()
    const minutes = container.createEl("input", { attr: { type: "number", placeholder: "mm", style: "width: 3rem", max: 2 } })

    listenKeyUp(hours, () => {
      if (hours.value.length === 2) minutes.focus()
    })
    listenKeyUp(minutes, (event) => {
      if ((event?.key === "Backspace") && (minutes.value === "")) { 
        hours.value = hours.value.slice(0, -1);
        hours.focus()
      }
    })
    listenKeyEnter(minutes, () => this.userSaysDone(hours, minutes))

    addButtonComponent(this.contentEl, {
      isPrimary: true,
      text: "Done",
      style: "margin-left: auto; margin-top: 8px; display: block;",
      onClick: () => this.userSaysDone(hours, minutes)
    })
  }

  userSaysDone(hours: HTMLInputElement, minutes: HTMLInputElement) {
    const formattedHour = `${hours.value}:${minutes.value}`
    const momentDate = moment(formattedHour, "HH:mm")

    if (momentDate.isValid()) {
      this.complete(formattedHour)
    } else {
      hours.style.borderColor = "red"
      minutes.style.borderColor = "red"
    }
  }
}