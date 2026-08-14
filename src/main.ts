import {
	MarkdownPostProcessorContext,
	Plugin,
} from 'obsidian';
import { ScriptTemplateRenderChild } from './processor';

export default class SnippetTemplaterPlugin extends Plugin {
	async onload() {
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

			const child = new ScriptTemplateRenderChild(
				el,
				this.app,
				source,
				ctx.sourcePath,
				fenceHeader,
			);
			ctx.addChild(child);
		};

		this.registerMarkdownCodeBlockProcessor('snippet-templater', processor);
		this.registerMarkdownCodeBlockProcessor('snippet-template', processor);
		this.registerMarkdownCodeBlockProcessor('script-template', processor);
	}

	onunload() {}
}
