import LifePlanner from "main";
import { Setting } from "obsidian";

interface RenderDashboardSettingsProps {
  container: HTMLElement;
  plugin: LifePlanner;
}

export const renderDashboardSettings = ({container, plugin}: RenderDashboardSettingsProps) => {
  container.createEl("h2", { text: "Dashboard settings:" })

  new Setting(container)
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
          plugin.settings.dashboard.startingHour = 0
          component.inputEl.style.color = "red"
        } else {
          component.inputEl.style.color = "var(--text-normal)"
          plugin.settings.dashboard.startingHour = parseInt(value || "0")
        }
      })
    })
  
  new Setting(container)
    .setName("Ending Hour")
    .setDesc("(1 ≤ value ≤ 24)")
    .addText(component => {
      component.inputEl.value = plugin.settings.dashboard.endingHour.toString()
      component.inputEl.type = "number"
      component.inputEl.min = "1"
      component.inputEl.max = "24"
      component.onChange((value) => {
        if (value !== "" && (parseInt(value) < 1 || parseInt(value) > 24 || value.length > 2)) {
          component.inputEl.value = "24"
          plugin.settings.dashboard.endingHour = 24
          component.inputEl.style.color = "red"
        } else {
          component.inputEl.style.color = "var(--text-normal)"
          plugin.settings.dashboard.endingHour = parseInt(value || "24")
        }
      })
    })

  new Setting(container)
    .setName("Number of pixel for one minute")
    .setDesc("(0.3 ≤ value ≤ 5)")
    .addText(component => {
      component.inputEl.value = plugin.settings.dashboard.numberOfPixelForOneMinute.toString()
      component.inputEl.type = "number"
      component.inputEl.min = "0.3"
      component.inputEl.max = "5"
      component.onChange((value) => {
        if (value !== "" && (parseFloat(value) < 0.3 || parseFloat(value) > 5 || value.length > 3)) {
          component.inputEl.value = "1"
          plugin.settings.dashboard.numberOfPixelForOneMinute = 1
          component.inputEl.style.color = "red"
        } else {
          component.inputEl.style.color = "var(--text-normal)"
          plugin.settings.dashboard.numberOfPixelForOneMinute = parseFloat(value || "1")
        }
      })
    })
}