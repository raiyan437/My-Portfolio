# GEMINI Project Handoff

## Purpose
This document serves as the project handoff guide for subsequent AI agents (Gemini, Claude Code, CODEX, Copilot) or human developers taking over maintenance of the **Demo Portfolio** codebase.

## Last Updated
2026-07-21

## Current Status
- Production Ready / Static Deployment Ready.

## Relevant Files
- [index.html](file:///d:/Others/Google%20Antigravity/Demo%20portfolio/index.html) - Main entrance dashboard.
- [about.html](file:///d:/Others/Google%20Antigravity/Demo%20portfolio/about.html) - Profile and timeline page.
- [works.html](file:///d:/Others/Google%20Antigravity/Demo%20portfolio/works.html) - Portfolio showcase.
- [Works/](file:///d:/Others/Google%20Antigravity/Demo%20portfolio/Works) - 8 Project detail HTML pages.
- [contact.html](file:///d:/Others/Google%20Antigravity/Demo%20portfolio/contact.html) - Contact page.
- [style.css](file:///d:/Others/Google%20Antigravity/Demo%20portfolio/style.css) - Core design system.
- [main.js](file:///d:/Others/Google%20Antigravity/Demo%20portfolio/main.js) - Interactive logic.
- [assets/](file:///d:/Others/Google%20Antigravity/Demo%20portfolio/assets) - Local image assets & CSS/JS vendor libraries.

## Decisions
- Maintain pure static structure (no Node.js runtime required to serve or build).
- Keep all documentation inside `/docs/gemini/` using the `GEMINI_` prefix.
- Never overwrite documentation created by other AI agents.
- **Mandatory Browser Execution**: Always use Google Chrome (`C:\Program Files\Google\Chrome\Application\chrome.exe`) for opening pages, manual verification, and automated browser tasks.

## Verification & Local Testing
To view and test the project in Google Chrome:
```powershell
Start-Process "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "file:///d:/Others/Google%20Antigravity/Demo%20portfolio/index.html"
```

## Agent Co-Existence Rules
If operating alongside other AI agents:
- **Prefix Rule**: Always use `GEMINI_` prefix for new documentation created by Gemini.
- **Location Rule**: Store all Gemini documentation in `/docs/gemini/`.
- **Non-Destructive Rule**: Do not delete, overwrite, or rename documentation belonging to other agents (e.g. `CLAUDE_`, `COPILOT_`).
- **Browser Executable Rule**: Do not rely on system default browser handlers; explicitly target Google Chrome executable at `C:\Program Files\Google\Chrome\Application\chrome.exe`.

## Outstanding Work
- Optional integration of automated Playwright test suite.
