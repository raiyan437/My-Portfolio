# GEMINI GIT - Repository Version Control & Remote Sync Guide

## Purpose
This document specifies the Git version control configuration, remote synchronization rules, branch management workflow, and push/pull procedures for **Raiyan Uddin's Portfolio** project.

## Last Updated
2026-07-21

## Current Status
- **Repository Initialized**: Local Git repository connected to GitHub.
- **Remote Target**: `https://github.com/raiyan437/My-Portfolio.git`
- **Default Branch**: `main` (or `master`)
- **Ignored Paths**: `node_modules/`, `.astro/`, `dist/`, `*.log`, `.env`

## Relevant Files
- [.gitignore](file:///d:/Others/Google%20Antigravity/Demo%20portfolio/.gitignore) - Specifies files ignored from Git tracking.
- [package.json](file:///d:/Others/Google%20Antigravity/Demo%20portfolio/package.json) - Project dependencies & build scripts.
- [docs/gemini/](file:///d:/Others/Google%20Antigravity/Demo%20portfolio/docs/gemini) - Gemini documentation suite.

---

## 1. Remote Repository Setup

- **Remote Name**: `origin`
- **Repository URL**: `https://github.com/raiyan437/My-Portfolio.git`
- **HTTPS Clone URL**: `https://github.com/raiyan437/My-Portfolio.git`

---

## 2. Standard Workflow & Commands

### Check Repository Status
```powershell
git status
```

### Stage All Changes
```powershell
git add .
```

### Commit Changes
```powershell
git commit -m "Your descriptive commit message"
```

### Push to Remote Repository
```powershell
# Push to main branch
git push -u origin main
```

### Pull Latest Changes from Remote
```powershell
git pull origin main
```

---

## 3. Recommended Branching Strategy

- `main` / `master`: Production-ready branch matching the live portfolio build.
- `feature/*`: Topic branches for new components or page features before merging into main.
- `docs/*`: Branch for documentation memory updates.

---

## 4. Git Execution in Windows Environment

When running Git commands on Windows via PowerShell:
```powershell
$git = "C:\Users\raiyan\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe"
& $git status
& $git add .
& $git commit -m "Commit message"
& $git push -u origin main
```
