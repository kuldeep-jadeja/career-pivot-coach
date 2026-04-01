# O*NET Data Processing

This directory contains scripts and tools for downloading, parsing, and transforming O*NET occupational data.

## Directory Structure

```
data-processing/
├── raw/              # Downloaded O*NET CSV files (git-ignored)
├── scripts/          # Processing scripts
│   ├── download-onet.ts     # Download O*NET database
│   └── parse-onet.ts        # Parse CSV → JSON
└── README.md         # This file
```

## Data Pipeline

### 1. Download O*NET Data

Download the latest O*NET database release:

```bash
npm run data:download
```

This script:
- Downloads the O*NET Database ZIP file from onetcenter.org
- Extracts required CSV files to `raw/` directory
- Verifies file structure

**Manual Download:** If the script fails, manually download from:
https://www.onetcenter.org/database.html

Look for "Database (Excel)" download link (contains tab-delimited .txt files).

### 2. Parse CSV to JSON

Convert raw CSV files to versioned JSON:

```bash
npm run data:parse
```

This script:
- Reads tab-delimited files from `raw/`
- Transforms to structured JSON
- Outputs to `public/data/onet-v{VERSION}/`
- Generates manifest with metadata

### 3. (Optional) Seed Database

Populate Supabase tables for admin queries:

```bash
npm run data:seed
```

## Required Files

The pipeline expects these files in `raw/` directory:

| File | Description | Expected Rows |
|------|-------------|---------------|
| `Occupation Data.txt` | Core occupation definitions | ~1,000 |
| `Task Statements.txt` | Task descriptions by occupation | ~19,000 |
| `Skills.txt` | Skill requirements and levels | ~35,000 |
| `Work Activities.txt` | Work activity ratings | ~40,000 |

## O*NET Data Format

O*NET files are **tab-delimited** (.txt extension), not comma-separated.

Key fields:
- **O*NET-SOC Code**: Standard occupation code (e.g., "15-1252.00")
- **Title**: Occupation name
- **Element ID**: Skill/activity identifier
- **Data Value**: Numeric rating (importance, level)

## Data Versioning

Each O*NET release gets a versioned directory:

```
public/data/
├── onet-v28.3/
│   ├── occupations.json
│   ├── tasks.json
│   ├── skills.json
│   ├── work_activities.json
│   └── manifest.json
└── current/  (symlink → onet-v28.3)
```

The `current` symlink always points to the active version.

## Update Process

When O*NET releases a new version (typically Q1 annually):

1. Download new data: `npm run data:download`
2. Update VERSION constant in `parse-onet.ts`
3. Parse data: `npm run data:parse`
4. Test thoroughly with new data
5. Update `current` symlink to point to new version
6. (Optional) Seed database: `npm run data:seed`
7. Commit new versioned directory to git

## Notes

- **File Size:** O*NET JSON files total ~50-100MB
- **Git LFS:** Consider using Git LFS for version control if files exceed 10MB per file
- **Registration:** O*NET bulk downloads may require free registration
- **Rate Limits:** Be respectful when downloading; cache locally
- **Data License:** O*NET data is public domain (U.S. Department of Labor)

## Troubleshooting

**Download fails:**
- Check internet connection
- Verify O*NET website is accessible
- Try manual download from onetcenter.org

**Parse errors:**
- Ensure files are in `raw/` directory
- Check file encoding (should be UTF-8)
- Verify tab-delimited format (not comma-separated)

**Missing records:**
- Compare counts to manifest expectations
- Check for parsing errors in console output
- Verify O*NET version matches expected release

## References

- **O*NET Database:** https://www.onetcenter.org/database.html
- **O*NET Data Dictionary:** https://www.onetcenter.org/dictionary/28.3/
- **O*NET SOC Codes:** https://www.onetcenter.org/taxonomy.html
