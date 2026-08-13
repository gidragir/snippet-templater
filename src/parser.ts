export interface ParsedTemplate {
	language: string;
	cleanSource: string;
}

/**
 * Extracts language specified either in fence header (e.g. ```script-template lang:python)
 * or inline header line (# lang: python), defaulting to 'bash'.
 */
export function parseLanguageAndSource(
	source: string,
	fenceHeader?: string,
): ParsedTemplate {
	// 1. Try to parse from fence header (e.g. ```script-template lang:python or ```script-template python)
	if (fenceHeader) {
		const match = fenceHeader.match(
			/script-template(?::|\s+)+(?:lang[:=])?([a-zA-Z0-9_-]+)/i,
		);
		if (match && match[1]) {
			return {
				language: match[1],
				cleanSource: source,
			};
		}
	}

	// 2. Fallback: Try to parse from first line inside codeblock
	const lines = source.split('\n');
	const firstLine = lines[0]?.trim() ?? '';
	const match = firstLine.match(
		/^(?:#|\/\/|\/\*|<!--)?\s*lang:\s*([a-zA-Z0-9_-]+)/i,
	);

	if (match && match[1]) {
		return {
			language: match[1],
			cleanSource: lines.slice(1).join('\n'),
		};
	}

	return {
		language: 'bash',
		cleanSource: source,
	};
}

/**
 * Extracts unique variable names from template text matching $VAR or ${VAR} format.
 */
export function extractVariables(source: string): string[] {
	const regex = /\$\{([A-Za-z_][A-Za-z0-9_]*)\}|\$([A-Za-z_][A-Za-z0-9_]*)/g;
	const vars: string[] = [];
	let match: RegExpExecArray | null;

	while ((match = regex.exec(source)) !== null) {
		const varName = match[1] || match[2];
		if (varName && !vars.includes(varName)) {
			vars.push(varName);
		}
	}

	return vars;
}

/**
 * Substitutes variables in template text with user-provided values.
 * If a variable's value is empty or not provided, the original token ($VAR or ${VAR}) is retained.
 */
export function substituteVariables(
	source: string,
	values: Record<string, string>,
): string {
	const regex = /\$\{([A-Za-z_][A-Za-z0-9_]*)\}|\$([A-Za-z_][A-Za-z0-9_]*)/g;

	return source.replace(
		regex,
		(
			fullMatch: string,
			braceVar: string | undefined,
			simpleVar: string | undefined,
		) => {
			const varName = braceVar ?? simpleVar ?? '';
			const userVal = values[varName];

			if (userVal !== undefined && userVal !== '') {
				return userVal;
			}

			return fullMatch;
		},
	);
}
