export class DropdownManager {
  private isVisible = false;
  
  constructor(
    private optionsList: HTMLUListElement,
    private readonly dropdownStyle: boolean = false
  ) {}

  show(): void {
    if (this.dropdownStyle) {
      this.optionsList.style.display = 'block';
      this.isVisible = true;
    }
  }

  hide(): void {
    if (this.dropdownStyle) {
      this.optionsList.style.display = 'none';
      this.isVisible = false;
    }
  }

  get visible(): boolean {
    return this.isVisible;
  }
}