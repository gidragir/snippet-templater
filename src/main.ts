import {
	MarkdownPostProcessorContext,
	Plugin,
} from 'obsidian';
import { renderScriptTemplateBlock } from './processor';
import { DEFAULT_SETTINGS, SnippetTemplaterSettings, SnippetTemplaterSettingTab } from './settings';

export default class SnippetTemplaterPlugin extends Plugin {
	settings!: SnippetTemplaterSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new SnippetTemplaterSettingTab(this.app, this));

		const processor = (
			source: string,
			el: HTMLElement,
			ctx: MarkdownPostProcessorContext,
		) => {
			let fenceHeader = '';
			const sectionInfo = ctx.getSectionInfo(el);
			if (sectionInfo) {
				const lines = sectionInfo.text.split('\n');
				fenceHeader = lines[sectionInfo.lineStart] || '';
			}

			renderScriptTemplateBlock(
				source,
				el,
				this.app,
				this,
				ctx.sourcePath,
				fenceHeader,
			);
		};

		this.registerMarkdownCodeBlockProcessor('snippet-templater', processor);
		this.registerMarkdownCodeBlockProcessor('snippet-template', processor);
		this.registerMarkdownCodeBlockProcessor('script-template', processor);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<SnippetTemplaterSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	onunload() {}
}
