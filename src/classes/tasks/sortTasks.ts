import Task from "../task/task";

export const sortTasks = (tasks: Task[], ...comparisons: ((a: Task, b: Task) => number)[]): Task[] => {
  return [...tasks].sort((a, b) => {
    for (const comparison of comparisons) {
      const result = comparison(a, b);
      if (result !== 0) return result;
    }
    return 0;
  });
}