# CursorGPT

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

## Roadmap

- [ ] Test and add more plugins.
- [ ] Add option to generate a path with a specific number of points.
- [ ] Add option to generate paths in bulk when paths are known.
- [ ] Test coverage > 80%.

## Sample Results

```typescript
await cursor.completePath({
	start: { x: 0, y: 100 },
	end: { x: 500, y: 600 },
	duration: 1200,
})
```

```js
[
	{ x: 0, y: 100, deltaTime: 0, timestamp: 1680921845720 },
	{ x: 10, y: 110, deltaTime: 50, timestamp: 1680921845770 },
	{ x: 20, y: 120, deltaTime: 30, timestamp: 1680921845800 },
	{ x: 30, y: 130, deltaTime: 40, timestamp: 1680921845840 },
	{ x: 40, y: 140, deltaTime: 20, timestamp: 1680921845860 },
	{ x: 50, y: 150, deltaTime: 60, timestamp: 1680921845920 },
	{ x: 60, y: 160, deltaTime: 10, timestamp: 1680921845930 },
	{ x: 70, y: 170, deltaTime: 70, timestamp: 1680921846000 },
	{ x: 80, y: 180, deltaTime: 40, timestamp: 1680921846040 },
	{ x: 90, y: 190, deltaTime: 30, timestamp: 1680921846070 },
	{ x: 100, y: 200, deltaTime: 50, timestamp: 1680921846120 },
	{ x: 110, y: 210, deltaTime: 20, timestamp: 1680921846140 },
	{ x: 120, y: 220, deltaTime: 60, timestamp: 1680921846200 },
	{ x: 130, y: 230, deltaTime: 10, timestamp: 1680921846210 },
	{ x: 140, y: 240, deltaTime: 50, timestamp: 1680921846260 },
	{ x: 150, y: 250, deltaTime: 30, timestamp: 1680921846290 },
	{ x: 160, y: 260, deltaTime: 40, timestamp: 1680921846330 },
	{ x: 170, y: 270, deltaTime: 20, timestamp: 1680921846350 },
	{ x: 180, y: 280, deltaTime: 70, timestamp: 1680921846420 },
	{ x: 190, y: 290, deltaTime: 10, timestamp: 1680921846430 },
	{ x: 200, y: 300, deltaTime: 50, timestamp: 1680921846480 },
	{ x: 210, y: 310, deltaTime: 30, timestamp: 1680921846510 },
	{ x: 220, y: 320, deltaTime: 40, timestamp: 1680921846550 },
	{ x: 230, y: 330, deltaTime: 20, timestamp: 1680921846570 },
	{ x: 240, y: 340, deltaTime: 60, timestamp: 1680921846630 },
	{ x: 250, y: 350, deltaTime: 10, timestamp: 1680921846640 },
	{ x: 260, y: 360, deltaTime: 50, timestamp: 1680921846690 },
	{ x: 270, y: 370, deltaTime: 30, timestamp: 1680921846720 },
	{ x: 280, y: 380, deltaTime: 40, timestamp: 1680921846760 },
	{ x: 290, y: 390, deltaTime: 20, timestamp: 1680921846780 },
	{ x: 300, y: 400, deltaTime: 70, timestamp: 1680921846850 },
	{ x: 310, y: 410, deltaTime: 10, timestamp: 1680921846860 },
	{ x: 320, y: 420, deltaTime: 50, timestamp: 1680921846910 },
	{ x: 330, y: 430, deltaTime: 30, timestamp: 1680921846940 },
	{ x: 340, y: 440, deltaTime: 40, timestamp: 1680921846980 },
	{ x: 350, y: 450, deltaTime: 20, timestamp: 1680921847000 },
	{ x: 360, y: 460, deltaTime: 60, timestamp: 1680921847060 },
	{ x: 370, y: 470, deltaTime: 10, timestamp: 1680921847070 },
	{ x: 380, y: 480, deltaTime: 50, timestamp: 1680921847120 },
	{ x: 390, y: 490, deltaTime: 30, timestamp: 1680921847150 },
	{ x: 400, y: 500, deltaTime: 40, timestamp: 1680921847190 },
	{ x: 410, y: 510, deltaTime: 20, timestamp: 1680921847210 },
	{ x: 420, y: 520, deltaTime: 70, timestamp: 1680921847280 },
	{ x: 430, y: 530, deltaTime: 10, timestamp: 1680921847290 },
	{ x: 440, y: 540, deltaTime: 50, timestamp: 1680921847340 },
	{ x: 450, y: 550, deltaTime: 30, timestamp: 1680921847370 },
	{ x: 460, y: 560, deltaTime: 40, timestamp: 1680921847410 },
	{ x: 470, y: 570, deltaTime: 20, timestamp: 1680921847430 },
	{ x: 480, y: 580, deltaTime: 60, timestamp: 1680921847490 },
	{ x: 490, y: 590, deltaTime: 10, timestamp: 1680921847500 },
	{ x: 500, y: 600, deltaTime: 50, timestamp: 1680921847550 }
]
```

