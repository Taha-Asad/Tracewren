# Native Professional v3 authoring

These Python helpers generate editable FigCraft layers and prototype actions. They do not create a production frontend, launch the GUI or start a server.

1. Run `python3 build.py` here to write `commands.json` and `ledger.json`.
2. Use the installed FigCraft CLI: `cli run commands.json --out BugBountyTrack-Professional-v3.figcraft`.
3. Export saved layers: `cli convert BugBountyTrack-Professional-v3.figcraft design.json`.
4. Run `python3 check.py` for geometry, text contrast, destinations and native action traces.
5. Run `python3 check_palette.py` to compare saved color values against the original `figma/design-tokens.json`.

`professional.py` owns the refined compositions. `native.py` owns shared tokens and components. The project’s `figma/assets/icons` contains the existing licensed Phosphor SVG sources. See `figma/professional-v3/LESSONS.md` for the design constraint. Both prior source editions are preserved.

These are saved-file checks; they do not establish GUI playback, browser accessibility or service security.
