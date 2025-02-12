# Contributing to Plant Hub

Welcome to the Plant Hub project! This guide will help you understand how to contribute to the project, manage branches, and maintain code quality. This document is specifically tailored for Windows developers.

## Table of Contents
- [Getting Started](#getting-started)
- [Repository Structure](#repository-structure)
- [Branch Strategy](#branch-strategy)
- [Development Workflow](#development-workflow)
- [Backup Procedures](#backup-procedures)
- [Code Review Process](#code-review-process)
- [Deployment](#deployment)

## Getting Started

### Prerequisites
- Git for Windows
- A code editor (VS Code recommended)
- Node.js and npm (if applicable)
- Live Server extension for local testing

### Initial Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/www-e/planthub.git
   cd planthub
   ```

2. Set up your Git identity:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

## Repository Structure
```
planthub/
├── frontend/
│   ├── pages/         # HTML pages
│   ├── scripts/       # JavaScript files
│   └── styles/        # CSS files
├── config.js          # Configuration file
└── index.html         # Entry point
```

## Branch Strategy

### Main Branches
- `main` - Production-ready code
- `develop` - Integration branch for features
- `staging` - Pre-production testing

### Feature Development
1. Create a new feature branch:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. Work on your feature:
   ```bash
   git add .
   git commit -m "feat: describe your changes"
   git push origin feature/your-feature-name
   ```

3. Create a Pull Request to `develop`

### Hotfix Process
1. Create a hotfix branch:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/issue-description
   ```

2. Fix the issue:
   ```bash
   git add .
   git commit -m "fix: describe the hotfix"
   git push origin hotfix/issue-description
   ```

3. Create Pull Requests to both `main` and `develop`

## Development Workflow

### Daily Development
1. Start your day by pulling latest changes:
   ```bash
   git checkout develop
   git pull origin develop
   ```

2. Create/switch to your feature branch:
   ```bash
   git checkout feature/your-feature
   git pull origin feature/your-feature
   ```

3. Regular commits:
   ```bash
   git add .
   git commit -m "type: description"
   git push origin feature/your-feature
   ```

### Commit Message Format
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance

## Backup Procedures

### Local Backup
1. Create a backup branch:
   ```bash
   git checkout -b backup/YYYY-MM-DD
   git push origin backup/YYYY-MM-DD
   ```

2. Tag important versions:
   ```bash
   git tag -a v1.0.0 -m "Version 1.0.0"
   git push origin v1.0.0
   ```

### Repository Backup
1. Create a full clone:
   ```bash
   git clone --mirror https://github.com/www-e/planthub.git
   ```

2. Regular backup schedule:
   - Daily: Local commits
   - Weekly: Push to backup branches
   - Monthly: Full repository backup

## Code Review Process

### Submitting Code for Review
1. Push your changes:
   ```bash
   git push origin feature/your-feature
   ```

2. Create a Pull Request on GitHub:
   - Base: develop
   - Compare: feature/your-feature
   - Add description and screenshots
   - Link related issues

### Review Guidelines
- Code follows project style
- All tests pass
- No conflicts with develop branch
- Documentation updated
- Responsive design maintained

## Deployment

### Staging Deployment
1. Merge to staging:
   ```bash
   git checkout staging
   git pull origin staging
   git merge develop
   git push origin staging
   ```

### Production Deployment
1. Create a release branch:
   ```bash
   git checkout -b release/v1.0.0
   ```

2. Merge to main:
   ```bash
   git checkout main
   git pull origin main
   git merge release/v1.0.0
   git tag -a v1.0.0 -m "Version 1.0.0"
   git push origin main --tags
   ```

### GitHub Pages Deployment
The site is automatically deployed to GitHub Pages when changes are pushed to the main branch. The live site can be accessed at: https://www-e.github.io/planthub/

## Need Help?
- Create an issue on GitHub
- Contact the team lead
- Check the documentation
