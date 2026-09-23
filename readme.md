# GoNeet75

https://www.nicbarth.com/GoNeet75/

GoNeet75 is a browser-only Go practice app for the 75 NeetCode 150 problems that are not part of Blind 75. It includes categorized prompts, Go starter and reference solutions, three runnable cases per problem, local progress tracking, and compact diagrams for visual problems.

The original Blind 75 is considered completed and is preserved as a compact manifest in src/data/covered-blind75.json. Those problems are not shown in the active practice list.

## Requirements

- Bun
- Go 1.26, used to build the browser WebAssembly runtime

## Quick start

Install dependencies with:

    bun install

Start the development server with:

    make

Vite prints the local address, normally http://localhost:5173.

The first development start builds src/generated/goRuntimeWorker.js. The generated module embeds the Go WebAssembly interpreter, its loader, and the test worker, and is intentionally ignored by Git.

## Verification

Run the snapshot and generated-program checks:

    bun run test

Run every reference solution through the same Yaegi interpreter used in the browser:

    bun run verify:yaegi

Refresh the checked-in NeetCode snapshot from the pinned manifest:

    bun run import:problems

The importer retains the fixed covered manifest and replaces only src/data/neet75-problems.json.

## Single-file offline release

Build a standalone offline release with:

    make single-file

This creates dist/GoNeet75.html. It can be opened directly in a modern browser without a local server or additional assets.

## Make targets

| Command | Purpose |
| --- | --- |
| make or make dev | Build the Go runtime and start Vite. |
| make build | Produce a production bundle in dist/. |
| make clean | Remove generated dist/, src/generated/, and .cache/ files. |
| make single-file | Create the standalone dist/GoNeet75.html release. |
| make release | Clean and create a fresh standalone release. |
| make pages | Build dist/ for a GitHub Pages project site. |

## GitHub Pages

The default Pages asset base is /GoNeet75/. Override it when needed:

    make pages PAGES_BASE=/your-repository-name/

The workflow verifies the fixtures and Go runner before building and deploying dist/. Renaming the external GitHub repository is a separate hosting operation; this codebase does not change the Git remote.

## Browser storage

Solutions and completion state are stored locally in the browser database goneet75-go-practice. On first load, GoNeet75 deletes the old blind75-go-practice database so completed Blind 75 work cannot leak into the new list. If another old app tab holds that database open, close it and reload.

No account, server-side storage, or remote code execution is used. Problem content is checked into the repository, and submitted Go runs in the bundled browser worker.

## Attribution and license

Problem titles, statements, starter code, and reference solutions are imported from the public NeetCode practice metadata and adapted for the offline Go runner. See LICENSE for this repository's license.
