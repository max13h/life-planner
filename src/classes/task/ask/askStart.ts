import { NavigationModal } from "src/ui/modals/navigationModal";
import Task from "../task";
import { timeFromDurationAndStartTime, timeNow } from "src/utils/time";
import { addAutocompleteSelect } from "src/ui/components/suggester";
import { timeModal } from "src/ui/modals/timeModal";

export async function askStart(modal: NavigationModal, task: Task, isLast: boolean = false) {
  return async (contentEl: typeof modal.contentEl) => {
    if (!task.schedule) return isLast ? modal.pressDone() : await modal.pressNext()

    const now = timeNow()
    modal.setTitle("Choose start time");
    modal.setDescription("Actual time: " + now)
  
  
    const timeIntervals = [5, 10, 15, 20, 25, 30, 45, 60];
    const displayedValues = [
      "⚡ Now",
      "🤷 No date yet",
      "✏️ Personalized",
      ...timeIntervals.map(minutes => `🕔 In ${minutes} minutes (${timeFromDurationAndStartTime(now, minutes, "after")})`),
      ...timeIntervals.map(minutes => `⌛ ${minutes} minutes ago (${timeFromDurationAndStartTime(now, minutes, "before")})`)
    ];
  
    const usedValues = [
      now,
      "",
      async () => await new timeModal(task.app).open(),
      ...timeIntervals.map(minutes => timeFromDurationAndStartTime(now, minutes, "after")),
      ...timeIntervals.map(minutes => timeFromDurationAndStartTime(now, minutes, "before"))
    ];
  
    addAutocompleteSelect(contentEl, {
      focus: true,
      suggestions: {
        displayedValues: displayedValues,
        usedValues: usedValues
      },
      onSelected: async (usedValue) => {
        if (typeof usedValue === 'function') {
          task.update({ start: await usedValue() || undefined })
        } else {
          task.update({ start: usedValue })
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