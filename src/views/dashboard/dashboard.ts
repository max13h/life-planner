import { App, ItemView, WorkspaceLeaf, moment } from 'obsidian';
import { buildPlanner } from './planner';

export const VIEW_DASHBOARD = 'VIEW_DASHBOARD';

export class DashboardView extends ItemView {
  protected selectedWeek: string | undefined 

  constructor(leaf: WorkspaceLeaf, app: App) {
    super(leaf);
    this.icon = "lamp-desk"
    this.navigation = true
  }

  getViewType() {
    return VIEW_DASHBOARD;
  }

  getDisplayText() {
    return 'Dashboard';
  }

  async onOpen() {
    this.selectedWeek = moment().format("WW") 
    this.buildDashboard()
  }

  buildDashboard() {
    const container = this.containerEl.children[1];
    container.empty();
    container.addClass("dashboard")

    const dashboardContainer = container.createDiv({ attr: { style: `
      max-width: var(--file-line-width); 
      margin-left: auto; 
      margin-right: auto;
    `}});

    // Heading
    const headingContainer = dashboardContainer.createEl("hgroup")
    headingContainer.createEl("h1", { text: `${moment().format("dddd, DD MMMM")}`})

    // const buttonsContainer = dashboardContainer.createDiv({ cls: "buttons" })
    // buildButtons(this.app, buttonsContainer)

    const plannerContainer = dashboardContainer.createDiv({ attr: { style: `
      display: flex;
      justify-content: center;
      width: 100%;  
  ` }})
    buildPlanner(this.app, plannerContainer)
  }
}

export const openDashboard = async (app: App) => {
  const { workspace } = app;

  let leaf: WorkspaceLeaf | null = null;
  const leaves = workspace.getLeavesOfType(VIEW_DASHBOARD);

  if (leaves.length > 0) {
    // A leaf with our view already exists, use that
    leaf = leaves[0];
  } else {
    // Our view could not be found in the workspace, create a new leaf
    // in the right sidebar for it
    leaf = workspace.getLeaf(false);
    if (!leaf) throw new Error("There is no leaf");
    await leaf.setViewState({ type: VIEW_DASHBOARD, active: true });
  }

  // "Reveal" the leaf in case it is in a collapsed sidebar
  workspace.revealLeaf(leaf);
}