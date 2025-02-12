import { TFile,  } from "obsidian";
import { Tasks } from "src/classes/tasks/tasks";
import { DashboardView } from "./dashboard";
import { AppWithPlugin } from "types";

type UpdateDashboardProps = {
  context: DashboardView;
  refreshView: () => Promise<void>;
}

export const updateDashboard = async ({ context, refreshView }: UpdateDashboardProps) => {
  const { app } = context
  const taskFile: TFile = await Tasks.getFile(app as AppWithPlugin)
  const taskFileContent: string[] = (await app.vault.cachedRead(taskFile)).split("\n")
  context.registerEvent(app.vault.on('modify', async (newFile) => {
    if (newFile.path !== taskFile.path) return

    const newTFile: TFile | null = app.vault.getFileByPath(newFile.path)
    if (!newTFile) return

    const newContent: string[] = (await app.vault.cachedRead(newTFile)).split("\n")

    if (newContent !== taskFileContent) await refreshView()
  }));
}