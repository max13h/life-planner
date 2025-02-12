import { Plugin } from 'obsidian';
import { Commands } from 'src/commands';
import { LifePlannerSettings, DEFAULT_SETTINGS, LifePlannerSettingTab } from "src/settings/settings";
import { Views } from 'src/views';

export default class LifePlanner extends Plugin {
	settings: LifePlannerSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new LifePlannerSettingTab(this.app, this));

		new Commands({ plugin: this });
		new Views({ plugin: this });
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