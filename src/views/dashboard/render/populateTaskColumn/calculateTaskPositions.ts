import { moment } from "obsidian";
import Task from "src/classes/task/task";
import { CalculateTaskPositionsParams, PositionedTask } from "types";

export const calculateTaskPositions = ({
  tasks,
  numberOfPixelForOneMinute,
  startingHour,
  endingHour,
}: CalculateTaskPositionsParams): PositionedTask[] => {
  if (!Array.isArray(tasks)) {
    throw new Error("Le paramètre tasks doit être un tableau.");
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    const startA = moment(a.start, "HH:mm", true);
    const startB = moment(b.start, "HH:mm", true);
    return startA.diff(startB);
  });

  const overlappingGroups: Task[][] = [];
  let currentGroup: Task[] = [];

  sortedTasks.forEach((task, index) => {
    if (!task.start || !task.end) {
      throw new Error(`La tâche ${task.text || "(inconnue)"} n'a pas de start ou end valide.`);
    }

    const taskStart = moment(task.start, "HH:mm", true);
    const taskEnd = moment(task.end, "HH:mm", true);

    if (!taskStart.isValid() || !taskEnd.isValid()) {
      throw new Error(`Heure invalide : start=${task.start}, end=${task.end}`);
    }

    if (taskEnd.isBefore(taskStart)) {
      throw new Error(`L'heure de fin (${task.end}) ne peut pas être avant l'heure de début (${task.start}).`);
    }

    const overlapsWithCurrentGroup = currentGroup.some(groupTask => {
      const groupTaskStart = moment(groupTask.start, "HH:mm", true);
      const groupTaskEnd = moment(groupTask.end, "HH:mm", true);
      return !(taskStart.isSameOrAfter(groupTaskEnd) || taskEnd.isSameOrBefore(groupTaskStart));
    });

    if (overlapsWithCurrentGroup) {
      currentGroup.push(task);
    } else {
      if (currentGroup.length > 0) {
        overlappingGroups.push([...currentGroup]);
      }
      currentGroup = [task];
    }

    if (index === sortedTasks.length - 1 && currentGroup.length > 0) {
      overlappingGroups.push([...currentGroup]);
    }
  });

  const positionedTasks: PositionedTask[] = [];
  const taskToGroupInfo = new Map<Task, { groupIndex: number, columnIndex: number }>();

  overlappingGroups.forEach((group, groupIndex) => {
    if (group.length === 1) {
      taskToGroupInfo.set(group[0], { groupIndex, columnIndex: -1 });
    } else {
      const columns: Task[][] = [];
      group.forEach(task => {
        let columnIndex = 0;
        while (true) {
          if (!columns[columnIndex]) {
            columns[columnIndex] = [task];
            taskToGroupInfo.set(task, { groupIndex, columnIndex });
            break;
          }

          const canFitInColumn = columns[columnIndex].every(existingTask => {
            const existingStart = moment(existingTask.start, "HH:mm", true);
            const existingEnd = moment(existingTask.end, "HH:mm", true);
            const taskStart = moment(task.start, "HH:mm", true);
            const taskEnd = moment(task.end, "HH:mm", true);
            return taskStart.isSameOrAfter(existingEnd) || taskEnd.isSameOrBefore(existingStart);
          });

          if (canFitInColumn) {
            columns[columnIndex].push(task);
            taskToGroupInfo.set(task, { groupIndex, columnIndex });
            break;
          }

          columnIndex++;
        }
      });
    }
  });

  sortedTasks.forEach(task => {
    const startMoment = moment(task.start, "HH:mm", true);
    const endMoment = moment(task.end, "HH:mm", true);
    
    const startMinutes = startMoment.hours() * 60 + startMoment.minutes();
    const endMinutes = endMoment.hours() * 60 + endMoment.minutes();
    const plannerStartMinutes = startingHour * 60;
    const plannerEndMinutes = endingHour * 60;

    const top = Math.max(0, (startMinutes - plannerStartMinutes) * numberOfPixelForOneMinute);
    const height = (Math.min(plannerEndMinutes, endMinutes) - 
                   Math.max(plannerStartMinutes, startMinutes)) * numberOfPixelForOneMinute;

    const groupInfo = taskToGroupInfo.get(task);
    
    if (!groupInfo) {
      throw new Error("Task group info not found");
    }

    const group = overlappingGroups[groupInfo.groupIndex];
    
    let left = 0;
    let right = 0;

    if (group.length === 1) {
      left = 0;
      right = 0;
    } else {
      const totalColumns = Math.max(...Array.from(taskToGroupInfo.values())
        .filter(info => info.groupIndex === groupInfo.groupIndex)
        .map(info => info.columnIndex)) + 1;
      
      const columnWidth = 100 / totalColumns;
      left = groupInfo.columnIndex * columnWidth;
      right = 100 - (left + columnWidth);
    }

    positionedTasks.push({
      top,
      height,
      left,
      right,
      task,
    });
  });

  return positionedTasks;
};
