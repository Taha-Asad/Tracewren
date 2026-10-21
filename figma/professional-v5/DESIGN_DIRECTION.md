# Fieldwork / Professional v5

A fresh authoring system and visual design from `requirements/SRS.md`, revision 2.8. V3 and v4 remain preserved. V5 does not import their page layouts or command batches.

## The chosen direction

The user's numbered feedback on 19 October takes precedence over the initial exploration:

| Reference | Judgment | Applied direction |
| --- | --- | --- |
| image-1.png | Best alternate palette, but faded | Selected: solid forest green and clean warm cream, sharper rust action, reduced texture |
| image-2.png | Easy UX, generic colour | Borrow clear grouping only; do not adopt the blue palette |
| image-3.png | Better, cluttered; retain as a simpler backup | Keep the original reference and provide a reduced two-column dark-console study |

The main design keeps image 1's character while reducing brochure styling: a 30px report title, interface type for finding and dialog headings, simple section labels, fewer decorative images and clear continuous research content. The finding has one compact conceptual illustration. The queue uses metadata and the submission review uses its actual steps, impact and files.

Roost's local tokens were inspected in `RoostDeck/figma/refinement-v2/visual-design-pass/theme-tokens.json`: charcoal, warm ivory and sage. They informed the shared family resemblance. This revision follows the user's permitted alternate palette from image 1 rather than silently presenting it as an exact Roost theme.

Core colours: forest `#113A2F`, cream `#F7F5EE`, reading surface `#FFFEF9`, ink `#152E27`, rust action `#B13522`. No faded overlays, paper textures, gradients or decorative charts are applied to the native workspace.

The references studied were [Linear's triage model](https://linear.app/docs/triage), [Tines' grouped workflow sections](https://www.tines.com/stories/docs/stories/sections/) and [Pentagram's MIT Technology Review editorial system](https://www.pentagram.com/work/mit-technology-review). This is an original synthesis, not a clone. The style-selection rationale is a design judgment.

## Visual hooks with a job

- The original finding pairs a compact conceptual boundary illustration with a native, editable request-path label and an expected/observed comparison.
- Reproduction is a connected numbered sequence with a readable HTTP request.
- Remediation has a continuous code → deployment → retest spine, keeping each attempt's evidence separate.
- Activity is chronological and follows progress through failure, replacement and verification.
- Completed reports foreground the verifier, deployment, attempt and observed evidence.
- Loading uses a moving seal across known process stages and a scanning rule across the neutral queue. It has no invented percentage or performance statistic.
- The full lifecycle guide explains the six active states, three remediation closures and six other outcomes.

Evidence inspectors retain the original TXT filenames and supplied sizes. If attachment bytes were not supplied, the inspector says so and shows only the report-linked excerpt. Illustrations are conceptual artwork, never screenshot previews or evidence.

## New authoring source

`tools/design/professional-v5/` contains the fresh native command builder, shared layouts, case contexts, action forms, owner/account flows, mobile journey and saved-file verifier. Text, layout rules, buttons, icons, evidence rows and process diagrams remain native and editable. Raster illustrations have separate source files under `figma/assets/fieldwork-v5/`.
