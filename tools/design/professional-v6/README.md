# Professional v6 / product refinement

V6 began from the supplied authorization-boundary concept. The 21 October product refinement responds to feedback that the earlier treatment felt artificial. Earlier native files and the original v6 edition are preserved.

## Authoring

- `refine.py`: applies restrained typography, neutral tokens, task-specific evidence and contextual form errors after authoring, preserving existing native IDs and routes.
- `native.py`: semantic color variables, editable primitives, shared components, type styles and prototype interactions.
- `workspace.py`: light navigation, report identity, readable finding, comparison, reproduction and assessment.
- `diagrams.py`: native workspace-response diagrams with a stacked layout for narrow spaces.
- `cases.py`: role, lifecycle and attempt-specific tabs; deployment, evidence and chronology.
- `flows.py`, `actions.py`: disclosure, intake, triage, proposals, deployment and attestation.
- `admin.py`, `mobile.py`: organization, identity, recovery, audit, capacity and 390px journeys.
- `edges.py`: focused empty/error/recovery/conflict states with return paths.
- `utilities.py`, `guides.py`: review starts, approved source, foundations and requirements coverage.
- `check.py`: saved-file geometry, text contrast, native destinations and connected journey checks.
- `previews.py`, `contact.py`: full viewport exports, thumbnails, contact sheets and a searchable gallery.

## Rebuild

```bash
python3 tools/design/professional-v6/build.py
/home/thefoolishcrow/Applications/figcraft-0.7.0-linux-x86_64.AppImage cli run tools/design/professional-v6/commands.json --out figma/BugBountyTrack-Professional-v6.figcraft
python3 tools/design/professional-v6/extract.py figma/BugBountyTrack-Professional-v6.figcraft
python3 tools/design/professional-v6/check.py
python3 tools/design/professional-v6/previews.py
/home/thefoolishcrow/Applications/figcraft-0.7.0-linux-x86_64.AppImage cli run tools/design/professional-v6/exports.json --in figma/BugBountyTrack-Professional-v6.figcraft
python3 tools/design/professional-v6/contact.py
```

Long form and report frames contain native vertical scrolling. Exported PNGs show their initial viewport. Prepared inputs and service outcomes are design fixtures; file pickers, downloads, cryptography, backend permission checks and authentication do not execute.

The refinement can also be applied to the archived pre-refinement file with `refinement-commands.json`; it must be applied once because that batch appends new evidence layers. The normal full rebuild already includes it. `archive-before-refinement/` preserves the earlier authoring source.


## Public and product completion / 7 November

`completion.py` appends the public website, account and program-management screens after the original refinement. It reuses the existing semantic variables and components, and preserves the original screen IDs. `build.py` includes it in full rebuilds.

`completion-commands.json` is an incremental batch for the backed-up 21 October v6 file only. Apply it once with `cli run --in <backed-up-v6> --out <candidate>`; do not apply it to an already-completed file. `completion-exports.json` renders the added screens and changed review/navigation views. `completion_check.py` checks the saved candidate after extraction; `completion_playback.py --launch` runs real presenter clicks against the candidate on control port 7998. The latter records current evidence under `figma/professional-v6/runtime/completion/`.

The baseline is `figma/professional-v6/archive/2026-11-07-before-completion/`. Its manifest preserves the file hash and original screen ledger. The authoring is native; only the actual report preview inside the marketing hero is an embedded raster.
