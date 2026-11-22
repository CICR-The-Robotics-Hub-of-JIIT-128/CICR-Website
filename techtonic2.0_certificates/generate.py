#!/usr/bin/env python3
"""
TechTonic 2.0 Certificate Generator
=====================================
Generates participation and contribution certificates for TechTonic 2.0.

Usage:
  Single certificate:
    python generate.py --name "John Doe" --role participant
    python generate.py --name "Jane Smith" --role team_member

  Bulk from CSV:
    python generate.py --csv recipients.csv

  Bulk from Excel:
    python generate.py --excel recipients.xlsx

CSV/Excel format:
  name,role
  John Doe,participant
  Jane Smith,team_member

Requirements:
  pip install pymupdf qrcode pillow supabase google-api-python-client google-auth openpyxl pandas
"""

import argparse
import io
import os
import re
import sys
import time
import traceback
from pathlib import Path
from datetime import datetime, timezone

# ── Dependency checks ────────────────────────────────────────────────────────
try:
    import pymupdf as fitz  # type: ignore[import-not-found,import-untyped]
except ImportError:
    try:
        import fitz  # type: ignore[import-not-found,import-untyped]
    except ImportError:
        sys.exit("ERROR: PyMuPDF not installed. Run: pip install pymupdf")

try:
    import qrcode  # type: ignore[import-not-found,import-untyped]
    from qrcode.image.pil import PilImage  # type: ignore[import-not-found,import-untyped]
except ImportError:
    sys.exit("ERROR: qrcode not installed. Run: pip install qrcode[pil]")

try:
    from PIL import Image  # type: ignore[import-not-found,import-untyped]
except ImportError:
    sys.exit("ERROR: Pillow not installed. Run: pip install pillow")

try:
    from supabase import create_client, Client  # type: ignore[import-not-found,import-untyped]
except ImportError:
    sys.exit("ERROR: supabase not installed. Run: pip install supabase")

try:
    from googleapiclient.discovery import build  # type: ignore[import-not-found,import-untyped]
    from googleapiclient.http import MediaIoBaseUpload  # type: ignore[import-not-found,import-untyped]
    from google.oauth2 import service_account  # type: ignore[import-not-found,import-untyped]
    from google.oauth2.credentials import Credentials  # type: ignore[import-not-found,import-untyped]
    from google.auth.transport.requests import Request  # type: ignore[import-not-found,import-untyped]
    from google_auth_oauthlib.flow import InstalledAppFlow  # type: ignore[import-not-found,import-untyped]
except ImportError:
    sys.exit("ERROR: Google API client not installed. Run: pip install google-api-python-client google-auth google-auth-oauthlib")

# ── Load environment variables from .env ─────────────────────────────────────
from dotenv import load_dotenv  # type: ignore[import-not-found,import-untyped]
load_dotenv(dotenv_path=Path(__file__).parent / ".env")
load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

# ── Configuration ─────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).parent.resolve()
TEMPLATES = {
    "participant": BASE_DIR / "templates" / "participation.pdf",
    "team_member": BASE_DIR / "templates" / "contribution.pdf",
}
OUTPUT_DIRS = {
    "participant": BASE_DIR / "output" / "participation",
    "team_member": BASE_DIR / "output" / "contribution",
}
FONTS_DIR = BASE_DIR / "fonts"
FONT_PATH = FONTS_DIR / "GreatVibes-Regular.ttf"

CERT_ID_PREFIX = "TEC2_CICR_"

# Name text styling — exact match with Canva design
NAME_FONT_SIZE = 54          # pt
NAME_COLOR = (162 / 255, 104 / 255, 0.0)  # Golden Bronze (#a26800) matching Canva reference

# QR code styling — smaller & compact
QR_FG_COLOR = "#110745"      # Dark Indigo / Navy
QR_BG_COLOR = "#ffffff"
QR_BOX_SIZE = 8              # pixels per module (high resolution, compact)
QR_BORDER = 1                # compact quiet zone matching Canva
QR_DPI = 300                 # DPI for final PDF export

# Certificate ID & Verify label styling
VERIFY_FONT_SIZE = 7.0       # pt — clean, small, centered above Certificate Id
CERT_ID_FONT_SIZE = 6.0      # pt — clean, readable, unobtrusive
CERT_ID_COLOR = (17 / 255, 7 / 255, 69 / 255)  # Dark Indigo in RGB 0–1

VERIFICATION_BASE_URL = "https://cicr.in/certificate/"

def extract_folder_id(val: str) -> str:
    if not val:
        return ""
    val = val.strip()
    match = re.search(r"folders/([a-zA-Z0-9_-]+)", val)
    if match:
        return match.group(1)
    return val


# Google Drive folder IDs where certificates will be uploaded
# Supports explicit folder IDs for Participation and Contribution:
PARTICIPATION_FOLDER_ID = extract_folder_id(
    os.environ.get("PARTICIPATION_GOOGLE_DRIVE_FOLDER_ID")
    or os.environ.get("GOOGLE_DRIVE_PARTICIPATION_FOLDER_ID")
    or ""
)
CONTRIBUTION_FOLDER_ID = extract_folder_id(
    os.environ.get("CONTRIBUTION_GOOGLE_DRIVE_FOLDER_ID")
    or os.environ.get("GOOGLE_DRIVE_CONTRIBUTION_FOLDER_ID")
    or ""
)
# Parent 'CERTIFICATES' folder fallback (auto-discovers Participation and Contribution subfolders):
PARENT_DRIVE_FOLDER_ID = extract_folder_id(
    os.environ.get("GOOGLE_DRIVE_FOLDER_ID")
    or os.environ.get("CERTIFICATES_GOOGLE_DRIVE_FOLDER_ID")
    or ""
)

CREDENTIAL_CANDIDATES = [
    BASE_DIR / "credentials" / "service_account.json",
    BASE_DIR / "credentials" / "server.json",
]
GOOGLE_CREDENTIALS_FILE = next((f for f in CREDENTIAL_CANDIDATES if f.exists()), CREDENTIAL_CANDIDATES[0])
CLIENT_SECRET_FILE = BASE_DIR / "credentials" / "client_secret.json"
TOKEN_FILE = BASE_DIR / "credentials" / "token.json"
DRIVE_SCOPES = ["https://www.googleapis.com/auth/drive"]

# Supabase
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
TABLE_NAME = "techtonic2.0_certificates"
MEMBERS_TABLE_NAME = "techtonic2.0_members"

_FOLDER_CACHE: dict[str, str] = {}


def get_target_drive_folder_id(drive_service, role: str) -> str:
    """
    Returns the designated Google Drive folder ID for the role ('participant' or 'team_member').
    1. Checks explicit environment variables (PARTICIPATION_GOOGLE_DRIVE_FOLDER_ID / CONTRIBUTION_GOOGLE_DRIVE_FOLDER_ID).
    2. If not directly set, searches inside the parent GOOGLE_DRIVE_FOLDER_ID for a subfolder named 'Participation' or 'Contribution'.
    3. Falls back to parent GOOGLE_DRIVE_FOLDER_ID if no subfolder found.
    """
    if role == "participant" and PARTICIPATION_FOLDER_ID:
        return PARTICIPATION_FOLDER_ID
    if role == "team_member" and CONTRIBUTION_FOLDER_ID:
        return CONTRIBUTION_FOLDER_ID

    if role in _FOLDER_CACHE:
        return _FOLDER_CACHE[role]

    if not PARENT_DRIVE_FOLDER_ID or not drive_service:
        return ""

    target_name = "Participation" if role == "participant" else "Contribution"
    try:
        query = (
            f"'{PARENT_DRIVE_FOLDER_ID}' in parents and "
            f"mimeType = 'application/vnd.google-apps.folder' and "
            f"trashed = false"
        )
        response = (
            drive_service.files()
            .list(
                q=query,
                spaces="drive",
                fields="files(id, name)",
                pageSize=50,
            )
            .execute()
        )

        files = response.get("files", [])
        for f in files:
            if f.get("name", "").strip().lower() == target_name.lower():
                found_id = f.get("id")
                _FOLDER_CACHE[role] = found_id
                return found_id
    except Exception as e:
        print(f"Notice: Could not auto-discover subfolder '{target_name}' in Google Drive: {e}")

    # Fallback to parent folder if specific subfolder not found
    _FOLDER_CACHE[role] = PARENT_DRIVE_FOLDER_ID
    return PARENT_DRIVE_FOLDER_ID

# ── Helpers ───────────────────────────────────────────────────────────────────

def get_supabase_client() -> Client:
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        sys.exit(
            "ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env"
        )
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def get_drive_service():
    """
    Authenticate with Google Drive.
    Prefers OAuth 2.0 (client_secret.json / token.json) so uploads use human user quota (15 GB free),
    avoiding the service account 'storageQuotaExceeded' 0-byte quota error on personal Gmail accounts.
    Falls back to service_account.json if client_secret.json is not present.
    """
    creds = None
    if CLIENT_SECRET_FILE.exists() or TOKEN_FILE.exists():
        if TOKEN_FILE.exists():
            try:
                creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), DRIVE_SCOPES)
            except Exception:
                creds = None
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    str(CLIENT_SECRET_FILE), DRIVE_SCOPES
                )
                creds = flow.run_local_server(port=0)
            with open(TOKEN_FILE, "w") as token:
                token.write(creds.to_json())
        return build("drive", "v3", credentials=creds, cache_discovery=False)

    if GOOGLE_CREDENTIALS_FILE.exists():
        creds = service_account.Credentials.from_service_account_file(
            str(GOOGLE_CREDENTIALS_FILE),
            scopes=DRIVE_SCOPES,
        )
        return build("drive", "v3", credentials=creds, cache_discovery=False)

    sys.exit(
        f"ERROR: Google credentials not found at:\n"
        f"  {CLIENT_SECRET_FILE} or {GOOGLE_CREDENTIALS_FILE}\n"
    )


def allocate_certificate_id(supabase: Client) -> str:
    """
    Atomically allocate the next certificate ID using a counter table.
    Uses Supabase RPC for atomic increment to prevent race conditions.
    Returns e.g. "TEC2_CICR_1001".
    """
    # Call the SQL function that atomically increments and returns next value
    response = supabase.rpc("next_techtonic2_cert_number").execute()
    if hasattr(response, "error") and response.error:
        raise RuntimeError(f"Failed to allocate certificate ID: {response.error}")
    next_num = response.data
    return f"{CERT_ID_PREFIX}{next_num}"


def insert_certificate_record(
    supabase: Client,
    cert_id: str,
    name: str,
    role: str,
    member_id: int | None = None,
) -> None:
    """Insert certificate record. Raises on duplicate or error."""
    payload = {"certificate_id": cert_id, "name": name, "role": role}
    if member_id is not None:
        payload["member_id"] = member_id
    response = (
        supabase.table(TABLE_NAME)
        .insert(payload)
        .execute()
    )
    if hasattr(response, "error") and response.error:
        raise RuntimeError(f"DB insert failed: {response.error}")


def update_drive_file_id(
    supabase: Client, cert_id: str, drive_file_id: str
) -> None:
    """Update the drive_file_id column for a certificate."""
    response = (
        supabase.table(TABLE_NAME)
        .update({"drive_file_id": drive_file_id})
        .eq("certificate_id", cert_id)
        .execute()
    )
    if hasattr(response, "error") and response.error:
        raise RuntimeError(f"DB update (drive_file_id) failed: {response.error}")


def update_certificate_generated_at(
    supabase: Client, cert_id: str, timestamp_iso: str | None = None
) -> None:
    """Update the certificate_generated_at column whenever a certificate is generated for a particular ID."""
    if timestamp_iso is None:
        timestamp_iso = datetime.now(timezone.utc).isoformat()
    response = (
        supabase.table(TABLE_NAME)
        .update({"certificate_generated_at": timestamp_iso})
        .eq("certificate_id", cert_id)
        .execute()
    )
    if hasattr(response, "error") and response.error:
        raise RuntimeError(f"DB update (certificate_generated_at) failed: {response.error}")


def delete_certificate_record(supabase: Client, cert_id: str) -> None:
    """Rollback: delete a certificate record if generation/upload fails."""
    supabase.table(TABLE_NAME).delete().eq("certificate_id", cert_id).execute()


def build_qr_code(url: str, style: str = "rounded") -> Image.Image:
    """
    Generate a modern designer QR code matching high-end design aesthetics:
    - 'rounded': Sleek rounded-tile modules (custom designer look)
    - 'circles': Modern circular dot-matrix modules
    - 'square': Classic crisp square modules
    """
    qr = qrcode.QRCode(
        version=None,  # auto-fit
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=1,
    )
    qr.add_data(url)
    qr.make(fit=True)

    try:
        from qrcode.image.styledpil import StyledPilImage  # type: ignore[import-not-found,import-untyped]
        from qrcode.image.styles.moduledrawers.pil import (  # type: ignore[import-not-found,import-untyped]
            RoundedModuleDrawer,
            CircleModuleDrawer,
        )
        from qrcode.image.styles.colormasks import SolidFillColorMask  # type: ignore[import-not-found,import-untyped]

        drawer = CircleModuleDrawer() if style == "circles" else RoundedModuleDrawer()
        img = qr.make_image(
            image_factory=StyledPilImage,
            module_drawer=drawer,
            color_mask=SolidFillColorMask(
                back_color=(255, 255, 255),
                front_color=(17, 7, 69),  # Dark Navy/Indigo #110745
            ),
        )
    except Exception:
        # Fallback to standard clean QR if styled drawer unavailable
        img = qr.make_image(fill_color=QR_FG_COLOR, back_color=QR_BG_COLOR)

    return img.convert("RGBA")


def find_qr_placeholder_rect(page: fitz.Page) -> fitz.Rect:
    """
    Position the QR code centered horizontally and lowered vertically
    to sit squarely between the two signatures and titles.
    Midpoint of signature gap is x = 430.5 pt.
    """
    qr_cx = 430.5   # exact midpoint between the two signature blocks
    qr_size = 56.0  # compact, elegant square matching reference
    qr_x0 = qr_cx - qr_size / 2  # 402.5 pt
    qr_y0 = 445.0  # pt (lowered between Dr. Parul Arora & Mr. Yasharth Singh)
    return fitz.Rect(qr_x0, qr_y0, qr_x0 + qr_size, qr_y0 + qr_size)


def find_name_insert_point(page: fitz.Page) -> tuple[float, float]:
    """
    Position recipient name resting directly above the template's dark line (y=305.78 pt).
    """
    page_rect = page.rect
    cx = page_rect.width / 2        # horizontal centre ≈ 420.95 pt
    cy = 299.0                      # pt (rests right above the line at 305.78 pt)
    return cx, cy


def overlay_name_and_qr(
    template_path: Path,
    output_path: Path,
    name: str,
    cert_id: str,
    qr_image: Image.Image,
) -> None:
    """
    Open the PDF template, insert the recipient name and QR code,
    and save to output_path.
    """
    if not FONT_PATH.exists():
        raise FileNotFoundError(
            f"Great Vibes font not found at {FONT_PATH}.\n"
            f"Download it from Google Fonts and place GreatVibes-Regular.ttf in:\n"
            f"  {FONTS_DIR}"
        )

    doc = fitz.open(str(template_path))
    page = doc[0]  # single-page certificate

    # The template's dark line at y=305.78 is preserved below the name

    # ── Insert recipient name ────────────────────────────────────────
    cx, cy = find_name_insert_point(page)
    text_writer = fitz.TextWriter(page.rect)
    font = fitz.Font(fontfile=str(FONT_PATH))
    # Measure text width to centre it
    text_length = font.text_length(name, fontsize=NAME_FONT_SIZE)
    text_x = cx - text_length / 2
    text_y = cy
    text_writer.append(
        pos=(text_x, text_y),
        text=name,
        font=font,
        fontsize=NAME_FONT_SIZE,
    )
    text_writer.write_text(page, color=NAME_COLOR)

    # ── Insert QR code ───────────────────────────────────────────────
    qr_rect = find_qr_placeholder_rect(page)
    # Convert PIL image to PNG bytes
    qr_buf = io.BytesIO()
    qr_image.save(qr_buf, format="PNG", dpi=(QR_DPI, QR_DPI))
    qr_bytes = qr_buf.getvalue()
    page.insert_image(qr_rect, stream=qr_bytes, overlay=True)

    # ── Insert "Verify" and certificate ID text below QR ─────────────
    text_writer = fitz.TextWriter(page.rect)
    id_font = fitz.Font("helv")  # Helvetica — clean, readable

    # "Verify" label centered below QR
    verify_text = "Verify"
    verify_len = id_font.text_length(verify_text, fontsize=VERIFY_FONT_SIZE)
    verify_x = 430.5 - verify_len / 2
    verify_y = qr_rect.y1 + 8.0
    text_writer.append(
        pos=(verify_x, verify_y),
        text=verify_text,
        font=id_font,
        fontsize=VERIFY_FONT_SIZE,
    )

    # "Certificate Id : <cert_id>" centered below "Verify"
    id_text = f"Certificate Id : {cert_id}"
    id_text_len = id_font.text_length(id_text, fontsize=CERT_ID_FONT_SIZE)
    id_x = 430.5 - id_text_len / 2
    id_y = verify_y + 8.0
    text_writer.append(
        pos=(id_x, id_y),
        text=id_text,
        font=id_font,
        fontsize=CERT_ID_FONT_SIZE,
    )

    text_writer.write_text(page, color=CERT_ID_COLOR)

    # ── Save ─────────────────────────────────────────────────────────
    doc.save(str(output_path), deflate=True, garbage=4)
    doc.close()


def upload_to_drive(
    drive_service,
    file_path: Path,
    cert_id: str,
    folder_id: str,
) -> str:
    """
    Upload the generated PDF to Google Drive and return the file ID.
    Sets the file to publicly readable so the verification page can embed it.
    """
    file_metadata = {
        "name": file_path.name,
        "parents": [folder_id] if folder_id else [],
    }
    with open(file_path, "rb") as f:
        media = MediaIoBaseUpload(f, mimetype="application/pdf", resumable=True)
        uploaded = (
            drive_service.files()
            .create(body=file_metadata, media_body=media, fields="id")
            .execute()
        )
    file_id = uploaded.get("id")

    # Make file publicly readable (anyone with link can view)
    drive_service.permissions().create(
        fileId=file_id,
        body={"type": "anyone", "role": "reader"},
    ).execute()

    return file_id


def update_drive_file(
    drive_service,
    file_path: Path,
    file_id: str,
) -> str:
    """Update existing file in Google Drive in-place so link and file ID stay identical."""
    with open(file_path, "rb") as f:
        media = MediaIoBaseUpload(f, mimetype="application/pdf", resumable=True)
        drive_service.files().update(
            fileId=file_id,
            media_body=media,
            fields="id",
        ).execute()
    return file_id


def generate_certificate(
    supabase: Client,
    drive_service,
    name: str,
    role: str,
    member_id: int | None = None,
    dry_run: bool = False,
) -> dict:
    """
    Full end-to-end certificate generation for one recipient.
    Returns a result dict with status, cert_id, output_path, drive_file_id.
    Is safe to retry: rolls back DB record if generation or upload fails.
    """
    result = {
        "name": name,
        "role": role,
        "member_id": member_id,
        "status": "pending",
        "cert_id": None,
        "output_path": None,
        "drive_file_id": None,
        "error": None,
    }

    if role not in ("participant", "team_member"):
        result["status"] = "failed"
        result["error"] = f"Invalid role '{role}'. Must be 'participant' or 'team_member'."
        return result

    template_path = TEMPLATES[role]
    if not template_path.exists():
        result["status"] = "failed"
        result["error"] = f"Template not found: {template_path}"
        return result

    output_dir = OUTPUT_DIRS[role]
    output_dir.mkdir(parents=True, exist_ok=True)

    # Step 1: Allocate certificate ID (atomic)
    try:
        if dry_run:
            cert_id = f"{CERT_ID_PREFIX}1001"
        else:
            cert_id = allocate_certificate_id(supabase)
    except Exception as e:
        result["status"] = "failed"
        result["error"] = f"ID allocation failed: {e}"
        return result

    result["cert_id"] = cert_id
    output_path = output_dir / f"{cert_id}.pdf"
    result["output_path"] = str(output_path)

    # Step 2: Insert DB record (before generation, so ID is locked)
    try:
        if not dry_run:
            insert_certificate_record(supabase, cert_id, name, role, member_id=member_id)
    except Exception as e:
        result["status"] = "failed"
        result["error"] = f"DB insert failed: {e}"
        return result

    # Step 3: Generate QR code
    try:
        qr_url = f"{VERIFICATION_BASE_URL}{cert_id}"
        qr_image = build_qr_code(qr_url)
    except Exception as e:
        if not dry_run:
            delete_certificate_record(supabase, cert_id)
        result["status"] = "failed"
        result["error"] = f"QR generation failed: {e}"
        return result

    # Step 4: Generate PDF
    try:
        overlay_name_and_qr(template_path, output_path, name, cert_id, qr_image)
        if not dry_run:
            update_certificate_generated_at(supabase, cert_id)
    except Exception as e:
        if not dry_run:
            delete_certificate_record(supabase, cert_id)
        result["status"] = "failed"
        result["error"] = f"PDF generation failed: {e}\n{traceback.format_exc()}"
        return result

    # Step 5: Upload to Google Drive
    try:
        target_folder_id = get_target_drive_folder_id(drive_service, role) if drive_service else ""
        if not dry_run and target_folder_id:
            drive_file_id = upload_to_drive(
                drive_service, output_path, cert_id, target_folder_id
            )
            update_drive_file_id(supabase, cert_id, drive_file_id)
            result["drive_file_id"] = drive_file_id
        elif dry_run:
            result["drive_file_id"] = "[dry-run — not uploaded]"
        elif not target_folder_id and not dry_run:
            result["status"] = "partial"
            result["error"] = f"No Google Drive folder ID found for role '{role}'."
            return result
    except Exception as e:
        # PDF is generated and DB record exists, but upload failed.
        # Leave DB record intact (can re-upload manually), but flag error.
        result["status"] = "partial"
        result["error"] = f"Drive upload failed (PDF saved locally): {e}"
        return result

    result["status"] = "success"
    return result


def reissue_certificate(
    supabase: Client,
    drive_service,
    cert_id: str,
    new_name: str,
    new_role: str | None = None,
    dry_run: bool = False,
) -> dict:
    """
    Reissue an existing certificate with a corrected name (and optional role).
    Preserves the certificate ID, updates PDF locally, updates/replaces on Google Drive,
    and updates Supabase records.
    """
    res = supabase.table(TABLE_NAME).select("*").eq("certificate_id", cert_id).execute()
    if not res.data:
        sys.exit(f"ERROR: Certificate '{cert_id}' not found in database.")

    current = res.data[0]
    old_name = current["name"]
    role = new_role or current["role"]
    existing_drive_id = current.get("drive_file_id")
    member_id = current.get("member_id")

    print(f"\nReissuing {cert_id}:")
    print(f"   Old Name : {old_name}")
    print(f"   New Name : {new_name}")
    print(f"   Role     : {role}")

    template_path = TEMPLATES[role]
    if not template_path.exists():
        sys.exit(f"ERROR: Template for '{role}' not found at {template_path}")

    output_dir = OUTPUT_DIRS[role]
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / f"{cert_id}.pdf"

    # Step 1: Generate QR code for same cert_id
    qr_url = f"{VERIFICATION_BASE_URL}{cert_id}"
    qr_image = build_qr_code(qr_url)

    # Step 2: Generate PDF with corrected name
    overlay_name_and_qr(template_path, output_path, new_name, cert_id, qr_image)
    print(f"   ✅ Generated updated PDF: {output_path}")

    if dry_run:
        print("   [DRY RUN] PDF saved locally. No Drive or DB updates made.\n")
        return {"status": "success", "cert_id": cert_id, "name": new_name}

    # Step 3: Update Google Drive
    drive_file_id = existing_drive_id
    if drive_service:
        target_folder = get_target_drive_folder_id(drive_service, role)
        if existing_drive_id:
            try:
                update_drive_file(drive_service, output_path, existing_drive_id)
                print(f"   ✅ Updated in-place on Google Drive (File ID: {existing_drive_id})")
            except Exception as e:
                print(f"   Notice: In-place update failed ({e}), uploading new file…")
                drive_file_id = upload_to_drive(drive_service, output_path, cert_id, target_folder)
                print(f"   ✅ Uploaded new file to Google Drive (File ID: {drive_file_id})")
        else:
            drive_file_id = upload_to_drive(drive_service, output_path, cert_id, target_folder)
            print(f"   ✅ Uploaded file to Google Drive (File ID: {drive_file_id})")

    # Step 4: Update Supabase (both tables)
    now_iso = datetime.now(timezone.utc).isoformat()
    # 1. Update techtonic2.0_certificates table
    supabase.table(TABLE_NAME).update({
        "name": new_name,
        "drive_file_id": drive_file_id,
        "certificate_generated_at": now_iso,
    }).eq("certificate_id", cert_id).execute()

    # 2. Update techtonic2.0_members table
    if member_id:
        try:
            supabase.table(MEMBERS_TABLE_NAME).update({
                "name": new_name,
            }).eq("id", member_id).execute()
        except Exception as e:
            print(f"   Notice: Could not update {MEMBERS_TABLE_NAME} by ID: {e}")
    else:
        try:
            supabase.table(MEMBERS_TABLE_NAME).update({
                "name": new_name,
            }).eq("name", old_name).execute()
        except Exception:
            pass

    print(f"   ✅ Updated name in both '{TABLE_NAME}' and '{MEMBERS_TABLE_NAME}'")
    print(f"   ✅ Certificate {cert_id} successfully reissued!\n")
    return {"status": "success", "cert_id": cert_id, "name": new_name, "drive_file_id": drive_file_id}


def sync_corrected_names(supabase: Client, drive_service, dry_run: bool = False) -> None:
    """
    Check if any names were edited in techtonic2.0_members that differ from techtonic2.0_certificates.
    Automatically reissues those certificates in-place!
    """
    print("Checking for corrected names in 'techtonic2.0_members'…")
    members_res = supabase.table(MEMBERS_TABLE_NAME).select("id, name, role").execute()
    certs_res = supabase.table(TABLE_NAME).select("certificate_id, member_id, name, role").execute()

    members_by_id = {m["id"]: m for m in (members_res.data or [])}
    discrepancies = []

    for cert in (certs_res.data or []):
        m_id = cert.get("member_id")
        if m_id and m_id in members_by_id:
            member = members_by_id[m_id]
            if member["name"].strip() != cert["name"].strip():
                discrepancies.append({
                    "cert_id": cert["certificate_id"],
                    "old_name": cert["name"],
                    "new_name": member["name"].strip(),
                    "role": member.get("role") or cert["role"],
                })

    if not discrepancies:
        print("✅ No name discrepancies found between members and issued certificates.")
        return

    print(f"Found {len(discrepancies)} corrected name(s) to reissue:\n")
    for d in discrepancies:
        reissue_certificate(
            supabase,
            drive_service,
            cert_id=d["cert_id"],
            new_name=d["new_name"],
            new_role=d["role"],
            dry_run=dry_run,
        )


def print_result(res: dict) -> None:
    status_sym = {"success": "✅", "partial": "⚠️", "failed": "❌", "pending": "⏳"}.get(
        res["status"], "?"
    )
    print(f"{status_sym} [{res['status'].upper()}] {res['name']} ({res['role']})")
    if res["cert_id"]:
        print(f"   Certificate ID : {res['cert_id']}")
    if res["output_path"]:
        print(f"   Output PDF     : {res['output_path']}")
    if res["drive_file_id"]:
        print(f"   Drive File ID  : {res['drive_file_id']}")
    if res["error"]:
        print(f"   Error          : {res['error']}")
    print()


# ── CLI ───────────────────────────────────────────────────────────────────────

def parse_args():
    p = argparse.ArgumentParser(
        description="TechTonic 2.0 Certificate Generator",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    group = p.add_mutually_exclusive_group()
    group.add_argument("--name", help="Recipient full name (use with --role)")
    group.add_argument("--csv", metavar="FILE", help="CSV file with name,role columns")
    group.add_argument("--excel", metavar="FILE", help="Excel file with name,role columns")
    group.add_argument(
        "--from-db",
        "--db",
        action="store_true",
        help=f"Fetch members from '{MEMBERS_TABLE_NAME}' in Supabase (default)",
    )

    p.add_argument(
        "--role",
        choices=["participant", "team_member"],
        help="Role for single certificate (or filter when pulling from DB)",
    )
    p.add_argument(
        "--dry-run",
        action="store_true",
        help="Generate PDF locally without uploading to Drive or writing to DB",
    )
    p.add_argument(
        "--sync-drive",
        action="store_true",
        help="Upload already-generated local PDFs to Google Drive and update Supabase drive_file_id",
    )
    p.add_argument(
        "--reissue",
        metavar="CERT_ID",
        help="Reissue existing certificate by ID with new name (e.g. --reissue TEC2_CICR_1012 --name 'Correct Name')",
    )
    p.add_argument(
        "--sync-names",
        action="store_true",
        help="Auto-detect any name corrections in 'techtonic2.0_members' table and reissue certificates in-place",
    )
    p.add_argument(
        "--force",
        action="store_true",
        help="Force generation even if certificate already exists for that recipient",
    )
    return p.parse_args()


def load_members_from_db(
    supabase: Client,
    skip_existing: bool = True,
    role_filter: str | None = None,
) -> list[dict]:
    """
    Fetch members from the techtonic2.0_members table.
    Only includes auto-generated id, member name, and role.
    If skip_existing is True, skips anyone who already has a certificate in techtonic2.0_certificates.
    """
    # Check MEMBERS_TABLE_NAME; fallback to techtonic2.0_participants if table name differs
    table = MEMBERS_TABLE_NAME
    query = (
        supabase.table(table)
        .select("id, name, role")
        .order("id")
    )
    if role_filter:
        query = query.eq("role", role_filter)
    try:
        resp = query.execute()
    except Exception:
        # Fallback in case table was created with old name
        resp = supabase.table("techtonic2.0_participants").select("id, name, role").order("id").execute()
    members = resp.data or []

    if not members:
        return []

    if skip_existing:
        existing_resp = (
            supabase.table(TABLE_NAME)
            .select("certificate_id, member_id, name, role")
            .execute()
        )
        existing_data = existing_resp.data or []

        # 1. Primary check: member_id lookup (Option B: completely duplicate-name safe)
        existing_by_member_id = {
            row["member_id"]: row["certificate_id"]
            for row in existing_data
            if row.get("member_id") is not None
        }

        # 2. Fallback check: (name, role) lookup for legacy / manual certs without member_id
        existing_by_name = {
            (row["name"].strip().lower(), row["role"].strip().lower()): row["certificate_id"]
            for row in existing_data
        }

        filtered = []
        for m in members:
            m_id = m.get("id")
            m_name = m.get("name", "").strip()
            m_role = m.get("role", "").strip()
            name_key = (m_name.lower(), m_role.lower())

            if m_id in existing_by_member_id:
                cert_id = existing_by_member_id[m_id]
                print(f"ℹ️  [ALREADY GENERATED] {m_name} ({m_role}, ID #{m_id}) → {cert_id} (skipping)")
            elif name_key in existing_by_name:
                cert_id = existing_by_name[name_key]
                print(f"ℹ️  [ALREADY GENERATED] {m_name} ({m_role}) → {cert_id} (skipping)")
            else:
                filtered.append(m)
        return filtered

    return members


def load_recipients_from_csv(csv_path: str) -> list[dict]:
    import csv
    recipients = []
    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            name = row.get("name", "").strip()
            role = row.get("role", "").strip().lower()
            if name and role:
                recipients.append({"name": name, "role": role})
    return recipients


def load_recipients_from_excel(xlsx_path: str) -> list[dict]:
    try:
        import pandas as pd  # type: ignore[import-not-found,import-untyped]
    except ImportError:
        sys.exit("ERROR: pandas not installed. Run: pip install pandas openpyxl")
    df = pd.read_excel(xlsx_path)
    df.columns = [c.strip().lower() for c in df.columns]
    recipients = []
    for _, row in df.iterrows():
        name = str(row.get("name", "")).strip()
        role = str(row.get("role", "")).strip().lower()
        if name and role and name != "nan":
            recipients.append({"name": name, "role": role})
    return recipients


def sync_drive_uploads(supabase: Client, drive_service) -> None:
    """Upload any local PDFs that have no drive_file_id in Supabase."""
    print("Checking for certificates without Drive uploads…")
    res = supabase.table(TABLE_NAME).select("*").is_("drive_file_id", "null").order("certificate_id").execute()
    missing = res.data or []
    if not missing:
        print("✅ All certificates in Supabase already have Google Drive file IDs!")
        return

    print(f"Found {len(missing)} certificate(s) missing Drive file IDs. Starting upload…\n")
    successes = 0
    failures = 0
    for i, cert in enumerate(missing, 1):
        cert_id = cert["certificate_id"]
        role = cert["role"]
        name = cert["name"]
        pdf_path = OUTPUT_DIRS[role] / f"{cert_id}.pdf"
        if not pdf_path.exists():
            print(f"[{i}/{len(missing)}] ⚠️ Local file not found for {cert_id} ({pdf_path})")
            failures += 1
            continue

        target_folder = get_target_drive_folder_id(drive_service, role)
        if not target_folder:
            print(f"[{i}/{len(missing)}] ❌ No target Drive folder found for role '{role}'")
            failures += 1
            continue

        try:
            drive_file_id = upload_to_drive(drive_service, pdf_path, cert_id, target_folder)
            update_drive_file_id(supabase, cert_id, drive_file_id)
            print(f"[{i}/{len(missing)}] ✅ Uploaded {cert_id} ({name}): Drive ID {drive_file_id}")
            successes += 1
        except Exception as e:
            print(f"[{i}/{len(missing)}] ❌ Failed {cert_id}: {e}")
            failures += 1
        time.sleep(0.3)

    print()
    print("=" * 60)
    print(f"  Drive Sync Complete: {successes} uploaded, {failures} failed")
    print("=" * 60)


def main():
    args = parse_args()

    print("=" * 60)
    print("  TechTonic 2.0 Certificate Generator")
    print(f"  Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    if args.dry_run:
        print("  MODE: DRY RUN (no DB writes, no Drive uploads)")
    print("=" * 60)
    print()

    # Build Supabase + Drive clients
    supabase = None
    drive_service = None
    if not args.dry_run or args.sync_drive or args.reissue or args.sync_names:
        supabase = get_supabase_client()
        drive_service = get_drive_service()
    else:
        try:
            supabase = get_supabase_client()
        except Exception:
            supabase = None

    if args.sync_drive:
        sync_drive_uploads(supabase, drive_service)
        return

    if args.reissue:
        if not args.name:
            sys.exit("ERROR: --name is required when using --reissue (e.g. --reissue TEC2_CICR_1012 --name 'Correct Name')")
        reissue_certificate(
            supabase,
            drive_service,
            cert_id=args.reissue,
            new_name=args.name,
            new_role=args.role,
            dry_run=args.dry_run,
        )
        return

    if args.sync_names:
        sync_corrected_names(supabase, drive_service, dry_run=args.dry_run)
        return

    # Collect recipients
    if args.name:
        if not args.role:
            sys.exit("ERROR: --role is required when using --name")
        recipients = [{"name": args.name, "role": args.role}]
    elif args.csv:
        recipients = load_recipients_from_csv(args.csv)
        print(f"Loaded {len(recipients)} recipients from {args.csv}")
    elif args.excel:
        recipients = load_recipients_from_excel(args.excel)
        print(f"Loaded {len(recipients)} recipients from {args.excel}")
    else:
        # Default: Fetch members from techtonic2.0_members table
        if not supabase:
            supabase = get_supabase_client()
        recipients = load_members_from_db(
            supabase,
            skip_existing=not args.force,
            role_filter=args.role,
        )
        print(f"Fetched {len(recipients)} new member(s) to issue from '{MEMBERS_TABLE_NAME}'")

    if not recipients:
        sys.exit("No recipients found.")

    print(f"Generating {len(recipients)} certificate(s)…\n")

    successes = []
    failures = []
    partials = []

    for i, r in enumerate(recipients, 1):
        print(f"[{i}/{len(recipients)}] Processing: {r['name']} ({r['role']})")
        res = generate_certificate(
            supabase,
            drive_service,
            name=r["name"],
            role=r["role"],
            member_id=r.get("id"),
            dry_run=args.dry_run,
        )
        print_result(res)

        if res["status"] == "success":
            successes.append(res)
        elif res["status"] == "partial":
            partials.append(res)
        else:
            failures.append(res)

        # Small delay between requests to avoid rate-limiting
        if i < len(recipients):
            time.sleep(0.5)

    # Summary
    print("=" * 60)
    print("  SUMMARY")
    print("=" * 60)
    print(f"  ✅ Successful : {len(successes)}")
    print(f"  ⚠️  Partial   : {len(partials)}")
    print(f"  ❌ Failed     : {len(failures)}")
    print()

    if partials:
        print("Partial (PDF saved, Drive upload failed):")
        for r in partials:
            print(f"  • {r['name']} [{r['cert_id']}] — {r['error']}")
        print()

    if failures:
        print("Failed:")
        for r in failures:
            print(f"  • {r['name']} — {r['error']}")
        print()

    sys.exit(0 if not failures else 1)


if __name__ == "__main__":
    main()
