# Native design source

The delivered .figcraft opens directly; no terminal or running process is required to review it.

Authoring helpers only generate native FigCraft command JSON. They do not build or run the product. Run build.py from this folder to regenerate commands.json and ledger.json, then use the installed FigCraft `cli run commands.json --out ../../figma/BugBountyTrack-UX.figcraft` to author the document. Export/convert a copy to design.json next to these scripts before running check.py. Verify the generated file visually after any changes. The source depends only on Python's standard library and the installed FigCraft CLI; icon geometry comes from bundled Phosphor SVG bounds.
