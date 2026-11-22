#!/usr/bin/env python3
"""
inspect_template.py — Helper to inspect the certificate PDF templates
and determine where to place the name and QR code.

Usage:
  python inspect_template.py templates/participation.pdf
  python inspect_template.py templates/contribution.pdf

This prints the page dimensions and positions of all text blocks and images
so you can fine-tune the placement constants in generate.py.
"""

import sys
from pathlib import Path

try:
    import pymupdf as fitz  # type: ignore[import-not-found,import-untyped]
except ImportError:
    try:
        import fitz  # type: ignore[import-not-found,import-untyped]
    except ImportError:
        fitz = None

if fitz is None:
    sys.exit("Install PyMuPDF: pip install pymupdf")


def inspect_pdf(pdf_path: str) -> None:
    doc = fitz.open(pdf_path)
    page = doc[0]
    r = page.rect

    print(f"\nFile: {pdf_path}")
    print(f"Page size: {r.width:.1f} × {r.height:.1f} pt  ({r.width/72:.2f} × {r.height/72:.2f} inches)")
    print(f"           {r.width * 25.4/72:.1f} × {r.height * 25.4/72:.1f} mm")
    print()

    print("── Text blocks ──────────────────────────────────────────")
    blocks = page.get_text("dict", flags=fitz.TEXT_PRESERVE_WHITESPACE)["blocks"]
    for b in blocks:
        if b.get("type") == 0:  # text block
            x0, y0, x1, y1 = b["bbox"]
            for line in b.get("lines", []):
                for span in line.get("spans", []):
                    text = span.get("text", "").strip()
                    if text:
                        sx, sy = span["origin"]
                        print(f"  '{text[:60]}' @ ({sx:.1f}, {sy:.1f})  size={span.get('size', '?'):.1f}  font={span.get('font', '?')}")

    print()
    print("── Images ───────────────────────────────────────────────")
    images = page.get_images(full=True)
    for img in images:
        xref = img[0]
        rects = page.get_image_rects(xref)
        for rect in rects:
            print(f"  xref={xref}  rect=({rect.x0:.1f}, {rect.y0:.1f}, {rect.x1:.1f}, {rect.y1:.1f})  size=({rect.width:.1f} × {rect.height:.1f})")

    print()
    print("── Annotations ──────────────────────────────────────────")
    for annot in page.annots():
        print(f"  type={annot.type}  rect={annot.rect}")

    doc.close()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python inspect_template.py <path-to-pdf>")
        sys.exit(1)
    inspect_pdf(sys.argv[1])

