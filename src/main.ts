import {
	MarkdownPostProcessorContext,
	Plugin,
} from 'obsidian';
import { renderScriptTemplateBlock } from './processor';

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

	onunload() {}
}
