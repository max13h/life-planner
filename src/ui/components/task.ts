import { App } from 'obsidian';
import { ITask } from 'types';

interface Props {
  onStatusChange?: (newStatus: string) => void;
  onTaskClick?: () => void;
}

export const createTaskComponent = (
  container: HTMLElement,
  task: ITask,
  props: Props,
) => {
  const taskElementContainer = container.createDiv({
    attr: {
      style: `
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        border: 1px solid var(--background-modifier-border);
        padding: 1rem;
        border-radius: 5px;
        background: var(--background-primary);
        cursor: ${props.onTaskClick ? 'pointer' : 'default'};
      `
    }
  });

  if (props.onTaskClick) {
    taskElementContainer.addEventListener('click', (e) => {
      // Prevent triggering click when interacting with checkbox
      if (!(e.target instanceof HTMLInputElement)) {
        props.onTaskClick?.();
      }
    });
  }

  // Status and Text Container
  const statusTextContainer = taskElementContainer.createDiv({
    attr: {
      style: `
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
      `
    }
  });

  // Status
  if (task.status === " " || task.status === "x") {
    const checkbox = statusTextContainer.createEl("input", {
      attr: {
        type: "checkbox",
        checked: task.status === "x",
        style: "margin-top: 0.25rem;"
      }
    });
    
    if (props.onStatusChange) {
      checkbox.addEventListener('change', (e) => {
        const newStatus = (e.target as HTMLInputElement).checked ? "x" : " ";
        props.onStatusChange?.(newStatus);
      });
    }
  } else {
    statusTextContainer.createSpan({
      text: task.status === "-" ? "❌" : "⚒️",
      attr: {
        style: `
          font-size: 1.1em;
          line-height: 1.5;
        `
      }
    });
  }

  // Task Text
  statusTextContainer.createSpan({
    text: task.text,
    attr: {
      style: `
        flex: 1;
        line-height: 1.5;
      `
    }
  });

  // Schedule Info Container
  if (task.schedule || task.start || task.end) {
    const scheduleContainer = taskElementContainer.createDiv({
      attr: {
        style: `
          display: flex;
          gap: 1rem;
          align-items: center;
          padding: 0.5rem;
          background: var(--background-secondary);
          border-radius: 4px;
        `
      }
    });

    if (task.schedule) {
      scheduleContainer.createDiv({
        text: `📅 ${task.schedule}`,
        attr: {
          style: "font-size: 0.9em;"
        }
      });
    }

    if (task.start) {
      scheduleContainer.createDiv({
        text: `▶️ ${task.start}`,
        attr: {
          style: "font-size: 0.9em;"
        }
      });
    }

    if (task.end) {
      scheduleContainer.createDiv({
        text: `⏹️ ${task.end}`,
        attr: {
          style: "font-size: 0.9em;"
        }
      });
    }
  }

  // Tags Container
  if (task.tags && task.tags.length > 0) {
    const tagsContainer = taskElementContainer.createDiv({
      attr: {
        style: `
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        `
      }
    });

    task.tags.forEach(tag => {
      tagsContainer.createSpan({
        text: tag,
        attr: {
          style: `
            background: var(--background-modifier-success);
            color: var(--text-on-accent);
            padding: 0.25rem 0.5rem;
            border-radius: 1rem;
            font-size: 0.85em;
          `
        }
      });
    });
  }

  return taskElementContainer;
};
