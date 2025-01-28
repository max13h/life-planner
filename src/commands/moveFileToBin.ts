import { Editor, MarkdownFileInfo, MarkdownView, Notice } from 'obsidian';
import type { LifePlannerSettings } from 'src/settings/settings';

export const moveFileToBin = async (editor: Editor, view: MarkdownView | MarkdownFileInfo, settings: LifePlannerSettings) => {

  if (!editor || !view) throw new Error('Missing editor or view')
  const currentFile = view.file
  const app = view.app
  if (!currentFile) return new Notice('No file selected');

  // Create _bin directory if it doesn't exist
  const binFolder = settings.binFolder;
  if (!await app.vault.adapter.exists(binFolder)) {
    await app.vault.createFolder(binFolder);
  }
  try {
    await app.fileManager.renameFile(currentFile, `${binFolder}/${currentFile.basename}.md`);
    new Notice('File moved to bin');
  } catch (error) {
    new Notice(error) 
  }
}
