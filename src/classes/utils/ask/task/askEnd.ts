import { NavigationModal } from "src/ui/modals/navigationModal";
import { isTimeAfterTime, timeFromDurationAndStartTime } from "src/utils/time";
import { addAutocompleteSelect } from "src/ui/components/autoCompleteSelect/autocompleteSelect";
import { timeModal } from "src/ui/modals/timeModal";
import { moment } from "obsidian";
import Task from "src/classes/task/task";

export async function askEnd(modal: NavigationModal, task: Task, isLast: boolean = false) {
  return async (contentEl: typeof modal.contentEl) => {
    if (!task.schedule || !task.start) return isLast ? modal.pressDone() : await modal.pressNext()

    const now = moment().format("HH:mm");
    const isStartAfterNow = isTimeAfterTime(task.start, now)
    const isStartIsNow = task.start === now
    
    modal.setTitle("Choose end time");
    modal.setDescription(`Actual time ${now === task.start ? `and task start time: ${task.start}` : `${now} \nTask start time: ${task.start}`}`)
  
    const timeIntervals = [5, 10, 15, 20, 25, 30, 45, 60];
    const displayedValues = [
      "🤷 No date yet",
      "✏️ Personalized",
      ...timeIntervals.map(minutes => `🕔 ${minutes} minutes after task begin (${timeFromDurationAndStartTime(task.start || "", minutes, "after")})`),
    ];
  
    const usedValues = [
      "",
      async () => await new timeModal(task.app).open(),
      ...timeIntervals.map(minutes => timeFromDurationAndStartTime(task.start || "", minutes, "after")),
    ];
  
    if (!isStartAfterNow && !isStartIsNow) {
      displayedValues.unshift("⚡ Now")
      usedValues.unshift(now)
    }
  
    addAutocompleteSelect(contentEl, {
      focus: true,
      suggestions: {
        displayedValues: displayedValues,
        usedValues: usedValues
      },
      onSelected: async (usedValue) => {
        if (typeof usedValue === 'function') {
          task.update({ end: await usedValue() || undefined })
        } else {
          task.update({ end: usedValue })
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

  