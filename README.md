# AITS Floorplan Studio

Local-first internal web app for preparing a reviewed first-pass CCTV and Wi-Fi layout from a PDF, DXF, PNG or JPEG floor plan.

**Local pilot, 11 October 2026.** The owner approved the proposed answers in the 92-question requirements document and the OpenAI plan-data flow, and selected a local pilot. The app runs on localhost. Review names and stages are local project records, not authenticated team approvals. Approved product models, logos and drawing templates were not provided; add these through the project workspace.

## Start on Windows

1. Open PowerShell in this folder.
2. Run `.\start.ps1`.
3. The first run creates a private Python environment, installs the app requirements, and opens the browser.
4. AI is disabled by default. Only after AITS explicitly approves the plan-data flow, edit `.env`, set `OPENAI_API_KEY`, set `AITS_AI_PLAN_DATA_APPROVED=true`, and restart. Never put a key into browser code, screenshots, workflow exports, or Git.

The server binds only to `127.0.0.1`; it is meant for this computer and is not configured for network or public access.

## Local pilot features

- PDF pages (up to 20), common DXF geometry, and PNG/JPEG plans; maximum upload 50 MB.
- OpenAI placement suggestions with exact requested CCTV, AP, router, switch and NVR quantities, including zero quantities. AI explains assumptions and open questions.
- Camera aim, horizontal FOV, calibrated range, mounting height, 2/4 Gang, product selection and preservation during regeneration.
- Editable/importable product catalog. Unknown specifications stay blank; imported approval flags reflect the user's declaration.
- Two-point scale calibration or confirmed plan width, stored floors, prohibited zones and straight cable connections with 10% slack.
- BOM CSV, manual unit prices, labor and tax inputs, quote CSV, port/PoE warnings and recording payload storage estimate.
- Local project JSON save/restore, undo/redo, named review stages, comments and revision history. Edits reset review state to Draft.
- Company logo upload, A3/A4 drawing pack through browser print/PDF, branded SVG and the Kai/OpenAI credit.
- Default plan, approximate Wi-Fi, camera-view and illustrative isometric 3D views.

Use **Save project** to preserve work as a downloaded JSON file. The app has no automatic backup or shared storage. Store a floor before changing plan pages if you want to preserve that floor's drawing. Project files include the embedded plan and logo, catalog, comments and workflow data.

DWG must be converted to DXF or PDF. Cable routes are straight endpoint estimates, not wall-following installation paths. Drawing packs print to fit the page; they are not guaranteed physical-scale CAD sheets. The English/Thai selector translates interface labels, instructions, statuses and messages, and is remembered on this browser. New generated room names and design explanations follow the selected language. Uploaded drawing text and previously written customer/project content retain their original language. Drawing-pack headings and instructions follow the chosen report language. Phone layouts stack fields, expand touch targets, wrap navigation and let tables scroll horizontally.

Selecting **Analyze plan** sends the rendered plan image, filename, brief, entered settings, approved catalog records (up to 30), locked placements and prohibited zones to OpenAI. Original PDF/DXF files are processed locally. Credentials remain server-side. The approval setting is enabled for this pilot following the owner's authorization.

## Site photos and hand-drawn markings

In step 1, select **I have site photos**. Add up to 12 PNG/JPEG photographs of one floor, label every view, describe room connections and provide a free-text symbol legend. Overall width/depth and per-photo measurements are optional. Metric and imperial input units are supported. The browser resizes photographs to a maximum 1400-pixel edge before sending them for reconstruction.

Select **Create draft floorplan** to create a schematic of rectangular rooms. Review the source-photo correspondence, inferred dimensions, recognised device markings and unclear symbols in step 2. Room positions and sizes can be edited. Marked CCTV/AP/router/switch/NVR devices are preserved during subsequent generation; uncheck Preserve in device properties to move a device. 2/4 Gang is retained as a device property when interpretable. Requested quantities are totals, including marked devices. Choose **Use this floorplan with marked devices only** to skip additional placement generation, or generate a complete layout using the normal quantity controls.

This is an approximate photo interpretation, not photogrammetric reconstruction or measured CAD. Rooms are simplified to rectangles; exact wall shapes, door/window geometry and hidden connections are not reconstructed. Missing measurements and ambiguous photo relationships are recorded as assumptions/questions. Unclear/unsupported symbols are listed for review and are not automatically included as confirmed devices. Saved project files include the compressed source photographs and symbol evidence; handle them as customer/site data. Stored floors retain their individual survey records.

The existing OpenAI key and plan-data approval setting also gate photo reconstruction. The resized photos, filenames, room labels, notes, symbol legend, floor name, dimensions and selected language are sent to OpenAI when creating a draft. Credentials stay on the server and are excluded from Git. The new workflow has English/Thai labels and phone layouts. Thai is the default for new users; a saved English preference is respected. Free-text fields accept Thai, English and mixed text independently of the selected output language. Live checks on a synthetic room image passed for a Thai symbol legend (one CCTV and one AP), Thai labels/notes, supplied dimensions, and a Thai brief in the existing plan workflow. Both returned Thai explanations and the expected device counts. These checks do not validate reconstruction from real site photographs or handwriting accuracy.

## Consistency

The server validates device counts and geometry before accepting a response. A SHA-256 key includes the complete request, model, reasoning setting and rule version. Up to 20 identical successful requests reuse a result in server memory. This cache resets when the server restarts; generated results across separate sessions are not guaranteed identical. Save the project JSON to preserve a specific design and use device preservation when regenerating.

## Handoff checks

Browser checks passed for properties, scale confirmation, project save/restore, catalog import, invalid logo rejection, undo/redo and drawing pack creation. Server checks passed for exact and zero quantities, cache isolation, approval gating, rejected incorrect AI quantities and PNG preview. A live OpenAI call on a synthetic plan returned exactly 2 CCTV, 1 AP, 1 router, 1 switch and 1 NVR. These checks do not validate engineering performance or representative customer drawings.

## Accuracy limits

The result is a preliminary, engineer-editable concept, not a construction drawing or a guarantee of camera coverage or Wi-Fi performance. Confirm scale, room dimensions, ceilings, wall materials, obstructions, privacy boundaries, mounting options and product specifications before issuing a customer design. Wi-Fi coverage is a relative planning estimate; site survey is required to validate performance.

The current PDF parser renders pages as images. DXF import supports common modelspace lines, polylines, circles, and text. Paper space, external references, raster underlays, 3D CAD solids, and some vendor-specific objects may need to be flattened/exported to PDF or simplified before import.
