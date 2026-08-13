import { App, Component, MarkdownRenderer, Notice } from 'obsidian';
import {
	extractVariables,
	parseLanguageAndSource,
	substituteVariables,
} from './parser';

/**
 * Renders an interactive 2-column widget for `script-template` code blocks.
 */
export function renderScriptTemplateBlock(
	source: string,
	el: HTMLElement,
	app: App,
	component: Component,
	sourcePath: string,
	fenceHeader?: string,
): void {
	el.empty();

	const { language, cleanSource } = parseLanguageAndSource(source, fenceHeader);
	const variables = extractVariables(cleanSource);
	const values: Record<string, string> = {};

	// Main 2-column container
	const containerEl = el.createDiv({ cls: 'script-template-container' });

	// Left Column
	const leftCol = containerEl.createDiv({
		cls: 'script-template-col script-template-left',
	});

	// Left Top: Inputs section
	const inputsSection = leftCol.createDiv({
		cls: 'script-template-section script-template-inputs-section',
	});
	inputsSection.createDiv({
		text: 'Переменные',
		cls: 'script-template-section-title',
	});

	const inputsContainer = inputsSection.createDiv({
		cls: 'script-template-inputs',
	});

	if (variables.length === 0) {
		inputsContainer.createDiv({
			text: 'Переменные не найдены',
			cls: 'script-template-empty',
		});
	} else {
		variables.forEach((varName) => {
			const groupEl = inputsContainer.createDiv({
				cls: 'script-template-input-group',
			});

			groupEl.createEl('label', {
				text: `$${varName}`,
				cls: 'script-template-label',
			});

			const inputEl = groupEl.createEl('input', {
				type: 'text',
				placeholder: `Значение для $${varName}...`,
				cls: 'script-template-input',
			});

			inputEl.addEventListener('input', () => {
				values[varName] = inputEl.value;
				updatePreview();
			});
		});
	}

	// Left Bottom: Source template preview section
	const sourceSection = leftCol.createDiv({
		cls: 'script-template-section script-template-source-section',
	});
	sourceSection.createDiv({
		text: 'Исходный шаблон',
		cls: 'script-template-section-title',
	});

	const sourcePreContainer = sourceSection.createDiv({
		cls: 'script-template-code-pre',
	});

	void MarkdownRenderer.render(
		app,
		`\`\`\`${language}\n${cleanSource}\n\`\`\``,
		sourcePreContainer,
		sourcePath,
		component,
	);

	// Right Column
	const rightCol = containerEl.createDiv({
		cls: 'script-template-col script-template-right',
	});

	// Right Top: Copy action section
	const actionsSection = rightCol.createDiv({
		cls: 'script-template-section script-template-actions-section',
	});

	const copyBtn = actionsSection.createEl('button', {
		text: 'Скопировать',
		cls: 'mod-cta script-template-copy-btn',
	});

	// Right Bottom: Result preview section
	const previewSection = rightCol.createDiv({
		cls: 'script-template-section script-template-preview-section',
	});
	previewSection.createDiv({
		text: 'Итоговый результат',
		cls: 'script-template-section-title',
	});

	const resultPreContainer = previewSection.createDiv({
		cls: 'script-template-code-pre',
	});

	// Helper to recalculate live preview
	const getCurrentResult = (): string =>
		substituteVariables(cleanSource, values);

	const updatePreview = (): void => {
		resultPreContainer.empty();
		const currentText = getCurrentResult();
		void MarkdownRenderer.render(
			app,
			`\`\`\`${language}\n${currentText}\n\`\`\``,
			resultPreContainer,
			sourcePath,
			component,
		);
	};

	// Copy button event listener
	copyBtn.addEventListener('click', () => {
		void (async () => {
			const textToCopy = getCurrentResult();
			try {
				await navigator.clipboard.writeText(textToCopy);
				new Notice('Скопировано!');
			} catch (err) {
				console.error('Failed to copy text: ', err);
				new Notice('Ошибка копирования');
			}
		})();
	});

	// Initial render update
	updatePreview();
}
