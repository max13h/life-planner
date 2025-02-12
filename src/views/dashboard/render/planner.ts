import { dateNow } from "src/utils/time"
import { buildPlannerSkeleton } from "./plannerSkeleton"
import { Tasks } from "src/classes/tasks/tasks"
import { AppWithPlugin } from "types"
import { populateTaskColumn } from "./populateTaskColumn/populateTaskColumn"

export const buildPlanner = async (app: AppWithPlugin, plannerContainer: HTMLDivElement, refreshView: (() => Promise<void>)) => {
  plannerContainer.empty()
  const dashboardSettings = app.plugins.plugins["life-planner"].settings.dashboard
  const tasksColumn = buildPlannerSkeleton(plannerContainer, dashboardSettings)

  const tasksFromDate = await Tasks.getTasksFromProperties(app as AppWithPlugin, { schedule: dateNow(), start: { type: "exists" }, end: { type: "exists" } })

  populateTaskColumn({ 
    app: app as AppWithPlugin, 
    tasksColumn, 
    tasks: tasksFromDate, 
    refreshView,
    dashboardSettings
  })
}