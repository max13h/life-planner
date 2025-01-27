import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { LifePlannerSettings, DEFAULT_SETTINGS, LifePlannerSettingTab } from "src/settings/settings";

export default class LifePlanner extends Plugin {
	settings: LifePlannerSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new LifePlannerSettingTab(this.app, this));

	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}