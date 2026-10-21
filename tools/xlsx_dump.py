#!/usr/bin/env python3
"""Print every non-empty cell of an .xlsx file as text – standard library only.

AI agents cannot read .xlsx directly; this lets them read the PBS or the capacity plan without openpyxl.

Usage:
    python3 tools/xlsx_dump.py PBS-Tym-1.xlsx
    python3 tools/xlsx_dump.py "Kapacitní plán.xlsx" --sheet S1
    python3 tools/xlsx_dump.py PBS-Tym-1.xlsx --validations   # also print the cells' allowed values

Output: one line per row, "A2=Supporting Activities | B2=Git repository … | F2=3"; a formula is shown as "F118=545 [=SUM(F2:F117)]".
"""
import argparse
import sys
import zipfile
import xml.etree.ElementTree as ET

MAIN = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
RELATIONSHIP = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"


def shared_strings(archive):
    if "xl/sharedStrings.xml" not in archive.namelist():
        return []
    root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
    return ["".join(text.text or "" for text in item.iter(MAIN + "t")) for item in root.findall(MAIN + "si")]


def sheet_paths(archive):
    workbook = ET.fromstring(archive.read("xl/workbook.xml"))
    relationships = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
    targets = {relationship.get("Id"): relationship.get("Target") for relationship in relationships}
    for sheet in workbook.find(MAIN + "sheets"):
        target = targets[sheet.get(RELATIONSHIP)].lstrip("/")
        yield sheet.get("name"), target if target.startswith("xl/") else "xl/" + target


def cell_text(cell, strings):
    value = cell.find(MAIN + "v")
    formula = cell.find(MAIN + "f")
    cell_type = cell.get("t")
    if cell_type == "s" and value is not None:
        text = strings[int(value.text)]
    elif cell_type == "inlineStr":
        text = "".join(part.text or "" for part in cell.iter(MAIN + "t"))
    else:
        text = value.text if value is not None and value.text is not None else ""
    if formula is not None and formula.text:
        text = f"{text} [={formula.text}]"
    return text


def dump_sheet(archive, path, strings, show_validations):
    root = ET.fromstring(archive.read(path))
    for row in root.iter(MAIN + "row"):
        cells = [f"{cell.get('r')}={cell_text(cell, strings)}" for cell in row.findall(MAIN + "c")]
        non_empty = [cell for cell in cells if not cell.endswith("=")]
        if non_empty:
            print(" | ".join(non_empty))
    if show_validations:
        for validation in root.iter(MAIN + "dataValidation"):
            allowed = validation.find(MAIN + "formula1")
            print(f"validation {validation.get('sqref')}: {allowed.text if allowed is not None else '?'}")


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("xlsx", help="path to the .xlsx file")
    parser.add_argument("--sheet", help="print only the sheet with this name")
    parser.add_argument("--validations", action="store_true", help="also print data validations (allowed values)")
    arguments = parser.parse_args()
    with zipfile.ZipFile(arguments.xlsx) as archive:
        strings = shared_strings(archive)
        sheets = [(name, path) for name, path in sheet_paths(archive) if arguments.sheet in (None, name)]
        if not sheets:
            sys.exit(f"Sheet {arguments.sheet!r} not found.")
        for name, path in sheets:
            print(f"=== {name}")
            dump_sheet(archive, path, strings, arguments.validations)


if __name__ == "__main__":
    main()
