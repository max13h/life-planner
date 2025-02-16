import { AutocompleteSelectOptions, AutocompleteElements } from "types";
import { DropdownManager } from "./dropdownManager";
import { OptionsManager } from "./optionsManager";

export const createElements = (
  containerEl: HTMLElement,
  options: AutocompleteSelectOptions<unknown>
): AutocompleteElements => {
  const wrapper = containerEl.createDiv({ 
    cls: "suggester",
    attr: { style: options.style || "" }
  });
  
  const input = wrapper.createEl("input", {
    attr: {
      type: "text",
      role: "combobox",
      "aria-autocomplete": "list",
      value: options.value || "",
      placeholder: options.placeholder || ""
    }
  });
  
  const optionsList = wrapper.createEl("ul", {
    cls: options.dropdownStyle ? "dropdown-style" : "",
    attr: { role: "listbox" }
  });

  return { input, optionsList, wrapper };
}

export const selectItem = <T>(
  displayValue: string,
  event: Event,
  input: HTMLInputElement,
  options: AutocompleteSelectOptions<T>,
  dropdownManager: DropdownManager,
  optionsManager: OptionsManager<T>
): void => {
  const index = options.suggestions.displayedValues.indexOf(displayValue);
  if (index !== -1) {
    if (
      options.suggestions.usedValues[index] === "" 
      || options.suggestions.usedValues[index] === undefined
    ) {
      input.value = ""
    } else if (displayValue.startsWith("Add new value: '")) {
      input.value = options.suggestions.usedValues[index] as string
    } else {
      input.value = displayValue;
    }

    if (options.onSelected) {
      options.onSelected(options.suggestions.usedValues[index], event);
    }
    dropdownManager.hide();
    optionsManager.updateOptions(input.value);
  }
}

export const attachEventListeners = <T>(
  elements: AutocompleteElements,
  options: AutocompleteSelectOptions<T>,
  dropdownManager: DropdownManager,
  optionsManager: OptionsManager<T>
): void => {
  const { input, wrapper } = elements;

  input.addEventListener("input", (event) => {
    optionsManager.updateOptions(input.value);
    dropdownManager.show();

    if (options.allow === "newEntry") {
      selectItem("", event, input, options, dropdownManager, optionsManager);
    }
  });

  input.addEventListener("focus", () => {
    optionsManager.updateOptions(input.value);
    dropdownManager.show();
  });
  
  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      dropdownManager.hide();
    } else {
      optionsManager.handleKeyNavigation(event.key, event);
    }
  });

  if (options.dropdownStyle) {
    document.addEventListener("click", (e) => {
      if (!wrapper.contains(e.target as Node)) {
        dropdownManager.hide();
      }
    });
  }
}