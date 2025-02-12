import { LifePlannerSettings } from "src/settings/settings"

export const buildPlannerSkeleton = (plannerContainer: HTMLDivElement, dashboardSettings: LifePlannerSettings["dashboard"]): HTMLDivElement => {
  const { startingHour, endingHour, numberOfPixelForOneMinute } = dashboardSettings
  const numberOfHour = endingHour - startingHour

  const skeleton = plannerContainer.createDiv({ attr: { style: `
    display: flex;
    width: 100%;
    border: var(--lp-planner-borders);
    overflow: hidden
  `}})

  const hoursColumn = skeleton.createDiv({ attr: { style: `
    border-right: var(--lp-planner-borders);
    width: 2rem;
    display: flex;
    flex-direction: column;
    background-color: var(--base-50);
  `}})
  const tasksColumn = skeleton.createDiv({ attr: { style: `
    background-color: var(--lp-planner-tasks-column-bg);
    width: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
  `}})

  for (let i = 0; i < (endingHour - startingHour); i++) {
    hoursColumn.createDiv({ 
      text: `${i + startingHour}`, 
      cls: "hour", 
      attr: { style: `
        height: ${numberOfPixelForOneMinute * 60}px;
        display: flex;
        justify-content: center;
        color: grey;
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
      taskHour.createDiv({
        attr: { 
          style: `
            height: 25%;
            border-bottom: 1px solid var(--color-base-${baseColorToDisplay});
        `} 
      })
    }
  }

  return tasksColumn
}

