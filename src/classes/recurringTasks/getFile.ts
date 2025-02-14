import { TFile } from "obsidian";
import { ensureFile } from "src/utils/vault";
import { AppWithPlugin } from "types";
import { RecurringTasks } from "./recurringTasks";

export async function getFile(app: AppWithPlugin): Promise<TFile> {
  return await ensureFile(
    app,
    (await RecurringTasks.getMetadata(app)).filePathFormatted,
    RecurringTasks.TABLE_HEADER
  );
} 