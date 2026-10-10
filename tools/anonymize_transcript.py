#!/usr/bin/env python3
"""Anonymize an MS Teams transcript (.docx) before it goes into the repo – standard library only.

- The teacher's speaker label becomes "Teacher", every other speaker label becomes "Student".
- Every speaker's full name is replaced everywhere in the text as well.
- Profile photos (speaker avatars) are replaced with the generic avatar.
- Extra replacements for names spoken inside the text: --replace "pan novák=student" (repeatable).
- Prints every remaining "pan/paní/pane/panem…" mention so you can check it by hand.

Usage:
    python3 tools/anonymize_transcript.py "Konzultace 2.docx" docs/prepisy/2026-11-07_PM_Konzultace-2/prepis.docx \
        --teacher "Speaker 1" --replace "pan novák=student" --replace "Jana Nováková=Teacher"
"""
import argparse
import os
import re
import sys
import zipfile
from collections import Counter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from teams_transcript_to_md import HEAD, paragraphs  # noqa: E402

GENERIC_AVATAR_FALLBACK = bytes.fromhex(
    "89504e470d0a1a0a0000000d4948445200000001000000010806000000"
    "1f15c4890000000d49444154789c6360000002000154a24f5d0000000049454e44ae426082"
)


def speaker_labels(docx_path):
    labels = []
    for lines in paragraphs(docx_path):
        match = HEAD.match(lines[0])
        if match and match.group(1).strip() not in labels:
            labels.append(match.group(1).strip())
    return labels


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("source")
    parser.add_argument("target")
    parser.add_argument("--teacher", required=True, help='speaker label of the teacher, e.g. "Speaker 1"')
    parser.add_argument("--replace", action="append", default=[], help='"old=new" for names inside the text')
    args = parser.parse_args()

    labels = speaker_labels(args.source)
    if args.teacher not in labels:
        sys.exit(f"Teacher label {args.teacher!r} not found; labels are: {labels}")
    replacements = [tuple(item.split("=", 1)) for item in args.replace]
    replacements += [(label, "Teacher" if label == args.teacher else "Student") for label in labels]
    replacements.sort(key=lambda pair: len(pair[0]), reverse=True)

    with zipfile.ZipFile(args.source) as source:
        images = [name for name in source.namelist() if name.startswith("word/media/")]
        counts = Counter(source.read(name) for name in images)
        generic = counts.most_common(1)[0][0] if counts and counts.most_common(1)[0][1] > 1 else GENERIC_AVATAR_FALLBACK
        with zipfile.ZipFile(args.target, "w", zipfile.ZIP_DEFLATED) as target:
            for info in source.infolist():
                data = source.read(info.filename)
                if info.filename == "word/document.xml":
                    text = data.decode("utf-8")
                    for old, new in replacements:
                        text = text.replace(old, new)
                    data = text.encode("utf-8")
                elif info.filename in images:
                    data = generic
                target.writestr(info, data)

    text = "\n".join(" ".join(lines) for lines in paragraphs(args.target))
    leftovers = re.findall(r".{0,25}\b(?:[Pp]an|[Pp]aní|[Pp]ane|[Pp]anem|[Pp]anu|[Pp]ana)\b .{0,25}", text)
    print(f"Speakers: {len(labels)} → Teacher/Student; extra replacements: {len(args.replace)}", file=sys.stderr)
    print("Check these mentions by hand (add --replace for names):" if leftovers else "No pan/paní mentions left.", file=sys.stderr)
    for leftover in leftovers:
        print(f"  …{leftover}…", file=sys.stderr)


if __name__ == "__main__":
    main()
