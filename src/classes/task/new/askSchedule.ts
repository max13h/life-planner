import { NavigationModal } from "src/ui/modals/navigationModal";
import Task from "../task";
import { DayName, getDayDate } from "src/utils/time";
import { dateModal } from "src/ui/modals/dateModal";
import { addAutocompleteSelect } from "src/ui/components/suggester";

export async function askSchedule(modal: NavigationModal, task: Task, isLast: boolean = false) {
  return async (contentEl: typeof modal.contentEl) => {
    modal.setTitle("Choose task date");

    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const displayedValues = [
      "⚡ Today",
      `📅 Tomorrow ${getDayDate('tomorrow')}`,
      "🤷 No date yet",
      "✏️ Personalized",
      ...daysOfWeek.map(day => `🕔 Next ${day.charAt(0).toUpperCase() + day.slice(1)} (${getDayDate(day as DayName)})`)
    ];

    const usedValues = [
      getDayDate('today'),
      getDayDate('tomorrow'),
      "",
      async () => await new dateModal(task.app).open(),
      ...daysOfWeek.map(day => getDayDate(day as DayName))
    ];

    addAutocompleteSelect(contentEl, {
      focus: true,
      suggestions: {
        displayedValues: displayedValues,
        usedValues: usedValues
      },
      onSelected: async (usedValue) => {
        if (typeof usedValue === 'function') {
          task.update({ schedule: await usedValue() || undefined })
        } else {
          task.update({ schedule: usedValue })
        }
        
        if (isLast) {
          modal.pressDone()  
        } else {
          await modal.pressNext()
        }
      }
    })
  }
}