import { AutocompleteSelectOptions, AutocompleteElements } from "types";
import { DropdownManager } from "./dropdownManager";
import { OptionsManager } from "./optionsManager";
import { createElements, selectItem, attachEventListeners } from "./helpers";

export const addAutocompleteSelect = <T>(
  container: HTMLElement, 
  options: AutocompleteSelectOptions<T>
): AutocompleteElements => {
  const elements = createElements(container, options);
  const dropdownManager = new DropdownManager(elements.optionsList, options.dropdownStyle);
  const optionsManager = new OptionsManager<T>(
    options.suggestions,
    elements.optionsList,
    (displayValue: string, event: Event) => selectItem(displayValue, event, elements.input, options, dropdownManager, optionsManager),
    options.allow
  );

  attachEventListeners(elements, options, dropdownManager, optionsManager);

  optionsManager.updateOptions();
  if (options.focus) {
    elements.input.focus();
  }

  return elements;
};


