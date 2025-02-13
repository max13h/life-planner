import { App, ItemView, WorkspaceLeaf, moment } from 'obsidian';
import { buildPlanner } from './render/planner';
import { AppWithPlugin } from 'types';
import { updateDashboard } from './updateDashboard';

export const VIEW_LIFE_PLANNER_DASHBOARD = 'VIEW_LIFE_PLANNER_DASHBOARD';

export class DashboardView extends ItemView {
  protected selectedWeek: string | undefined 

  constructor(leaf: WorkspaceLeaf, app: App) {
    super(leaf);
    this.icon = "lamp-desk"
    this.navigation = true
  }

  getViewType() {
    return VIEW_LIFE_PLANNER_DASHBOARD;
  }

  getDisplayText() {
    return 'Dashboard';
  }

  async onOpen() {
    this.selectedWeek = moment().format("WW") 
    this.buildDashboard()
  }

  async buildDashboard() {
    const container = this.containerEl.children[1];
    container.empty();
    container.addClass("lp-view")
    const dashboardContainer = container.createDiv({ cls: "dashboardView" });

    // Heading
    const headingContainer = dashboardContainer.createEl("hgroup")
    headingContainer.createEl("h1", { text: `${moment().format("dddd, DD MMMM")}`})

    const plannerContainer = dashboardContainer.createDiv({ cls: "planner-container" })

    await buildPlanner(this.app as AppWithPlugin, plannerContainer, this.buildDashboard)

    await updateDashboard({
      context: this,
      refreshView: () => buildPlanner(this.app as AppWithPlugin, plannerContainer, this.buildDashboard)
    })
  }
}