# GEMINI Git & Branching Strategy

## Purpose
Git branching strategy, commit conventions, and repository workflow.

## Last Updated
2026-07-21

---

## 🌿 Branching Model

- **Repository**: `https://github.com/raiyan437/My-Portfolio.git`
- **Main Branch**: `main` (Production deployment branch for GitHub Pages).
- **GitHub Pages Settings**: Source set to `main` branch / root directory or GitHub Actions workflow.

---

## 📝 Commit Message Convention

Format: `<type>(<scope>): <short description>`

### Types
- `feat`: New feature or page (e.g. `feat(skills): add 4x infinite skills marquee`).
- `fix`: Bug fix (e.g. `fix(marquee): resolve CSS syntax error in style.css`).
- `docs`: Documentation update (e.g. `docs(readme): update README.md and gemini docs`).
- `style`: UI styling or CSS token changes.
- `refactor`: Code restructuring without changing functionality.

---

## 🚀 Deployment Workflow

```bash
# Stage all modified and new files
git add .

# Create production commit
git commit -m "docs: finalize project documentation and gemini docs suite"

# Push updates to main
git push origin main
```
