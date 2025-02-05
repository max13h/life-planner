import { TFile } from "obsidian";
import { ensureFile } from "src/utils/vault";
import { AppWithPlugin } from "types";
import { Tasks } from "./tasks";

export async function getFile(app: AppWithPlugin): Promise<TFile> {
  return await ensureFile(
    app,
    (await Tasks.getMetadata(app)).filePathFormatted,
    Tasks.TABLE_HEADER
  );
} 