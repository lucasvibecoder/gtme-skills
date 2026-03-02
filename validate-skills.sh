#!/usr/bin/env bash
set -euo pipefail

ERRORS=0
SKILLS_DIR="skills"

for skill_dir in "$SKILLS_DIR"/*/; do
    skill_name=$(basename "$skill_dir")
    skill_file="$skill_dir/SKILL.md"

    echo "Validating: $skill_name"

    # Check SKILL.md exists
    if [[ ! -f "$skill_file" ]]; then
        echo "  ERROR: $skill_file not found"
        ERRORS=$((ERRORS + 1))
        continue
    fi

    # Check name format (lowercase kebab-case)
    if [[ ! "$skill_name" =~ ^[a-z][a-z0-9-]*$ ]]; then
        echo "  ERROR: Name '$skill_name' is not lowercase kebab-case"
        ERRORS=$((ERRORS + 1))
    fi

    # Extract frontmatter name
    fm_name=$(sed -n '/^---$/,/^---$/p' "$skill_file" | grep '^name:' | head -1 | sed 's/name: *//;s/"//g;s/'"'"'//g' | tr -d '[:space:]')

    # Check name matches directory
    if [[ "$fm_name" != "$skill_name" ]]; then
        echo "  ERROR: Frontmatter name '$fm_name' doesn't match directory '$skill_name'"
        ERRORS=$((ERRORS + 1))
    fi

    # Check description exists and length
    desc=$(sed -n '/^---$/,/^---$/p' "$skill_file" | grep '^description:' | head -1 | sed 's/description: *//;s/^"//;s/"$//')
    if [[ -z "$desc" ]]; then
        echo "  ERROR: No description in frontmatter"
        ERRORS=$((ERRORS + 1))
    elif [[ ${#desc} -gt 200 ]]; then
        echo "  WARN: Description is ${#desc} chars (recommend under 200)"
    fi

    # Check for trigger phrases section
    if ! grep -qi "trigger\|when to use" "$skill_file"; then
        echo "  WARN: No trigger phrases section found"
    fi

    # Check line count
    lines=$(wc -l < "$skill_file" | tr -d ' ')
    if [[ "$lines" -gt 500 ]]; then
        echo "  WARN: $skill_file is $lines lines (recommend under 500)"
    fi

    echo "  OK ($lines lines)"
done

echo ""
if [[ $ERRORS -gt 0 ]]; then
    echo "FAILED: $ERRORS error(s) found"
    exit 1
else
    echo "ALL SKILLS VALID"
fi
