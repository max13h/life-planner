import { App } from "obsidian";
import { UserInputModal } from "./userInputModal";
import { listenKeyEnter, listenKeyUp } from "src/utils/html";
import { addButtonComponent } from "./components/button";
import { moment } from "obsidian";

export class dateModal extends UserInputModal {
  protected previousValueOfInput: string | undefined;

  constructor(app: App) {
    super(app);
    this.setTitle("Choose date");

    const container = this.contentEl.createDiv({ attr: { style: "display: flex; align-items: center; gap: 4px; width: 100%" } })
    const year = container.createEl("input", { attr: { type: "number", placeholder: "YYYY", style: "width: 4rem", max: 4 } })
    year.value = new Date().getFullYear().toString()
    year.focus()
    const month = container.createEl("input", { attr: { type: "number", placeholder: "MM", style: "width: 3rem", max: 2 } })
    const day = container.createEl("input", { attr: { type: "number", placeholder: "DD", style: "width: 3rem", max: 2 } })

    listenKeyUp(year, () => {
      if (year.value.length === 4) month.focus()
    })
    listenKeyUp(month, (event) => {
      if (month.value.length === 2) day.focus()

      if ((event?.key === "Backspace") && (month.value === "")) {
        year.value = year.value.slice(0, -1);
        year.focus();
      }
    })
    listenKeyUp(day, (event) => {
      if ((event?.key === "Backspace") && (day.value === "")) { 
        month.value = month.value.slice(0, -1);
        month.focus()
      }
    })
    listenKeyEnter(day, () => this.userSaysDone(year, month, day))

    addButtonComponent(this.contentEl, {
      isPrimary: true,
      text: "Done",
      style: "margin-left: auto; margin-top: 8px; display: block;",
      onClick: () => this.userSaysDone(year, month, day)
    })
  }

  userSaysDone(year: HTMLInputElement, month: HTMLInputElement, day: HTMLInputElement) {
    const formattedDate = `${year.value}-${month.value}-${day.value}`
    const momentDate = moment(formattedDate, "YYYY-MM-DD")

    if (momentDate.isValid()) {
      this.complete(formattedDate)
    } else {
      year.style.borderColor = "red"
      month.style.borderColor = "red"
      day.style.borderColor = "red"
    }
  }
}