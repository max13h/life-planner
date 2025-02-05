import Task from "src/classes/task/task";
import { setSpan } from "./spanComponent";

export const onClick = async (task: Task, checkbox: HTMLInputElement) => {
  if (task.status === " ") {
    await setChecked(task, checkbox)
  } else if (task.status === "x" || task.status === "-" || task.status === "/") {
    await setUnchecked(task, checkbox)
  }
}

export const setUnchecked = async (task: Task, checkbox: HTMLInputElement) => {
  checkbox.checked = false
  checkbox.value = "false"

  const span = getSpanFromCheckbox(checkbox)
  if (span) span.remove();

  await task.update({ 
    status: " ",
  }).save();
} 

export const setChecked = async (task: Task, checkbox: HTMLInputElement) => {
  checkbox.checked = true
  checkbox.value = "true"

  const span = getSpanFromCheckbox(checkbox)
  if (span) span.remove();

  await task.update({ 
    status: "x",
  }).save();
} 
export const setInProgress = async (task: Task, checkbox: HTMLInputElement) => {
  checkbox.checked = false
  checkbox.value = "false"

  const span = getSpanFromCheckbox(checkbox)
  if (span) {
    span.setText("⚒️")
  } else {
    const container = checkbox.parentElement
    if (container) setSpan(container, "⚒️")
  }

  await task.update({ 
    status: "/",
  }).save();
} 
export const setCancelled = async (task: Task, checkbox: HTMLInputElement) => {
  checkbox.checked = false
  checkbox.value = "false"

  const span = getSpanFromCheckbox(checkbox)
  if (span) {
    span.setText("❌")
  } else {
    const container = checkbox.parentElement
    if (container) setSpan(container, "❌")
  }

  await task.update({ 
    status: "-",
  }).save();
} 


const getSpanFromCheckbox = (checkbox: HTMLInputElement) => {
  const container = checkbox.parentElement
  return container?.querySelector("span") || null;
}