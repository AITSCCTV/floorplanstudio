# Current local pilot decision — 11 October 2026

The owner approved the proposed requirements and the OpenAI plan-data flow, confirmed that approved catalog/logo/template files are unavailable, and chose a local pilot. See README.md for current functionality. The historical assessment below describes the September prototype and is retained as background; its statements about absent local workflow/catalog/BOM features are superseded.

Shared hosting, SSO, enforced permissions, authenticated approvals, central backups and immutable audit logs remain deferred. Local review stages and comments are user-entered records. No real product specifications or company branding were supplied. Production release still requires representative drawing review and the company's approved engineering/catalog inputs.

---

# Floorplan Studio production readiness

Status date: 28 September 2026  
Current disposition: **prototype; not approved for company-wide or customer-plan production use**

## What the prototype does today

- Runs as a single-user app on `127.0.0.1`; it has no sign-in, roles, shared projects, server-side project storage, review workflow, or audit history.
- Renders PDF pages and common DXF modelspace geometry. DWG must be exported to PDF or DXF. It does not interpret all CAD object types.
- Sends the rendered plan image, file name, design brief, and entered settings to the configured OpenAI endpoint only after a user selects **Analyze plan**. The uploaded original file is processed locally and is not itself sent by this prototype. Company authorization for this AI data flow is still required before real customer plans are used.
- Exports the draft layout as a local project JSON, SVG, or browser-printed PDF. A downloaded project file is not a shared or backed-up project record.
- Suggests generic device categories. It does not yet select approved AITS SKUs, calculate bill of materials/prices, or verify model-specific camera and radio performance.
- Produces illustrative camera fields of view and relative Wi-Fi coverage. These are not measured coverage results or construction drawings.

## Changes in this handoff

- The analysis API accepts only bounded base64 PNG/JPEG inputs and checks that image bytes match the declared format. It rejects remote URLs and other data types.
- AI plan transfer fails closed by default. A provider key alone is not enough; `AITS_AI_PLAN_DATA_APPROVED=true` is required, and the UI explains what the request sends.
- The analysis response is checked for coordinate, count, ID, and field bounds before it can replace the current placements. Provider error bodies are no longer returned to the browser.
- PDF and DXF preview work has file-size, page/entity-count, aspect-ratio, and render-size limits.
- Project JSON import validates version, image format, geometry, device fields, and brief values before applying any state. Invalid files are rejected without partially changing the open design.

## Decisions required from AITS

The bilingual questionnaire in `../deliverables/AitsCCTV_Floorplan_Studio_Requirements_TH_EN.docx` is the source for these decisions. Its CEO and team-member message drafts remain unsent.

1. **Hosting and identity:** internal-only hosting location, company identity provider, and who can create, edit, review, approve, export, and administer projects.
2. **Plan data policy:** whether customer plans may be sent to the configured AI provider; allowed data classes, geographic processing requirements, retention period, deletion process, backup policy, and incident owner.
3. **Product catalog:** approved camera/AP/router/switch/NVR models, lenses and accessories, bundles, prices and their visibility, substitutions, and the person who owns catalog updates.
4. **Engineering review:** required reviewer roles, approval evidence, revision rules, required site-survey fields, and what must appear on an approved export.
5. **Drawing support:** expected PDF/DXF variants, typical file/page sizes, unit and scale calibration process, and whether AITS has an approved DWG conversion path.
6. **Terminology:** confirm the intended meaning of “gangs” in the questionnaire and catalog (for example, gang box, junction box, or cable gland).
7. **Coverage claims:** approved inputs and methods for camera placement, lens/FOV checks, Wi-Fi radio and wall-loss estimates, and the language engineers may use in customer-facing outputs.

## Recommended target design

Treat this as a separate internal web service behind company SSO, rather than exposing the current local server to a LAN. Keep the existing browser editing experience, with these service-side controls:

- **Identity and access:** role-based permissions for designer, engineer reviewer, catalog owner, and administrator; project-level access; short-lived sessions; and access logs.
- **Project records:** versioned project metadata in a database and plan files in private encrypted object storage, governed by the retention/deletion decision above. Keep draft, submitted, approved, and superseded revisions distinct.
- **Approval trail:** record reviewer, timestamp, revision, unresolved assumptions, and survey status. Approved exports identify the source revision and approval state; edits create a new draft revision.
- **File processing:** isolate PDF/CAD parsing in a resource-limited worker; scan uploads; enforce content, size, page, entity, and time limits; keep original plans private; and prevent public file links.
- **AI integration:** centralize provider credentials server-side; make plan egress explicit to the user and enforce the company data policy; retain the current `store: false` request setting; and avoid putting plan content in application logs.
- **Catalog and BOM:** store approved SKUs and effective-dated pricing with a named catalog owner. AI may propose categories, but an approved catalog record and engineer approval must drive a customer-facing bill of materials.
- **Engineering calculations:** calibrate plan scale from verified dimensions; use documented, model-specific device parameters for FOV and radio estimates; show uncertainty and assumptions; retain site survey as the final validation step.
- **Operations:** pin dependencies, use managed secrets, monitor service and worker health, back up project metadata under an approved policy, and prove recovery and deletion behavior before pilot.

The hosting vendor, database, object store, and identity integration should be selected only after AITS confirms its existing standards and the data-policy answers. The prototype does not contain enough information to choose these responsibly.

## Pilot release gates

Do not call the tool production-ready until all of these have an owner and evidence:

- Company SSO and least-privilege roles work; unauthorized users cannot view, edit, export, or approve another team's project.
- Plan-data classification, AI-provider authorization, retention, deletion, and backup behavior are approved and demonstrated.
- Representative PDFs and DXFs are loaded under documented limits; unsupported drawing features and scale uncertainty are visible to the user.
- Device suggestions map to the current approved catalog, or are clearly identified as generic placeholders; pricing and substitutions follow AITS policy.
- Engineer review is required before an export can be marked approved; review status and revision history survive edits and restore.
- Security review covers upload parsing, project import/export, dependency updates, secrets, access controls, and audit events.
- A pilot with representative engineers compares the tool's outputs against site-surveyed designs and records the acceptable error/coverage language.
- Operations staff demonstrate backup restore, project deletion, access removal, and incident handling.

## Next practical sequence

1. Collect the questionnaire answers and name decision owners.
2. Obtain security/data-owner approval for the AI plan-image flow and pick the approved internal hosting and identity patterns.
3. Define the product catalog and engineer approval/export requirements.
4. Implement identity, project storage/revisions, access audit, deletion, and the review workflow against those decisions.
5. Replace generic coverage assumptions with verified inputs/calculations, then run an engineer-led pilot before wider deployment.
