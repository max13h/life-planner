import { TFile } from "obsidian";
import { AppWithPlugin, Metadata } from "types";
import { getFile } from "./getFile";
import { getRecurringTasks } from "./getRecurringTasks";
import { getMetadata } from "../utils/getMetadata";

export class RecurringTasks {
  static readonly TABLE_HEADER = "|Text|Project Link|Tags|Priority|Created|\n|------|-------------|-----|--------|---------|";

  static async getFile(app: AppWithPlugin): Promise<TFile> { return getFile(app) }

  static async getTasks(app: AppWithPlugin): Promise<RecurringTasks[]> { return await getRecurringTasks(app) }

  static async getMetadata(app: AppWithPlugin): Promise<Metadata> { return getMetadata(app, "recurringTasks") }
}