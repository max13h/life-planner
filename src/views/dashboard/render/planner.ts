import { App } from "obsidian"
import { dateNow } from "src/utils/time"
import { buildPlannerSkeleton } from "./plannerSkeleton"
import { Tasks } from "src/classes/tasks/tasks"
import { AppWithPlugin } from "types"
import { populateTaskColumn } from "./populateTaskColumn"

export const buildPlanner = async (app: App, plannerContainer: HTMLDivElement, refreshView: (() => Promise<void>)) => {
  const tasksColumn = buildPlannerSkeleton(plannerContainer)

  const tasksFromDate = await Tasks.getTasksFromProperties(app as AppWithPlugin, { schedule: dateNow(), start: { type: "exists" }, end: { type: "exists" } })

  populateTaskColumn({ 
    app: app as AppWithPlugin, 
    tasksColumn, 
    tasks: tasksFromDate, 
    refreshView 
  })
}