import { App } from 'obsidian';
import { openOrCreateFile } from '../utils/openOrCreateFile';
import { LifePlannerSettings } from 'src/settings/settings';

export const createProject = async (app: App, settings: LifePlannerSettings) => {
  // @ts-ignore
  const qa = app.plugins.plugins.quickadd.api

  const name = await qa.inputPrompt("Nom du projet", "")
  if (!name) return

  const path = settings.binFolder + '/' + name

  await openOrCreateFile(app, path, "source", settings.projectsTemplatePath)
}
