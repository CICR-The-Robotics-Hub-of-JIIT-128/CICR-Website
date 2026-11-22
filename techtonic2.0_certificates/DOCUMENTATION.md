# TechTonic 2.0 Certificate Generation & Verification System
## Comprehensive System Architecture, Operations Manual & Troubleshooting Guide

---

## 1. System Overview & Architecture

The TechTonic 2.0 Certificate System is a hybrid, production-grade credential issuance and verification platform designed for CICR (Creative & Innovative Cell in Robotics), JIIT Noida.

It consists of two decoupled subsystems:
1. **Local Batch Generator (`techtonic2.0_certificates/`)**: A secure local Python CLI that takes student rosters from Supabase, generates high-resolution PDFs from vector templates with custom typography and designer QR codes, uploads files to designated Google Drive folders using OAuth 2.0, and records verified credentials in Supabase.
2. **Public Verification Web Engine (`https://cicr.in/certificate/:id`)**: A serverless verification portal built on React, Vite, and Vercel Serverless Functions. It displays verified student details, role-specific citations, issue timestamps, and embeds an interactive preview of the official PDF from Google Drive.

```
                              ┌─────────────────────────────────────────┐
                              │          Supabase PostgreSQL           │
                              │  - techtonic2.0_members (Roster)        │
                              │  - techtonic2.0_certificates (Issued)   │
                              │  - techtonic2_cert_counter (Atomic ID)  │
                              └───────┬─────────────────────────▲───────┘
                                      │                         │
                   1. Reads Pending   │                         │ 4. Records
                      Members         │                         │    Issued Cert
                                      ▼                         │
┌──────────────────────┐      ┌─────────────────────────┐       │
│  Vector PDF Template │─────►│   Local Python Engine   │───────┤
│  & Great Vibes Font  │      │      (generate.py)      │       │
└──────────────────────┘      └────────────┬────────────┘       │
                                           │                    │
                              2. Overlays Name                  │
                                 & Designer QR                  │
                                           ▼                    │
                              ┌─────────────────────────┐       │
                              │   Generated PDFs (Disk) │       │
                              └────────────┬────────────┘       │
                                           │                    │
                              3. Uploads via OAuth 2.0          │
                                           ▼                    │
                              ┌─────────────────────────┐       │
                              │   Google Drive Cloud    │◄──────┘
                              │  - Participation Folder │
                              │  - Contribution Folder  │
                              └────────────┬────────────┘
                                           │ Public Read
                                           ▼
┌──────────────────────┐      ┌─────────────────────────┐      ┌──────────────────────┐
│ Participant Scans QR │─────►│ Vercel Serverless API   │─────►│ React SPA Verification
│  (Camera / Reader)   │      │ GET /api/certificates/:id│      │ (Plays CICR Video -> 
└──────────────────────┘      └─────────────────────────┘      │  Reveals Cert Glass) 
                                                               └──────────────────────┘
```

---

## 2. Database Schema & Architecture

The database operates on **Supabase PostgreSQL** with Row-Level Security (RLS) enabled. It separates raw roster entries from issued certificates to guarantee data integrity and idempotence.

### 2.1 Table: `techtonic2.0_members` (Intake Table)
A clean, minimal table where organizers add students and team members. It contains **only** identity and role information:

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `BIGINT` | `IDENTITY PRIMARY KEY` | Auto-incrementing unique member ID |
| `name` | `TEXT` | `NOT NULL, LENGTH > 0` | Full name of the student / member |
| `role` | `TEXT` | `NOT NULL, CHECK (role IN ('participant', 'team_member'))` | Award track |

### 2.2 Table: `techtonic2.0_certificates` (Verification Table)
The single source of truth for public verification. Queried by the website when a certificate is checked:

| Column | Type | Constraints | Description |
|---|---|---|---|
| `certificate_id` | `TEXT` | `PRIMARY KEY, CHECK (format ~ '^TEC2_CICR_[0-9]+$')` | Public identifier (e.g. `TEC2_CICR_1001`) |
| `name` | `TEXT` | `NOT NULL` | Recipient name printed on the certificate |
| `role` | `TEXT` | `NOT NULL, CHECK (role IN ('participant', 'team_member'))` | Certificate track |
| `member_id` | `BIGINT` | `REFERENCES techtonic2.0_members(id) ON DELETE SET NULL` | Links back to original member ID |
| `drive_file_id` | `TEXT` | `NULLABLE` | Google Drive File ID for PDF embed |
| `certificate_generated_at` | `TIMESTAMPTZ`| `NULLABLE` | Timestamp updated on generation/reissue |
| `created_at` | `TIMESTAMPTZ`| `DEFAULT NOW()` | Record creation timestamp |

### 2.3 Atomic Counter & Sequence RPC
To prevent duplicate certificate numbers even under concurrent executions, certificate IDs are assigned using an isolated counter table and a `SECURITY DEFINER` stored function:

```sql
CREATE TABLE IF NOT EXISTS techtonic2_cert_counter (
  id      INTEGER PRIMARY KEY DEFAULT 1,
  current INTEGER NOT NULL DEFAULT 1000  -- Starts at 1000; first issued is 1001
);

CREATE OR REPLACE FUNCTION next_techtonic2_cert_number()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  next_val INTEGER;
BEGIN
  UPDATE techtonic2_cert_counter
  SET    current = current + 1
  WHERE  id = 1
  RETURNING current INTO next_val;
  RETURN next_val;
END;
$$;
```

---

## 3. Certificate Design & Visual Placement Specifications

The certificate layout matches the approved Canva reference precisely. Templates are standard A4 Landscape (`841.89 × 595.28 pt`).

```
┌────────────────────────────────────────────────────────────────────────┐
│                                                                        │
│                      CERTIFICATE OF CONTRIBUTION                       │
│                                                                        │
│                      This certificate is awarded to                    │
│                                                                        │
│                            Priya Patel                                 │  <- Great Vibes (54 pt, #a26800)
│   ──────────────────────────────────────────────────────────────────   │  <- Preserved Template Line (y=305.8 pt)
│                                                                        │
│   in recognition of their dedication and valuable contribution...      │
│                                                                        │
│        [Signature 1]                 ┌────────┐        [Signature 2]   │
│       Dr. Parul Arora                │   QR   │     Mr. Yasharth Singh │
│   Faculty Coordinator, CICR          └────────┘        Advisor, CICR   │
│                                        Verify                          │  <- Helvetica (7.0 pt, #110745)
│                             Certificate Id : TEC2_CICR_1001            │  <- Helvetica (6.0 pt, #110745)
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Exact Coordinates & Typography
1. **Recipient Name**:
   - **Font**: `GreatVibes-Regular.ttf`
   - **Size**: `54.0 pt`
   - **Color**: Golden Bronze `#a26800` (`RGB: (162/255, 104/255, 0.0)`)
   - **Position**: Centered horizontally (`cx ≈ 420.95 pt`), baseline resting at `y = 299.0 pt`.
   - **Template Line**: The dark vector line at `y = 305.78 pt` is strictly preserved; descenders in the cursive font naturally loop through it.
2. **Designer QR Code**:
   - **Format**: Custom rounded modules (`RoundedModuleDrawer`) via `qrcode.image.styledpil`.
   - **Color**: Dark Navy/Indigo `#110745` on pure white background.
   - **Size**: Compact `56.0 × 56.0 pt`.
   - **Position**: Centered at `x = 430.5 pt` (exact midpoint between the Dr. Parul Arora and Mr. Yasharth Singh signature blocks), lowered to `y = 444.0 pt to 500.0 pt`.
   - **Payload**: `https://cicr.in/certificate/{certificate_id}`.
3. **Verify Label & Certificate ID**:
   - **"Verify"**: Centered at `x = 430.5 pt`, `y = 508.0 pt` (`7.0 pt`, Helvetica, `#110745`).
   - **"Certificate Id : TEC2_CICR_<id>"**: Centered at `x = 430.5 pt`, `y = 516.0 pt` (`6.0 pt`, Helvetica, `#110745`), visually aligning with the coordinator subtitle lines.

---

## 4. Google Drive Integration & Storage Strategy

### 4.1 Why OAuth 2.0 Instead of Service Accounts
Google Cloud **Service Accounts** (`...@...gserviceaccount.com`) have a personal storage quota of **0 bytes**. In standard personal `@gmail.com` Google Drive accounts, Google attributes new file storage to the uploader rather than the folder owner, throwing:
`HttpError 403: Service Accounts do not have storage quota.`

To resolve this completely, the generator utilizes an **OAuth 2.0 Desktop App client** (`client_secret.json`). 
- On first run, a browser opens asking you to authorize `cicrjiit128noida@gmail.com`.
- Once approved, an authorized refresh token is saved to `credentials/token.json`.
- All subsequent runs authenticate silently in the background, utilizing the Gmail account's free 15 GB storage quota.

### 4.2 Auto-Folder Routing
The generator reads the parent `GOOGLE_DRIVE_FOLDER_ID` (or extracts it from full URLs) and automatically uploads into the respective subfolders:
- Role `participant` ➔ Uploaded to `Participation/` subfolder (configured via `PARTICIPATION_GOOGLE_DRIVE_FOLDER_ID` in `.env`)
- Role `team_member` ➔ Uploaded to `Contribution/` subfolder (configured via `CONTRIBUTION_GOOGLE_DRIVE_FOLDER_ID` in `.env`)
- Each uploaded PDF is set to `anyone with link can view` (`type="anyone", role="reader"`), allowing the verification portal to embed it.

---

## 5. Operations & Command Reference

All CLI commands are executed from the `techtonic2.0_certificates/` directory using the dedicated virtual environment:

### 5.1 Batch Issuance (Default Mode)
Reads all entries in `techtonic2.0_members`, skips anyone already issued a certificate, generates PDFs, uploads to Drive, and logs to Supabase:
```bash
cd techtonic2.0_certificates
./venv/bin/python3 generate.py
```

### 5.2 Dry-Run Testing
Generates local PDFs in `output/participation/` or `output/contribution/` with simulated IDs without writing to Supabase or Google Drive:
```bash
./venv/bin/python3 generate.py --dry-run
```

### 5.3 Filter by Award Track
```bash
# Process only participants
./venv/bin/python3 generate.py --role participant

# Process only core team members
./venv/bin/python3 generate.py --role team_member
```

### 5.4 Sync / Upload Missing Drive Files
If PDFs were generated locally but Drive uploads were skipped or failed, this command scans for certificates with `drive_file_id IS NULL`, uploads them to the correct Drive folder, and updates Supabase:
```bash
./venv/bin/python3 generate.py --sync-drive
```

### 5.5 Reissuing a Certificate / Name Correction
When a recipient requests a correction in their name spelling, this command reissues the certificate:
- Retains the exact same Certificate ID (e.g. `TEC2_CICR_1012`).
- Retains the exact same QR code (pointing to the same URL).
- Regenerates the PDF locally with the corrected name.
- Updates the existing file on Google Drive in-place (same Drive File ID and link).
- Updates the name in both `techtonic2.0_certificates` and `techtonic2.0_members`.
```bash
./venv/bin/python3 generate.py --reissue TEC2_CICR_1012 --name "Akanksha Nagar"
```

### 5.6 Auto-Sync Corrected Names from Supabase Table
If you prefer editing the name directly in the Supabase Table Editor under `techtonic2.0_members`, this command detects any discrepancy between `techtonic2.0_members` and `techtonic2.0_certificates` and automatically reissues them in-place:
```bash
./venv/bin/python3 generate.py --sync-names
```

---

## 6. Public Verification System (`cicr.in`)

### 6.1 User Journey
1. Recipient or employer scans QR code or visits `https://cicr.in/certificate/TEC2_CICR_1001`.
2. **Video Intro**: The full-screen CICR animation video plays via `<Preloader />`.
3. **Verification Screen**: Once the animation completes, the verified certificate view appears:
   - Recipient Name
   - Award Track Badge (`🎓 Certificate of Participation` or `⭐ Certificate of Contribution`)
   - Official citation text
   - Issue Date & Timestamp
   - Certificate ID badge with copy shortcut
   - Interactive Google Drive PDF Preview iframe
   - "Open Original PDF" external link

### 6.2 Serverless API (`api/certificates/[id].js`)
- Runs as a Vercel Serverless Function querying Supabase via `SUPABASE_SERVICE_ROLE_KEY`.
- Validates the ID regex (`^TEC2_CICR_\d+$`).
- Sanitizes the output, returning strictly public metadata (`certificate_id`, `name`, `role`, `drive_file_id`, `certificate_generated_at`, `issued_at`). Internal IDs, emails, and database keys are never exposed.

---

## 7. Comprehensive Troubleshooting Guide (Historical Issues & Solutions)

This log documents every real-world error encountered during development and deployment, its root cause, and its permanent solution.

---

### Issue 1: `TextWriter.append() got an unexpected keyword argument 'color'`
- **Error**: `TypeError: TextWriter.append() got an unexpected keyword argument 'color'` during PyMuPDF text insertion.
- **Root Cause**: In PyMuPDF (fitz), the `color` attribute is not a property of the individual text glyphs inside `append()`; it is passed to the final drawing call `write_text(page, color=...)`.
- **Fix**:
  ```python
  # Wrong:
  text_writer.append(pos=(x, y), text=name, font=font, fontsize=54, color=NAME_COLOR)

  # Correct:
  text_writer.append(pos=(x, y), text=name, font=font, fontsize=54)
  text_writer.write_text(page, color=NAME_COLOR)
  ```

---

### Issue 2: Service Accounts Storage Quota Exceeded (0-Byte Quota)
- **Error**:
  ```
  HttpError 403: "Service Accounts do not have storage quota. Leverage shared drives or use OAuth delegation instead."
  ```
- **Root Cause**: Google Cloud Service Accounts have 0 GB of personal storage. Uploading into a personal `@gmail.com` Google Drive folder charges the file against the service account rather than the folder owner.
- **Fix**: Replaced Service Account upload flow with an **OAuth 2.0 Desktop App Flow** using `client_secret.json`. The user authorizes their `cicrjiit128noida@gmail.com` account once, saving `token.json`, and subsequent uploads use the account's 15 GB quota without error.

---

### Issue 3: OAuth 403 `access_denied: App has not completed verification`
- **Error**:
  ```
  Access blocked: CICR Certificate Uploader has not completed the Google verification process.
  Error 403: access_denied
  ```
- **Root Cause**: When a Google Cloud project OAuth consent screen is in **"Testing"** publishing status, Google blocks any account not explicitly added to the **"Test users"** whitelist.
- **Fix**: In Google Cloud Console ➔ **APIs & Services** ➔ **OAuth consent screen** ➔ **Test users**, added `cicrjiit128noida@gmail.com`.

---

### Issue 4: Drive API 404 "File Not Found: ." from Full URL
- **Error**: `HttpError 404: File not found: .` when querying folder parents.
- **Root Cause**: The `.env` variable `GOOGLE_DRIVE_FOLDER_ID` contained the entire web URL (`https://drive.google.com/drive/u/1/folders/<folder_id>`) rather than the raw alphanumeric folder ID.
- **Fix**: Implemented `extract_folder_id()` with regular expressions in `generate.py` to automatically strip protocol and path prefixes, leaving only the clean alphanumeric folder ID.

---

### Issue 5: Vercel Build Failure due to Unescaped JSX Apostrophe
- **Error**:
  ```
  [vite:esbuild] Transform failed with 1 error:
  CertificatePage.jsx:20:308: ERROR: Expected "}" but found "s"
  ... The recipient's commitment and hard work ...
  ```
- **Root Cause**: In `src/pages/CertificatePage.jsx`, the string literal was enclosed in single quotes while containing an unescaped apostrophe (`recipient's`), terminating the string prematurely. This caused Vite's build step on Vercel to fail silently and serve old cached builds.
- **Fix**: Replaced outer single quotes with double quotes `"The recipient's commitment..."`. Verified via `npm run build` locally.

---

### Issue 6: Vercel SPA Rewrite Intercepting Backend API Routes
- **Error**: API requests to `/api/certificates/[id]` returned HTML (`index.html`) instead of JSON.
- **Root Cause**: In `vercel.json`, the catch-all rewrite `"source": "/(.*)"` was matching all incoming requests, including `/api/...`.
- **Fix**: Updated `vercel.json` rewrite with a negative lookahead regex to exempt API endpoints:
  ```json
  {
    "rewrites": [
      { "source": "/((?!api/).*)", "destination": "/index.html" }
    ]
  }
  ```

---

### Issue 7: Duplicate Name Collision during Roster Skip Checks
- **Error**: If two distinct participants had the identical name (e.g. two students named "Rahul Sharma"), the second student would be skipped as already generated.
- **Root Cause**: Initial deduplication checked only `(name.lower(), role)`.
- **Fix**: Implemented **Option B Architecture**: Added `member_id` foreign key to `techtonic2.0_certificates` linking to `techtonic2.0_members.id`. The generator checks `member["id"] in existing_member_ids`, making certificate issuance 100% immune to duplicate names.

---

## 8. File Structure & Security Summary

```
CICR-Website/
├── api/
│   └── certificates/
│       └── [id].js                  ← Vercel Serverless Function (Public Verification API)
├── src/
│   ├── App.jsx                      ← Root Router (Preloader Video -> Certificate Page)
│   ├── pages/
│   │   └── CertificatePage.jsx      ← Verified Certificate Glassmorphic View
│   └── styles/
│       └── certificate.css          ← Responsive certificate styles & animations
├── vercel.json                      ← Vercel deployment & rewrite configuration
└── techtonic2.0_certificates/       ← 100% EXCLUDED FROM GIT (.gitignore)
    ├── generate.py                  ← Master Certificate CLI & Engine
    ├── inspect_template.py          ← Vector geometry & placeholder inspector
    ├── schema.sql                   ← Supabase DDL, Counter & RPC functions
    ├── requirements.txt             ← Python dependencies
    ├── credentials/                 ← NEVER COMMITTED
    │   ├── client_secret.json       ← Google Cloud OAuth client
    │   └── token.json               ← Saved user access & refresh token
    ├── fonts/
    │   └── GreatVibes-Regular.ttf   ← Golden Bronze calligraphy font
    ├── templates/
    │   ├── participation.pdf        ← Vector Participation template
    │   └── contribution.pdf         ← Vector Contribution template
    └── output/                      ← Generated PDFs on local disk
        ├── participation/
        └── contribution/
```

### Security Rules:
- **No `VITE_` prefix on Supabase keys**: Prevents Vite from bundling keys into client-side JavaScript.
- **`techtonic2.0_certificates/` in `.gitignore`**: Protects all generated student PDFs, OAuth secrets, API tokens, and service credentials from being pushed to GitHub.
- **RLS Enforced**: Anon key has read-only access to `techtonic2.0_certificates`. Write/RPC permissions are restricted strictly to `service_role`.

