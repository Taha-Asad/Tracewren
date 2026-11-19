# Professional v5 / forest revision

This folder is independent of the old v4 layout generators. The shared licensed icon SVGs are reused as assets; page composition, case contexts, forms and commands are new.

- `native.py`: tokens, editable primitives, source components and deferred native prototype interactions.
- `workspace.py`: navigation, stable identity, case stages, original report material and activity representation.
- `cases.py`: actor/lifecycle/attempt-specific report tabs and remediation spreads.
- `flows.py`: public program, focused submission, recovery confirmation, work desks and native loading choreography.
- `actions.py`: assessment, code/config evidence, deployment, retest and distinct closures.
- `admin.py`: SRS owner, account, key recovery, roster, capacity and audit families.
- `mobile.py`: 390px case reading and guest → failed retest → replacement → verification journey.
- `utilities.py`, `guides.py`: review entry, secondary outcomes, optional export and lifecycle guide.
- `check.py`: executes saved native interactions and checks geometry, contrast, destinations and case-context invariants.

Build with Python, then the installed FigCraft 0.7 CLI:

1. `python3 tools/design/professional-v5/build.py`
2. `figcraft cli run tools/design/professional-v5/commands.json --out figma/BugBountyTrack-Professional-v5.figcraft`
3. `python3 tools/design/professional-v5/extract.py figma/BugBountyTrack-Professional-v5.figcraft`
4. `python3 tools/design/professional-v5/check.py`

Exports use `file.export` with `ids: [nodeId]` from the saved file. A `node` argument is not accepted by that command. Native rebuilds stop on missing destinations and on variable bindings created before their variables exist. Fields contain prepared examples; file pickers, encryption, signatures, authentication and backend services do not execute in FigCraft.


The selected palette and reduced decoration follow the user’s image-1 feedback; image 2 is a grouping reference and image 3 has a separate simplified native study. `playback.py --launch` opens the local FigCraft control server on port 7995 if needed and verifies real mouse/scroll interaction. Runtime results and captures live in `figma/professional-v5/runtime/`.

After scalar layout changes, rebuild `commands.json` with `build.py`; generated command batches, ledgers and extracted JSON are ignored. The published artifact passed `check.py` and presenter playback. Illustration source and prompts are documented alongside the PNGs.
