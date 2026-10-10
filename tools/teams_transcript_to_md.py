#!/usr/bin/env python3
"""Print an MS Teams meeting transcript (.docx) as readable text – standard library only.

AI agents cannot read .docx directly; this lets them read a transcript without storing derived files in the repo.

Usage:
    python3 tools/teams_transcript_to_md.py docs/prepisy/2026-10-10_PM_Konzultace-1/prepis.docx
    python3 tools/teams_transcript_to_md.py prepis.docx -o /tmp/prepis.md   # optionally write to a file

A Teams .docx has one paragraph per utterance: the first line is "Name   mm:ss", the following line breaks are sentences.
"""
import argparse
import re
import sys
import zipfile
import xml.etree.ElementTree as ET

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
HEAD = re.compile(r"^(.+?)\s{2,}(\d{1,2}:\d{2}(?::\d{2})?)$")


def paragraphs(docx_path):
    with zipfile.ZipFile(docx_path) as z:
        root = ET.fromstring(z.read("word/document.xml"))
    for p in root.iter(W + "p"):
        lines, cur = [], []
        for el in p.iter():
            if el.tag == W + "t" and el.text:
                cur.append(el.text)
            elif el.tag in (W + "br", W + "cr"):
                lines.append("".join(cur))
                cur = []
            elif el.tag == W + "tab":
                cur.append("\t")
        lines.append("".join(cur))
        lines = [l.strip() for l in lines if l.strip()]
        if lines:
            yield lines


def convert(docx_path):
    header, turns = [], []
    for lines in paragraphs(docx_path):
        m = HEAD.match(lines[0])
        if m:
            turns.append((m.group(1).strip(), m.group(2), " ".join(lines[1:])))
        elif turns:
            turns.append((None, None, " ".join(lines)))
        else:
            header.extend(lines)
    out = [f"- {h}" for h in header] + [""]
    for who, ts, text in turns:
        out += [f"**{who}** `{ts}` — {text}" if who else f"_{text}_", ""]
    return "\n".join(out).rstrip() + "\n", len(turns)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("docx")
    ap.add_argument("-o", "--output", help="write to a file instead of stdout")
    a = ap.parse_args()
    text, n = convert(a.docx)
    if a.output:
        with open(a.output, "w", encoding="utf-8") as f:
            f.write(text)
    else:
        sys.stdout.reconfigure(encoding="utf-8")  # Windows consoles and pipes otherwise fail on Czech characters
        sys.stdout.write(text)
    print(f"{n} utterances", file=sys.stderr)


if __name__ == "__main__":
    main()
