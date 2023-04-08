# CursorGPT

## Important

> 💣 This project is still in development and is not yet ready to publish to NPM.

> 🤖 Performs poorly on `gpt-3.5-turbo`, much better results with `gpt-4`. GPT-4 seems to perform best with low 
> temperatures, and 3.5 seems to require higher temperatures. Note that higher temperatures will result in more 
> schema errors, so a retry mechanism is recommended.

## Overview

CursorGPT attempts to leverage the ChatGPT models via the OpenAI API to generate natural mouse movement events.
It requires an OpenAI API key to run which you can set up [here](https://platform.openai.com/docs/api-reference).

## Installation

```bash
# NPM
npm install cursor-gpt

# PNPM
pnpm install cursor-gpt

# Yarn
yarn add cursor-gpt
```

## Configuration

There are two ways to configure the CursorGPT instance.

### Environment Variables

```dotenv
OPENAI_API_KEY=your-openai-api-key
OPENAI_ORGANIZATION=your-openai-organization
OPENAI_MODEL=gpt-3.5-turbo|gpt4|etc
```

### Runtime Config

```typescript
interface CursorGptConfig {
	/** OpenAI API key */
	apiKey: string
	/** OpenAI organization */
	organization: string
	/** OpenAI model */
	model: string
}
``` 

## Usage

```typescript
import { CursorGPT } from "cursor-gpt"

// 1. Initialize the CursorGPT instance.
const cursor = new CursorGPT({
	apiKey: "your-openai-api-key", // Leave blank to use the OPENAI_API_KEY environment variable.
	organization: "your-openai-organization", // Leave blank to use the OPENAI_ORGANIZATION environment variable.
})

// 2. Generate a path, which returns an array of points.
const points = await cursor.completePath({
	// Start position of the cursor.
	start: { x: 0, y: 0 },
	// End position of the cursor.
	end: { x: 100, y: 100 },
	// Duration of the cursor movement in milliseconds.
	duration: 1000,
})

```

## Plugins

Important: Plugins are not yet fully implemented or tested, consider these examples only at this point.

### Puppeteer

```typescript
import { launch } from "puppeteer-core"
import { usePuppeteerPlugin } from "cursor-gpt"

const browser = await launch({
	executablePath: "path/to/chrome",
	headless: false,
})

const page = await browser.newPage()

const { executePath } = usePuppeteerPlugin({
	apiKey: "your-openai-api-key",
	organization: "your-openai-organization",
})

await executePath(page, {
	start: { x: 0, y: 0 },
	end: { x: 100, y: 100 },
	duration: 1000,
})

``` 

## Utilities

### Path Prompts

You can adjust the internal prompt arrays if you want to experiment with different approaches.
The following methods are available:

- `pathPrompts` The raw internal array of prompts with can be modified directly if desired.
- `getPathPrompts()` Collects and sorts current prompts in order and returns them as a string array.
- `updatePathPrompt(name: string, content: string)` Updates the prompt for the given path name, returns `true` if
	successful.

## Roadmap

- [ ] Test and add more plugins.
- [ ] Add option to generate a path with a specific number of points.
- [ ] Add option to generate paths in bulk when paths are known.
- [ ] Test coverage > 80%.
- [ ] Build curve checker for GPT-3.5 to search for straight line responses. 
- [ ] Add runtime test to ensure final point and timestamp is correct.

## Sample Results

Note: The following results are generated using the `gpt-4` model, `gpt-3.5-turbo` performs significantly worse 
presently.

You can preview generated paths in this [jsfiddle tool](https://jsfiddle.net/darkpatterns/abhtuvro/30/ ).

```typescript
await cursor.completePath({
	start: { x: 0, y: 100 },
	end: { x: 500, y: 600 },
	duration: 1200,
})
```

```js
[
	{ x: 0, y: 100, deltaTime: 0, timestamp: 1680928631398 },
	{ x: 20, y: 130, deltaTime: 100, timestamp: 1680928631498 },
	{ x: 60, y: 180, deltaTime: 150, timestamp: 1680928631648 },
	{ x: 120, y: 250, deltaTime: 200, timestamp: 1680928631848 },
	{ x: 200, y: 320, deltaTime: 180, timestamp: 1680928632028 },
	{ x: 300, y: 420, deltaTime: 170, timestamp: 1680928632198 },
	{ x: 400, y: 520, deltaTime: 200, timestamp: 1680928632398 },
	{ x: 460, y: 580, deltaTime: 100, timestamp: 1680928632498 },
	{ x: 500, y: 600, deltaTime: 100, timestamp: 1680928632598 }
]
```

### Comparison
![image](https://user-images.githubusercontent.com/65471523/230708415-7cdb9685-d59a-44f5-ab25-5ab96ed21cf1.png)

