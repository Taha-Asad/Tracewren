# Fieldwork v5 artwork

The three PNG illustrations were generated with the built-in image-generation tool for this project. They are conceptual editorial artwork, not screenshots, attachment previews, extra findings or a certification of verification. Their subject, palette and aspect ratio were created for the intended slots rather than cropped from a UI mockup.

- `boundary.png`: conceptual controlled-workspace boundary crossing; source 1690 × 931, displayed around 384 × 211.
- `station.png`: private research / disclosure station; source 1692 × 930, displayed up to 500 × 275.
- `verified.png`: retained research record and verified-outcome seal; source 1692 × 930, displayed around 236 × 130.
- `mfa-example.png`: a genuine QR encoding of a public **BugBountyTrack Demo** TOTP fixture, generated deterministically with `qrencode`. It does not enroll or authenticate any production account.

Native `Fieldwork/Illustration/*` components embed the artwork. Labels, controls, report content, timelines and workflow diagrams remain separately editable native layers. Licensed Phosphor icons are retained in the shared sibling `icons/` folder with their original license.

## Final generation prompt set

All three illustrations used the generated `professional-v5/concepts/fieldwork.png` as a style reference. The prompts required standalone artwork, no website UI or text, no screenshot, no invented data, no gradients, no neon, no shiny gold or floating 3D folders. Palette: warm paper `#F4F0E7`, forest ink `#1E302C`, muted olive `#919679`, with restrained vermilion `#B43823` only where appropriate. Intended aspect: landscape 800 × 440.

**Boundary:** A sophisticated editorial woodcut / engraving of two abstract architectural workspace gates like server monoliths, deep forest on the left and muted olive on the right. Each has a circular account medallion. A folded report page travels across a delicate dashed authorization boundary; a single vermilion stroke suggests crossing. Fine engraved topographic linework anchors the scene. Mature printmaking rather than childish stock clipart; essential objects inset and uncropped; scales cleanly into a 400 × 220 slot.

**Station:** A small scientific observatory / fieldwork station on an etched topographic island. A grounded signal antenna and sealed dispatch suggest responsible private research; a fine plotted route enters the station. Rich engraved linework, strong silhouettes and layered foreground / midground. Exact warm paper background, forest and olive ink, one small vermilion seal detail. Publication-quality research illustration, no fake charts, words, letters, digits or watermark.

**Verified:** A carefully archived research record with layered plain paper leaves, a circular engraved verification seal with a clear check, and a fine thread to a closed abstract workspace gate. Fine hatching, asymmetric composition and readable silhouettes. Conceptual artwork rather than legal certificate or actual evidence. Warm paper, forest and olive, with the check / seal in forest. No red success, fake code, signatures, letters, digits, shiny gold, neon or gradients.


## Feedback revision / boundary-crisp.png

Edited with the built-in image-generation tool from `boundary.png`; the original is preserved. Simplified the conceptual two-workspace illustration, removed scenery and faded olive treatment, strengthened forest green and rust. This is conceptual artwork, not evidence.

Prompt: Preserve the two workspace gates with account medallions, central report crossing a dashed authorization boundary and directional rust arrow. Remove mountains, clouds, towers, observatory, landscape texture, fading, washed-out tones, paper grain and vignette. Retain precise engraved detail within the gates. Solid warm off-white, deep forest green for both gates and rust for the document/arrow. No labels, statistics, gradients or new decorative elements.
