# GEMINI Run Commands - Execution & Development Guide

## Purpose

This document provides all the necessary terminal commands to navigate to, install, run, build, and preview the **Demo Portfolio** project.

## Last Updated

2026-07-21

---

## 1. Directory Change Commands

### PowerShell

```powershell
cd "d:\Others\Google Antigravity\Demo portfolio"
```

### Command Prompt (CMD)

```cmd
cd /d "d:\Others\Google Antigravity\Demo portfolio"
```

### Git Bash / Linux / Mac

```bash
cd "d:/Others/Google Antigravity/Demo portfolio"
```

---

## 2. Installation Commands

If dependencies are not installed or need updating:

```bash
npm install
```

---

## 3. Development Server (Run Project)

To launch the local development server with hot-reloading (default URL: `http://localhost:4321`):

```bash
npm run dev
```

_Alternative command:_

```bash
npm start
```

_Direct Astro CLI:_

```bash
npx astro dev
```

---

## 4. Production Build & Preview

### Build Production Artifacts

Compiles the site into static assets inside the `dist/` directory:

```bash
npm run build
```

### Preview Production Build

Serves the static production build locally for verification:

```bash
npm run preview
```

---

## 5. One-Liner Execution Commands

### Change Directory and Start Dev Server

#### PowerShell

```powershell
cd "d:\Others\Google Antigravity\Demo portfolio"; cmd /c "npm run dev"
```

> [!TIP]
> If PowerShell blocks `npm` due to execution policy, use `cmd /c "npm run dev"` or `npm.cmd run dev`.

#### Command Prompt (CMD)

```cmd
cd /d "d:\Others\Google Antigravity\Demo portfolio" && npm run dev
```

#### Git Bash

```bash
cd "d:/Others/Google Antigravity/Demo portfolio" && npm run dev
```

