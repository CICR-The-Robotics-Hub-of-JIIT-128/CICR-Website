# TechTonic 2.0 Certificate Generator
### Local Batch Issuance & Management Engine

A secure, offline Python tool for batch generating, uploading, and managing participation and contribution certificates for **TechTonic 2.0** (CICR, JIIT Noida).

---

## 📁 Directory Structure

```
techtonic2.0_certificates/
├── templates/
│   ├── participation.pdf          ← Participation vector PDF template
│   └── contribution.pdf           ← Contribution (team member) vector PDF template
├── fonts/
│   └── GreatVibes-Regular.ttf     ← Golden Bronze calligraphy font
├── credentials/                   ← NEVER COMMITTED TO GIT
│   ├── client_secret.json         ← Google Cloud OAuth 2.0 Desktop credentials
│   └── token.json                 ← Auto-generated authorized user session
├── output/                        ← Generated certificates on local disk
│   ├── participation/             ← Output Participation PDFs
│   └── contribution/              ← Output Contribution PDFs
├── generate.py                    ← Master certificate generation & sync CLI
├── inspect_template.py            ← Diagnostic tool to inspect PDF geometry
├── schema.sql                     ← Supabase PostgreSQL schema, tables & functions
├── requirements.txt               ← Python dependencies
├── .env                           ← Local secrets (never committed)
├── .env.example                   ← Environment variable template
└── DOCUMENTATION.md               ← Complete technical architecture & error manual
```

---

## 🛠️ Complete First-Time Setup Guide

### Step 1: Run the Supabase SQL Schema

1. Open your **Supabase Dashboard ➔ SQL Editor ➔ New Query**.
2. Open `schema.sql` (or copy its full contents) and paste it into the editor.
3. Click **Run**.
4. This creates:
   - **`techtonic2.0_members`**: Simple roster table (`id`, `name`, `role`).
   - **`techtonic2.0_certificates`**: Public verification table (`certificate_id`, `name`, `role`, `member_id`, `drive_file_id`, `certificate_generated_at`).
   - **`techtonic2_cert_counter`**: Atomic sequence counter table (initialized at 1000).
   - **`next_techtonic2_cert_number()`**: Security definer RPC function preventing duplicate IDs.
   - **Row Level Security (RLS)**: Public read for verification; write restricted to `service_role`.

---

### Step 2: Set Up Google Drive OAuth 2.0 Credentials

> [!NOTE]
> Google Cloud Service Accounts have 0 bytes personal storage on standard `@gmail.com` accounts. To upload into your Google Drive, we use an **OAuth 2.0 Desktop Client**, allowing the script to upload directly using your account's 15 GB storage quota.

1. Go to [Google Cloud Console: Credentials](https://console.cloud.google.com/apis/credentials).
2. Click **Create Credentials ➔ OAuth client ID**.
3. Set **Application type**: `Desktop app`.
4. Set **Name**: `CICR Certificate Uploader`.
5. Click **Create**, then click **Download JSON**.
6. Move the downloaded JSON file to:
   ```bash
   techtonic2.0_certificates/credentials/client_secret.json
   ```
7. **Whitelisting Test User**:
   - In Google Cloud Console, navigate to **APIs & Services ➔ OAuth consent screen**.
   - Scroll down to the **Test users** section.
   - Click **+ ADD USERS**, type `cicrjiit128noida@gmail.com` (or the Google account that owns the Drive folder), and click **Save**.

---

### Step 3: Google Drive Folders Setup

In your Google Drive:
1. Create a parent folder named `CERTIFICATES` (or use your existing one).
2. Inside `CERTIFICATES`, create two subfolders:
   - `Participation`
   - `Contribution`
3. Copy the URL or ID of the parent `CERTIFICATES` folder.

---

### Step 4: Configure Local `.env`

Copy the example file:
```bash
cp .env.example .env
```

Edit `techtonic2.0_certificates/.env`:
```env
# Google Drive Parent Folder (URL or ID)
GOOGLE_DRIVE_FOLDER_ID=1BdyPfPIQAWavRiT_7bcDjgBxoI4sIwin

# Optional: Direct Subfolder IDs (auto-discovered if omitted)
PARTICIPATION_GOOGLE_DRIVE_FOLDER_ID=1rdol-P_8_wPyGPga5VaM4M-bBotclUp-
CONTRIBUTION_GOOGLE_DRIVE_FOLDER_ID=1RbgjiSQSI9RQleJmKZOB7eAJYczReV03

# Supabase Credentials (from Supabase Dashboard -> Project Settings -> API)
SUPABASE_URL=https://zascuaokfrokfuxvlzeg.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here
```

---

### Step 5: Install Python Virtual Environment

Use Python 3.11 or 3.12:
```bash
cd techtonic2.0_certificates
python3 -m venv venv
source venv/bin/activate       # On macOS/Linux
# venv\Scripts\activate        # On Windows

pip install -r requirements.txt
```

---

### Step 6: Verify Great Vibes Font

Ensure `GreatVibes-Regular.ttf` is present in `fonts/`:
```bash
ls -la fonts/GreatVibes-Regular.ttf
```
*(If missing, download it for free from [Google Fonts](https://fonts.google.com/specimen/Great+Vibes) and place in `fonts/`)*.

---

## 🚀 Operating Guide & CLI Commands

### 1. Generating Certificates from Database (Recommended)

Add students to `techtonic2.0_members` in the Supabase Table Editor. Then run:

```bash
./venv/bin/python3 generate.py
```

**What it does automatically:**
- Fetches all entries from `techtonic2.0_members`.
- **Auto-skips** anyone who already has a certificate in `techtonic2.0_certificates` (immune to duplicate names).
- Overlays the recipient name in Golden Bronze (`#a26800`) Great Vibes font resting on the dark line.
- Adds custom designer rounded QR code (`https://cicr.in/certificate/:id`) with "Verify" and "Certificate Id".
- Uploads to Google Drive (`Participation` or `Contribution` subfolder) using your OAuth user quota.
- Sets file to publicly viewable and records `drive_file_id` in Supabase.

---

### 2. Dry-Run Testing (Safe Local Preview)
```bash
./venv/bin/python3 generate.py --dry-run
```
Generates PDFs in `output/` locally without modifying Supabase or uploading to Drive.

---

### 3. Filter by Role
```bash
# Process only participants
./venv/bin/python3 generate.py --role participant

# Process only core team members
./venv/bin/python3 generate.py --role team_member
```

---

### 4. Sync Missing Google Drive Uploads
If certificates were generated locally but Drive upload was skipped or failed:
```bash
./venv/bin/python3 generate.py --sync-drive
```
Finds any certificate with `drive_file_id IS NULL`, uploads it to Google Drive, and updates Supabase.

---

### 5. Reissuing / Correcting a Recipient Name (Single Command)
If a student reports an incorrect name spelling:
```bash
./venv/bin/python3 generate.py --reissue <CERTIFICATE_ID> --name "<CORRECTED_NAME>"
```

**Example:**
```bash
./venv/bin/python3 generate.py --reissue TEC2_CICR_1012 --name "Akanksha Nagar"
```

**What happens automatically:**
1. Keeps the **same Certificate ID** (`TEC2_CICR_1012`) and **same QR code**.
2. Regenerates the PDF locally with the corrected name.
3. **Updates the file on Google Drive in-place** (file ID and link stay identical).
4. Updates the name in both `techtonic2.0_certificates` and `techtonic2.0_members`.

---

### 6. Auto-Sync Names from Supabase Table
If you edit names directly in the Supabase Table Editor (`techtonic2.0_members`):
```bash
./venv/bin/python3 generate.py --sync-names
```
Scans for any name differences between `techtonic2.0_members` and `techtonic2.0_certificates` and automatically reissues them in-place.

---

## 🔒 Security & Git Policies

- **Git Isolation**: The entire `techtonic2.0_certificates/` folder is excluded via `.gitignore`. Certificates, credentials, tokens, and templates are never committed to GitHub.
- **No `VITE_` Prefix on Backend Keys**: All Supabase server keys are strictly `SUPABASE_SERVICE_ROLE_KEY` to prevent client bundling.
- **Detailed Reference**: For full architecture diagrams, visual coordinate specifications, and the complete error log, refer to [`DOCUMENTATION.md`](DOCUMENTATION.md).
