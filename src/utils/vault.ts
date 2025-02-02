import { VaultError } from 'errors';
import { App, TFile } from 'obsidian';

/**
 * Formats a file path to ensure it has the correct .md extension and proper structure
 * @param path The path to format
 * @returns The formatted path
 * @throws VaultError if path format is invalid
 */
export const formatFilePath = (path: string): string => {
  // Remove .md extension if present to normalize the path
  const pathWithoutExtension = path.replace(/\.md$/, '');
  
  // Validate path format
  if (pathWithoutExtension.startsWith('/')) {
    throw new VaultError("File path must not start with a '/'");
  }
  if (pathWithoutExtension.endsWith('/')) {
    throw new VaultError("File path must not end with a '/'");
  }
  
  // Add .md extension
  return `${pathWithoutExtension}.md`;
};

/**
 * Splits a file path into folder path and file name
 * @param path The full path to split
 * @returns Object containing folderPath and fileName
 */
export const splitFilePath = (path: string): { folderPath: string; fileName: string } => {
  const formattedPath = formatFilePath(path);
  const lastSlashIndex = formattedPath.lastIndexOf('/');
  
  if (lastSlashIndex === -1) {
    return {
      folderPath: '',
      fileName: formattedPath.replace(/\.md$/, '')
    };
  }
  
  return {
    folderPath: formattedPath.slice(0, lastSlashIndex),
    fileName: formattedPath.slice(lastSlashIndex + 1).replace(/\.md$/, '')
  };
};

/**
 * Ensures a folder exists, creating it if necessary
 * @param app Obsidian App instance
 * @param folderPath Path to the folder
 * @throws VaultError if folder creation fails
 */
export const ensureFolder = async (app: App, folderPath: string): Promise<void> => {
  if (!folderPath) return; // No folder to create for root files
  
  const existingFolder = app.vault.getAbstractFileByPath(folderPath);
  if (!existingFolder) {
    try {
      await app.vault.createFolder(folderPath);
    } catch (error) {
      if (!error.message.includes("Folder already exists")) {
        throw new VaultError(`Failed to create folder: ${error.message}`);
      }
    }
  }
};

/**
 * Reads and returns the content of a template file
 * @param app Obsidian App instance
 * @param templatePath Path to the template
 * @returns Template content
 * @throws VaultError if template is not found or cannot be read
 */
export const applyTemplate = async (app: App, templatePath: string): Promise<string> => {
  const formattedTemplatePath = formatFilePath(templatePath);
  const templateFile = app.vault.getAbstractFileByPath(formattedTemplatePath);
  
  if (!templateFile || !(templateFile instanceof TFile)) {
    throw new VaultError('Template file not found');
  }
  
  try {
    return await app.vault.read(templateFile);
  } catch (error) {
    throw new VaultError(`Failed to read template: ${error.message}`);
  }
};

/**
 * Gets an existing file or creates it with optional template content
 * @param app Obsidian App instance
 * @param path Path to the file
 * @param templatePath Optional path to a template file
 * @returns The file
 * @throws VaultError if file operations fail
 */
export const getOrCreateFile = async (app: App, path: string, templatePath?: string): Promise<TFile> => {
  const formattedPath = formatFilePath(path);
  const { folderPath } = splitFilePath(formattedPath);
  
  // Ensure folder exists
  await ensureFolder(app, folderPath);
  
  // Check if file exists
  const existingFile = app.vault.getAbstractFileByPath(formattedPath);
  if (existingFile instanceof TFile) {
    return existingFile;
  }
  
  // Create new file with template if provided
  const content = templatePath ? await applyTemplate(app, templatePath) : '';
  try {
    const newFile = await app.vault.create(formattedPath, content);
    if (!(newFile instanceof TFile)) {
      throw new VaultError('Created file is not a TFile');
    }
    return newFile;
  } catch (error) {
    throw new VaultError(`Failed to create file: ${error.message}`);
  }
};

/**
 * Ensures a file exists with specific content
 * @param app Obsidian App instance
 * @param path Path to the file
 * @param content Content to write if file doesn't exist
 * @returns The file
 * @throws VaultError if file operations fail
 */
export const ensureFile = async (app: App, path: string, content: string): Promise<TFile> => {
  const formattedPath = formatFilePath(path);
  const { folderPath } = splitFilePath(formattedPath);
  
  await ensureFolder(app, folderPath);
  
  const existingFile = app.vault.getAbstractFileByPath(formattedPath);
  if (existingFile instanceof TFile) {
    return existingFile;
  }
  
  try {
    const newFile = await app.vault.create(formattedPath, content);
    if (!(newFile instanceof TFile)) {
      throw new VaultError('Created file is not a TFile');
    }
    return newFile;
  } catch (error) {
    throw new VaultError(`Failed to create file: ${error.message}`);
  }
};