import { AutocompleteSelectOptions, Suggestions } from "types";

export class OptionsManager<T> {
  private currentFocusIndex = 0;
  private filteredValues: string[] = [];

  constructor(
    private readonly suggestions: Suggestions<T>,
    private readonly optionsList: HTMLUListElement,
    private readonly onItemSelect: (value: string, event: Event) => void,
    private readonly allow: AutocompleteSelectOptions<T>["allow"]
  ) {}

  updateOptions(filterText: string = ""): void {
    this.optionsList.empty();

    if (
      this.suggestions.displayedValues[0] === "Add blank value" 
      || this.suggestions.displayedValues[0].startsWith("Add new value: '")
    ) {
      this.suggestions.displayedValues.shift();
      this.suggestions.usedValues.shift();
    }

    if (filterText === "" && this.allow) {
      this.suggestions.displayedValues.unshift("Add blank value");
      this.suggestions.usedValues.unshift((this.allow === "undefined" ? undefined: "") as T);
    } else if (
      this.allow === "newEntry" 
      && !this.suggestions.displayedValues.some(value => value === filterText)
    ) {
      this.suggestions.displayedValues.unshift(`Add new value: '${filterText}'`);
      this.suggestions.usedValues.unshift(filterText as unknown as T);
    }

    this.filteredValues = this.suggestions.displayedValues.filter(value =>
      value.toLowerCase().includes(filterText.toLowerCase())
    );

    if (this.filteredValues.length > 0) {
      this.currentFocusIndex = Math.min(this.currentFocusIndex, this.filteredValues.length - 1);
    } else {
      this.currentFocusIndex = 0;
    }
    this.renderOptions();
  }

  private renderOptions(): void {
    this.filteredValues.forEach((value, index) => {
      const item = this.createOptionElement(value, index);
      this.attachOptionEventListeners(item, value, index);
    });
  }

  private createOptionElement(value: string, index: number): HTMLLIElement {
    return this.optionsList.createEl("li", {
      text: value,
      attr: {
        role: "option",
        "aria-selected": index === this.currentFocusIndex ? "true" : "false"
      }
    });
  }

  private attachOptionEventListeners(item: HTMLLIElement, value: string, index: number): void {
    if (index === this.currentFocusIndex) {
      item.style.backgroundColor = "var(--background-modifier-hover)";
    }

    item.addEventListener("mouseover", () => {
      item.style.backgroundColor = "var(--background-modifier-hover)";
    });

    item.addEventListener("mouseout", () => {
      if (index !== this.currentFocusIndex) {
        item.style.backgroundColor = "";
      }
    });

    item.addEventListener("click", (e) => {
      e.stopPropagation();
      this.onItemSelect(value, e);
    });
  }

  handleKeyNavigation(key: string, event: KeyboardEvent): void {
    switch (key) {
      case "ArrowDown":
        event.preventDefault();
        if (this.currentFocusIndex < this.filteredValues.length - 1) {
          this.currentFocusIndex++;
          const inputValue = (event.target as HTMLInputElement)?.value || '';
          this.updateOptions(inputValue);
        }
        break;
        
      case "ArrowUp":
        event.preventDefault();
        if (this.currentFocusIndex > 0) {
          this.currentFocusIndex--;
          const inputValue = (event.target as HTMLInputElement)?.value || '';
          this.updateOptions(inputValue);
        }
        break;
        
      case "Enter":
        event.preventDefault();
        if (this.filteredValues.length > 0) {
          this.onItemSelect(this.filteredValues[this.currentFocusIndex], event);
        }
        break;
    }
  }

  get hasFilteredValues(): boolean {
    return this.filteredValues.length > 0;
  }
}