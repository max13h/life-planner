import { App } from "obsidian"
import { Tasks } from "src/classes/tasks/tasks";
import { dateNow } from "src/utils/time";

const buildPlannerSkeleton = (plannerContainer: HTMLDivElement) => {
  const startingHour = 6
  const numberOfHour = 18
  const numberOfPixelForOneMinute = 1.5

  const skeleton = plannerContainer.createDiv({ attr: { style: `
    display: flex;
    width: 24rem;
    border: #b6b6b6 1px solid;
    border-radius: var(--radius-xl);
    overflow: hidden
  `}})

  const hoursColumn = skeleton.createDiv({ attr: { style: `
    border-right: 1px solid #b6b6b6;
    width: 2rem;
    display: flex;
    flex-direction: column;
  `}})
  const tasksColumn = skeleton.createDiv({ attr: { style: `
    background-color: rgb(245, 245, 245);
    width: 100%;
    display: flex;
    flex-direction: column;
  `}})

  for (let i = 0; i < numberOfHour; i++) {
    hoursColumn.createDiv({ 
      text: `${i + startingHour}`, 
      cls: "hour", 
      attr: { style: `
        height: ${numberOfPixelForOneMinute * 60}px;
        display: flex;
        justify-content: center;
        color: grey;
        border-bottom: 1px solid #b6b6b6;
      `} 
    })
    tasksColumn.createDiv({ 
      cls: "task",
      attr: { style: `
        height: ${numberOfPixelForOneMinute * 60}px;
        border-bottom: 1px solid #b6b6b6;
      `} 
    })
  }
}

export const buildPlanner = (app: App, plannerContainer: HTMLDivElement) => {
  buildPlannerSkeleton(plannerContainer)
  const date = dateNow()
  const tasksFromDate = Tasks.getTasksFromDate(app, date)
  const recurringTasks = Tasks.getRecurringTasks(app)
}