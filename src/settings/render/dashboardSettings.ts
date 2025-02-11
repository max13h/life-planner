import LifePlanner from "main";
import { Setting } from "obsidian";

interface RenderDashboardSettingsProps {
  container: HTMLElement;
  plugin: LifePlanner;
}

export const renderDashboardSettings = ({container, plugin}: RenderDashboardSettingsProps) => {
  container.createEl("h2", { text: "Dashboard settings:" })

  const startingHour = new Setting(container)
    .setName("Starting Hour")
    .setDesc("(0 ≤ value ≤ 23)")
    .addText(component => {
      component.inputEl.value = plugin.settings.dashboard.startingHour.toString()
      component.inputEl.type = "number"
      component.inputEl.min = "0"
      component.inputEl.max = "23"
      component.onChange((value) => {
        if (value !== "" && (parseInt(value) < 0 || parseInt(value) > 23 || value.length > 2)) {
          component.inputEl.value = "0"
          component.inputEl.style.color = "red"
        } else {
          component.inputEl.style.color = "var(--text-normal)"
          plugin.settings.dashboard.startingHour = parseInt(value || "0")
        }
      })
    })
  console.log(startingHour.controlEl);
}