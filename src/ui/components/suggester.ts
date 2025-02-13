interface Suggestions<T> {
  displayedValues: string[];
  usedValues: T[];
}

interface AutocompleteSelectOptions<T> {
  suggestions: Suggestions<T>;
  onSelected?: (usedValue: T | string, event: Event) => void;
  dropdownStyle?: boolean;
  style?: string,
  value?: string,
  focus?: boolean,
  placeholder?: string;
  allowNewEntry?: boolean;
}

export const addAutocompleteSelect = <T>(containerEl: HTMLElement, options: AutocompleteSelectOptions<T>) => {
  let currentFocusIndex = 0;
  let filteredValues: string[] = [];
  let isDropdownVisible = false;

  const wrapper = containerEl.createDiv({ 
    cls: "suggester",
    attr: {
      style: (options.style || "")
    }
  });
  
  // Create input
  const input = wrapper.createEl("input", {
    attr: {
      type: "text",
      role: "combobox",
      "aria-autocomplete": "list",
      value: options.value || "",
      placeholder: options.placeholder || ""
    }
  });
  
  // Create options list
  const optionsList = wrapper.createEl("ul", {
    cls: `${options.dropdownStyle ? "dropdown-style" : "" }`,
    attr: {
      role: "listbox"
    }
  });

  const showDropdown = () => {
    if (options.dropdownStyle && filteredValues.length > 0) {
      optionsList.style.display = 'block';
      isDropdownVisible = true;
    }
  };

  const hideDropdown = () => {
    if (options.dropdownStyle) {
      optionsList.style.display = 'none';
      isDropdownVisible = false;
    }
  };
  
  const updateOptions = (filterText: string = "") => {
    optionsList.empty();
    filteredValues = options.suggestions.displayedValues.filter(value =>
      value.toLowerCase().includes(filterText.toLowerCase())
    );
    
    if (filteredValues.length > 0) {
      currentFocusIndex = Math.min(currentFocusIndex, filteredValues.length - 1);
    } else {
      currentFocusIndex = 0;
    }
    
    filteredValues.forEach((value, index) => {
      const item = optionsList.createEl("li", {
        text: value,
        attr: {
          role: "option",
          "aria-selected": index === currentFocusIndex ? "true" : "false"
        }
      });
      
      if (index === currentFocusIndex) {
        item.style.backgroundColor = "var(--background-modifier-hover)";
      }
      
      item.addEventListener("mouseover", () => {
        item.style.backgroundColor = "var(--background-modifier-hover)";
      });
      
      item.addEventListener("mouseout", () => {
        if (index !== currentFocusIndex) {
          item.style.backgroundColor = "";
        }
      });
      
      item.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent the click from bubbling to document
        selectItem(value, e);
      });
    });

    // Show/hide dropdown based on results
    if (options.dropdownStyle) {
      if (filteredValues.length > 0 && isDropdownVisible) {
        showDropdown();
      } else {
        hideDropdown();
      }
    }
  };
  
  const selectItem = (displayValue: string, event: Event) => {
    const index = options.suggestions.displayedValues.indexOf(displayValue);
    if (index !== -1) {
      input.value = displayValue;
      if (options.onSelected) options.onSelected(options.suggestions.usedValues[index], event);
      hideDropdown();
      updateOptions(input.value);
    } else if (options.allowNewEntry) {
      if (options.onSelected) options.onSelected(input.value, event);
      updateOptions(input.value)
    }
  };
  
  // Input event handlers
  input.addEventListener("input", (event) => {
    currentFocusIndex = 0;
    updateOptions(input.value);
    showDropdown();

    if (options.allowNewEntry) {
      selectItem("", event)
    }
  });

  input.addEventListener("focus", () => {
    updateOptions(input.value);
    showDropdown();
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
          selectItem(filteredValues[currentFocusIndex], event);
        }
        break;

      case "Escape":
        if (options.dropdownStyle) {
          hideDropdown();
        }
        break;
    }
  });

  // Handle clicking outside
  if (options.dropdownStyle) {
    document.addEventListener("click", (e) => {
      if (!wrapper.contains(e.target as Node)) {
        hideDropdown();
      }
    });
  }
  
  // Initial population
  updateOptions();
  if (options.focus) input.focus();
  
  return {
    input,
    optionsList,
    wrapper
  };
};