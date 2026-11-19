# Native Coffee v2 authoring

These Python helpers generate native FigCraft commands, layers, components and interactions. They do not start an app, browser, server or production frontend.

1. Run `python3 build.py` in this directory to write `commands.json` and `ledger.json`.
2. Use the installed FigCraft CLI: `cli run commands.json --out BugBountyTrack-Coffee-v2.figcraft`.
3. Export saved native layer data: `cli convert BugBountyTrack-Coffee-v2.figcraft design.json`.
4. Run `python3 check.py` to validate geometry, contrast, references and parsed action traces.

The project’s existing `figma/assets/icons` contains the licensed Phosphor SVG sources used by the native library. `coffee.py` contains the v2 compositions; `native.py` owns tokens and shared component construction. The original helper directory is preserved. A saved native file can be opened manually in FigCraft; CLI checks do not prove GUI playback or implementation security.
