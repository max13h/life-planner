interface Suggestions {
  displayedValues: string[];
  usedValues: any[];
}

interface AutocompleteSelectOptions {
  suggestions: Suggestions;
  onSelected?: (usedValue: any) => void;
}

export const addAutocompleteSelect = (containerEl: HTMLElement, options: AutocompleteSelectOptions) => {
  let currentFocusIndex = -1;
  let filteredValues: string[] = [];
  
  // Create input
  const input = containerEl.createEl("input", {
    attr: {
      style: "width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 4px;",
      type: "text",
      role: "combobox", "aria-autocomplete": "list"
      }
  });
  
  // Create options list
  const optionsList = containerEl.createEl("ul", {
    attr: {
        style: "width: 100%; margin: 0; padding: 0;",
        role: "listbox"
    }
  });
  
  const updateOptions = (filterText: string = "") => {
    optionsList.empty();
    filteredValues = options.suggestions.displayedValues.filter(value =>
      value.toLowerCase().includes(filterText.toLowerCase())
    );
    
    filteredValues.forEach((value, index) => {
      const item = optionsList.createEl("li", {
        text: value,
        attr: {
        style: "padding: 8px; cursor: pointer; list-style: none; border-radius: 4px",
        role: "option",
          "aria-selected": "false"
        }
      });
        
      if (index === currentFocusIndex) {
        item.style.backgroundColor = "#e5e5e5";
        item.setAttribute("aria-selected", "true");
      }
      
      item.addEventListener("mouseover", () => {
        item.style.backgroundColor = "#e5e5e5";
      });
      
      item.addEventListener("mouseout", () => {
        if (index !== currentFocusIndex) {
          item.style.backgroundColor = "";
        }
      });
      
      item.addEventListener("click", () => {
        selectItem(value);
      });
    });
  };
  
  const selectItem = (displayValue: string) => {
    const index = options.suggestions.displayedValues.indexOf(displayValue);
    if (index !== -1) {
      input.value = displayValue;
      currentFocusIndex = -1;
      if (options.onSelected) options.onSelected(options.suggestions.usedValues[index]);
      updateOptions(input.value);
    }
  };
  
  // Input event handlers
  input.addEventListener("input", () => {
    currentFocusIndex = -1;
    updateOptions(input.value);
  });
  
  input.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (currentFocusIndex < filteredValues.length - 1) {
          currentFocusIndex++;
          updateOptions(input.value);
        }
        break;
          
      case "ArrowUp":
        event.preventDefault();
        if (currentFocusIndex > 0) {
          currentFocusIndex--;
          updateOptions(input.value);
        }
        break;
          
      case "Enter":
        event.preventDefault();
        if (filteredValues.length > 0) {
          if (currentFocusIndex === -1) {
              selectItem(filteredValues[0]);
          } else {
            selectItem(filteredValues[currentFocusIndex]);
          }
        }
        break;
    }
  });
  
  // Initial population
  updateOptions();
  input.focus();
  currentFocusIndex = 0;
  updateOptions();
  
  return {
      input,
      optionsList
  };
};