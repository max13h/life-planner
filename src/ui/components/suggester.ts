interface Suggestions<T> {
  displayedValues: string[];
  usedValues: T[];
}

interface AutocompleteSelectOptions<T> {
  suggestions: Suggestions<T>;
  onSelected?: (usedValue: T | string) => void;
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

  const wrapper = containerEl.createEl("div", {
    attr: {
      style: "position: relative; width: 100%; " + (options.style || "")
    }
  });
  
  // Create input
  const input = wrapper.createEl("input", {
    attr: {
      style: "width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;",
      type: "text",
      role: "combobox",
      "aria-autocomplete": "list",
      value: options.value || "",
      placeholder: options.placeholder || ""
    }
  });
  
  // Create options list
  const optionsList = wrapper.createEl("ul", {
    attr: {
      style: `
        width: 100%;
        margin: 0;
        padding: 0;
        ${options.dropdownStyle ? `
          position: absolute;
          top: 100%;
          left: 0;
          background: white;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          max-height: 200px;
          overflow-y: auto;
          z-index: 1000;
          display: none;
          text-wrap: wrap;
          overflow-x: hidden
        ` : ''}
      `,
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
          style: `
            padding: 8px;
            cursor: pointer;
            list-style: none;
            ${options.dropdownStyle ? 'border-bottom: 1px solid #eee;' : 'border-radius: 4px;'}
          `,
          role: "option",
          "aria-selected": index === currentFocusIndex ? "true" : "false"
        }
      });
      
      if (index === currentFocusIndex) {
        item.style.backgroundColor = "#e5e5e5";
      }
      
      item.addEventListener("mouseover", () => {
        item.style.backgroundColor = "#e5e5e5";
      });
      
      item.addEventListener("mouseout", () => {
        if (index !== currentFocusIndex) {
          item.style.backgroundColor = "";
        }
      });
      
      item.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent the click from bubbling to document
        selectItem(value);
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
  
  const selectItem = (displayValue: string) => {
    const index = options.suggestions.displayedValues.indexOf(displayValue);
    if (index !== -1) {
      input.value = displayValue;
      if (options.onSelected) options.onSelected(options.suggestions.usedValues[index]);
      hideDropdown();
      updateOptions(input.value);
    } else if (options.allowNewEntry) {
      if (options.onSelected) options.onSelected(input.value);
      updateOptions(input.value)
    }
  };
  
  // Input event handlers
  input.addEventListener("input", () => {
    currentFocusIndex = 0;
    updateOptions(input.value);
    showDropdown();

    if (options.allowNewEntry) {
      selectItem("")
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
          selectItem(filteredValues[currentFocusIndex]);
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