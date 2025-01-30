import { App } from "obsidian"
import { LifePlannerSettings } from "src/settings/settings"

export type AppWithPlugin = App & {
  plugins: {
    plugins: {
      "life-planner": {
        settings: LifePlannerSettings
      }
    }
  }
};