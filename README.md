# Snippet Templater for Obsidian

**Snippet Templater** is an Obsidian plugin that transforms static code snippets and templates into interactive live widgets. It automatically extracts variables from your code blocks, renders dynamic input fields, and provides live output preview with real-time substitution and syntax highlighting.

---

## Features

- ⚡ **Automatic Variable Extraction**: Automatically detects variables written as `$VARIABLE` or `${VARIABLE}`.
- 🎛️ **Live Interactive Inputs**: Generates input fields for detected variables directly inside your note.
- 👁️ **Side-by-Side Live Preview**: Updates the formatted result in real time as you type.
- 🎨 **Code Block Highlighting**: Retains full syntax highlighting for languages (Docker, Bash, Python, SQL, YAML, etc.).
- 🏷️ **Multiple Codeblock Identifiers**: Works seamlessly with ```snippet-templater```, ```snippet-template```, and ```script-template```.
- 💬 **Flexible Language Overrides**: Specify target language in the fence header (e.g. ```` ```snippet-template lang:python ````) or on the first line inside the block (`# lang: python` or `// lang: typescript`).

---

## Installation

### From Community Plugins
*(Coming soon once accepted into the Obsidian Community Catalog)*

### Manual Installation
1. Download the latest release (`main.js`, `manifest.json`, and `styles.css`) from the [Releases](https://github.com/gidragir/snippet-templater/releases) page.
2. Create a folder named `snippet-templater` inside your vault's plugin directory:
   `<VaultPath>/.obsidian/plugins/snippet-templater/`
3. Move the downloaded files into that folder.
4. Reload Obsidian and enable **Snippet Templater** in **Settings → Community plugins**.

---

## How to Use & Examples

To turn any snippet into an interactive template, wrap your code in a code block with one of the supported language specifiers (`snippet-templater`, `snippet-template`, or `script-template`).

### Example 1: Docker Build & Push Script

```markdown
```snippet-template lang:bash
IMAGE="my-app"
TAG="latest"

docker build -t $IMAGE:$TAG .
docker push $IMAGE:$TAG
```
```

**What happens**:
1. The plugin extracts `$IMAGE` and `$TAG`.
2. Input fields for `IMAGE` and `TAG` appear on the left.
3. The right column displays the ready-to-run bash script updating live as values are entered.

---

### Example 2: Python Data Processing Script

```markdown
```script-template
# lang: python
import pandas as pd

df = pd.read_csv("${INPUT_FILE}")
filtered = df[df["status"] == "${STATUS}"]
filtered.to_json("${OUTPUT_FILE}")
```
```

**What happens**:
1. Language is parsed from the `# lang: python` directive on the first line.
2. Input fields for `INPUT_FILE`, `STATUS`, and `OUTPUT_FILE` are generated.
3. Braced variables like `${INPUT_FILE}` are replaced cleanly upon typing.

---

### Example 3: SQL Query Template

```markdown
```snippet-templater lang:sql
SELECT id, username, email, created_at
FROM users
WHERE status = '$USER_STATUS'
  AND created_at >= '$START_DATE'
LIMIT $LIMIT_COUNT;
```
```

---

## Code Block Syntax Reference

### 1. Specifying Code Language
By default, snippets fall back to `bash`. You can specify any language supported by Obsidian using either:

- **Fence Header syntax**:
  ````markdown
  ```script-template lang:python
  print("Hello, $NAME")
  ```
  ````

- **First-line comment directive**:
  ````markdown
  ```script-template
  // lang: typescript
  const user: string = "$USER_NAME";
  ```
  ````

### 2. Variable Syntax
The parser detects two variable formats:
- `$VARIABLE_NAME`
- `${VARIABLE_NAME}`

Variables must start with a letter or underscore followed by alphanumeric characters or underscores (`[A-Za-z_][A-Za-z0-9_]*`).

---

## Development & Building

This project requires [Node.js](https://nodejs.org/) (v18+) and [pnpm](https://pnpm.io/).

### Setup
```bash
pnpm install
```

### Development (Watch mode)
```bash
pnpm run dev
```

### Build for Production
```bash
pnpm run build
```

### Linting
```bash
pnpm run lint
```

### Releasing
Release process is automated with `release-it`:
```bash
pnpm release
```

---

## License

[0-BSD License](LICENSE)
