import { AppWithPlugin } from "types"
import Task from "./task"
import { moment } from "obsidian"
import { Tasks } from "../tasks/tasks"

export const duplicateTask = async (app: AppWithPlugin, task: Task) => {
  const newTask = new Task(app)
  newTask.update({
    status: " ",
    text: task.text,
    projectLink: task.projectLink,
    tags: task.tags,
    priority: task.priority,
    schedule: moment().format("YYYY-MM-DD"),
  })
  newTask.created = task.created

  const relatedTasks = await Tasks.getTasksFromProperties(app, { 
    created: task.created, 
    occurrence: { type: "exists" } 
  })

  if (!task.occurrence) {
    await task.update({ occurrence: "1/2" }).save()
    newTask.update({ occurrence: "2/2" })
    return newTask.insertTaskInFile()
  }

  if (task.occurrence && task.occurrence.includes("/")) {
    const totalExistingTasks = relatedTasks.length
    const newTotal = totalExistingTasks + 1
    
    const sortedTasks = relatedTasks.sort((a, b) => {
      const [aNum] = a.occurrence?.split("/").map(Number) || [0]
      const [bNum] = b.occurrence?.split("/").map(Number) || [0]
      return aNum - bNum
    })

    for (const existingTask of sortedTasks) {
      if (!existingTask.occurrence?.includes("/")) {
        continue
      }

      const [currentNum] = existingTask.occurrence.split("/").map(Number)
      await existingTask.update({
        occurrence: `${currentNum}/${newTotal}`
      }).save()
    }

    newTask.update({
      occurrence: `${newTotal}/${newTotal}`
    })
    
    return newTask.insertTaskInFile()
  }
}