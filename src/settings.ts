import { App, PluginSettingTab, Setting } from 'obsidian';
import type SnippetTemplaterPlugin from './main';

export interface SnippetTemplaterSettings {
	mySetting: string;
}

export const DEFAULT_SETTINGS: SnippetTemplaterSettings = {
	mySetting: 'default',
};

export class SnippetTemplaterSettingTab extends PluginSettingTab {
	plugin: SnippetTemplaterPlugin;

	constructor(app: App, plugin: SnippetTemplaterPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Settings #1')
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder('Enter your secret')
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value: string) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}
