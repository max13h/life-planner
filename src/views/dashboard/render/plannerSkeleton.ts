import { LifePlannerSettings } from "src/settings/settings"

export const buildPlannerSkeleton = (plannerContainer: HTMLDivElement, dashboardSettings: LifePlannerSettings["dashboard"]): HTMLDivElement => {
  const { startingHour, endingHour, numberOfPixelForOneMinute } = dashboardSettings
  const numberOfHour = endingHour - startingHour

  const skeleton = plannerContainer.createDiv({ cls: "skeleton" })

  const hoursColumn = skeleton.createDiv({ cls: "hours-column" })
  const tasksColumn = skeleton.createDiv({ cls: "tasks-column" })

  for (let i = 0; i < (endingHour - startingHour); i++) {
    hoursColumn.createDiv({ 
      text: `${i + startingHour}`, 
      cls: "hour", 
      attr: { 
        style: `
          height: ${numberOfPixelForOneMinute * 60}px;
          ${i === (numberOfHour - 1) ? "" : "border-bottom: var(--lp-planner-borders);"}
      `} 
    })
    const taskHour = tasksColumn.createDiv({ 
      attr: { 
        style: `
          height: ${numberOfPixelForOneMinute * 60}px;
      `} 
    })

    for (let j = 0; j < 4; j++) {
      const baseColorToDisplay = (j === 0 || j === 2) ? 25 : (j === 3 ? 35 : 30)
      taskHour.createDiv({ cls: `quart border-${baseColorToDisplay}` })
    }
  }

  return tasksColumn
}

