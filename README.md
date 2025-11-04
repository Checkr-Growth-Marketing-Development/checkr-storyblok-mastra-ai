# Netlify Deployment Issue - Minimal Reproduction

This is a minimal reproduction repository for a Netlify deployment error with Mastra framework.

## Tech Stack

- **Mastra** (v0.17.7) - AI framework with Netlify deployer
- **@mastra/deployer-netlify** (v0.13.16)
- **TypeScript** - Type-safe development
- **Node.js** >= 20.9.0

## Reproduction Steps

1. Clone this repository:
```bash
git clone <repo-url>
cd checkr-mastra-storyblok-server
```

2. Install dependencies:
```bash
npm install
```

3. **(Optional)** Create a `.env` file - not required to reproduce the error:
```env
OPENAI_API_KEY=your_openai_api_key
STORYBLOK_PREVIEW_TOKEN=your_storyblok_preview_token
STORYBLOK_OAUTH_TOKEN=your_storyblok_oauth_token
```

4. Attempt to build and serve locally:
```bash
netlify build
netlify serve
```

Or deploy to Netlify:
```bash
netlify deploy --prod
```

## Expected Behavior

The application should successfully build and run on Netlify, similar to how it works with `netlify dev`.

## Actual Behavior

✅ **Works correctly**: `netlify dev` starts the local dev server without issues.

❌ **Fails**: Both local production build (`netlify build` + `netlify serve`) and actual Netlify deployment fail with the following error:

```
TypeError: R is not a function
    at file:///var/task/___netlify-bootstrap.mjs:7:87029
    at AsyncLocalStorage.run (node:async_hooks:346:14)
    at ZC (file:///var/task/___netlify-bootstrap.mjs:7:87019)
    at async Runtime.handler (file:///var/task/___netlify-bootstrap.mjs:7:86244)
    at async Runtime.handleOnceStreaming (file:///var/runtime/index.mjs:1348:26)
```

## Requirements

- Node.js >= 20.9.0
- npm or compatible package manager
