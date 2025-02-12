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
    container.addClass("dashboard")

    const dashboardContainer = container.createDiv({ 
      cls: "testtest",
      attr: { 
        style: `
          max-width: var(--file-line-width); 
          margin-left: auto; 
          margin-right: auto;
          display: flex;
          flex-direction: column;
        `
      }
    });

    // Heading
    const headingContainer = dashboardContainer.createEl("hgroup")
    headingContainer.createEl("h1", { text: `${moment().format("dddd, DD MMMM")}`})

    const plannerContainer = dashboardContainer.createDiv({ attr: { style: `
      display: flex;
      justify-content: center;
      width: 100%;
      max-width: 32rem;
      align-self: center;
  ` }})

    await buildPlanner(this.app as AppWithPlugin, plannerContainer, this.buildDashboard)

    await updateDashboard({
      context: this,
      refreshView: () => buildPlanner(this.app as AppWithPlugin, plannerContainer, this.buildDashboard)
    })
  }
}