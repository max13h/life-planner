import { App, ItemView, TFile, WorkspaceLeaf, getAllTags, moment } from 'obsidian';
import { AppWithPlugin, ProjectViewObject } from 'types';
import { renderHeading } from './render/heading';
import { renderProjects } from './render/projects/projects';
import { Projects } from 'src/classes/projects/projects';
import { getChildrenProjects } from 'src/utils/projects/filters';
import { Tasks } from 'src/classes/tasks/tasks';
import Task from 'src/classes/task/task';
import { renderUnassignedTasks } from './render/renderUnassignedTasks';

export const VIEW_LIFE_PLANNER_PROJECTS = 'VIEW_LIFE_PLANNER_PROJECTS';

export class ProjectsView extends ItemView {
  private refreshView: () => Promise<void>;

  constructor(leaf: WorkspaceLeaf, app: App) {
    super(leaf);
    this.app = app
    this.icon = "folder-heart"
    this.navigation = true

    this.refreshView = this.onOpen.bind(this);
  }

  getViewType() {
    return VIEW_LIFE_PLANNER_PROJECTS;
  }

  getDisplayText() {
    return 'Projects';
  }

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    container.addClass("projectsView")

    const viewContainer = container.createDiv({ attr: { style: `
      max-width: var(--file-line-width); 
      margin-left: auto; 
      margin-right: auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    `}});

    renderHeading(viewContainer, this.refreshView)
    await renderUnassignedTasks(this.app as AppWithPlugin, viewContainer, this.refreshView)

    const projectsObject = await this.getProjectsObject(this.app as AppWithPlugin)
    await renderProjects(this.app as AppWithPlugin, viewContainer, this.leaf, projectsObject, this.refreshView)

    // Handle update view
    const taskFile: TFile = await Tasks.getFile(this.app as AppWithPlugin)
    const taskFileContent: string[] = (await this.app.vault.cachedRead(taskFile)).split("\n")
    this.registerEvent(this.app.vault.on('modify', async (newFile) => {
      if (newFile.path !== taskFile.path) return

      const newTFile: TFile | null = this.app.vault.getFileByPath(newFile.path)
      if (!newTFile) return

      const newContent: string[] = (await this.app.vault.cachedRead(newTFile)).split("\n")

      if (newContent.length > taskFileContent.length) await this.onOpen()
    }));
    // this.registerEvent(this.app.vault.on('create', async (newFile) => {

    //   // const newTFile: TFile | null = this.app.vault.getFileByPath(newFile.path)
    //   // if (!newTFile) return

    //   // const newContent: string[] = (await this.app.vault.cachedRead(newTFile)).split("\n")

    //   // if (newContent.length > taskFileContent.length) await this.onOpen()
    // }));
  }
  
  private async getProjectsObject(app: AppWithPlugin): Promise<ProjectViewObject[]> {
    const projectFiles = await Projects.getFiles(app);
    const metadataCache = app.metadataCache;
    
    const hasParentProject = (file: TFile): boolean => 
      !!metadataCache.getFileCache(file)?.frontmatter?.['parent_project'];
  
    const getProjectTasks = (file: TFile): Promise<Task[]> =>
      Tasks.getTasksFromProperties(app, {
        status: [" ", "/"],
        projectLink: `[[${file.path}]]` 
      });
  
    const buildProjectTree = async (file: TFile): Promise<ProjectViewObject> => {
      const [
        childrenProjects,
        tasks
      ] = await Promise.all([
        Promise.all(
          getChildrenProjects(app, file, projectFiles)
            .map(buildProjectTree)
        ),
        getProjectTasks(file)
      ]);
  
      return {
        file,
        childrenProjects,
        tasks,
        hasParentProject: hasParentProject(file)
      };
    };
  
    const allProjects = await Promise.all(
      projectFiles.map(buildProjectTree)
    );
  
    return allProjects.filter(project => !project.hasParentProject);
  }
}