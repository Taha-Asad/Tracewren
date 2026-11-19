# Native Professional v4 authoring

`illustrations.py` owns the original editable vector illustration set and the illustrated finding/remediation panels. SVG sources are in `figma/assets/illustrations/`. `visual_hooks.py` owns request-path diagrams, milestone tracks, severity bars, timeline nodes, disclosure components, case drawers and evidence inspectors. `refinement.py` owns case identity, tabs, action permissions and canonical lifecycle routing. `native.py` supplies reusable components, semantic variables and Auto Layout.

Rebuild from the project root with the installed FigCraft CLI:

1. `python3 tools/design/professional-v4/build.py`
2. `cli run tools/design/professional-v4/commands.json --out figma/BugBountyTrack-Professional-v4.figcraft`
3. `cli convert figma/BugBountyTrack-Professional-v4.figcraft tools/design/professional-v4/design.json`
4. `python3 tools/design/professional-v4/reading_states.py`
5. `cli run tools/design/professional-v4/reading-reflow.json --in tools/design/professional-v4/reading-states.json --out figma/BugBountyTrack-Professional-v4.figcraft`
6. Convert the finished native file to `tools/design/professional-v4/design.json` again.
7. Run `check.py` and `check_reading.py` from this directory.

**The reading-state compilation is required.** FigCraft’s presenter does not reflow surrounding Auto Layout when a visibility variable or component variant changes size. The compiler resolves disclosures into explicit, editable open/closed snapshots on page 14, preserving case identity and the return route. Other secondary sections return to their default state when a different optional disclosure is opened. Essential reproduction text remains visible; request code starts expanded.

For actual presenter checks, open v4 with `--control 7994` and run `python3 tools/design/professional-v4/playback_hooks.py`. `playback.py` covers the submission/failed-retest/replacement/closure journey. Script-generated command dumps, intermediate JSON and logs are local build outputs.

The deliverable is the native file with documentation, exports and verification evidence. Prepared inputs demonstrate service outcomes; no cryptography, signatures or backend services execute inside the prototype.

For an existing finished v4, `add_illustrations.py` creates an in-place native patch and an updated ledger. Apply `illustration-patch.json` to the native file, then adopt `illustration-ledger.json` as `ledger.json`, convert the saved file and run both native checks. This preserves the prepared reading states and all case interaction IDs. Do not apply this patch twice to the same already illustrated file.
