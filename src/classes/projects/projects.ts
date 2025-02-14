import { App, TFile } from "obsidian";
import { AppWithPlugin, Metadata } from "types";
import { getFiles } from "./getFiles";
import { getMetadata } from "../utils/getMetadata";

export class Projects {
  private app: App

  constructor (app: App) {
    this.app = app
  }

  static async getFiles(app: AppWithPlugin): Promise<TFile[]> { return getFiles(app) }

  static async getMetadata(app: AppWithPlugin, projectFileName?: string): Promise<Metadata> { return getMetadata(app, "projects", projectFileName) }
}