# Contributing to @react-oauth

Thank you for your interest in contributing to @react-oauth! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/react-oauth.git`
3. Install dependencies: `yarn install`
4. Create a branch: `git checkout -b feature/your-feature-name`

## Development Workflow

### Building

```bash
# Build all packages
yarn build

# Start development mode for all packages
yarn dev

# Start development mode for Google package only
yarn dev:google
```

### Linting & Formatting

We use Prettier for code formatting. Code is automatically formatted on commit via lint-staged.

```bash
# Check code formatting
yarn prettier:check

# Auto-fix formatting issues
yarn prettier:fix
```

### Committing Changes

We use [Commitizen](https://github.com/commitizen/cz-cli) for creating properly formatted commit messages following [Conventional Commits](https://www.conventionalcommits.org/):

```bash
yarn commit
```

This will guide you through creating a commit message interactively.

## Code Style

- We use TypeScript with strict mode enabled
- We use Prettier for code formatting (runs automatically on commit)
- Follow the existing code style in the repository
- Write meaningful commit messages using Conventional Commits
- Run `yarn prettier:fix` before committing to ensure formatting

## Adding a New OAuth Provider

1. Create a new package directory under `packages/@react-oauth/`
2. Follow the structure of `packages/@react-oauth/github/`
3. Implement the OAuth flow for your provider
4. Update the root README.md
5. Create a changeset: `yarn changeset`

## Pull Request Process

1. Run `yarn build` to ensure everything builds successfully
2. Run `yarn prettier:check` to ensure formatting is correct
3. Update documentation if needed
4. Create a changeset if this is a user-facing change: `yarn changeset`
5. Submit your pull request with a clear description

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. Use `yarn commit` for interactive commit creation.

**Format:**

```
<type>(<scope>): <subject>
```

**Types:**

- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

**Scopes:**

- `google` - `@react-oauth/google` package
- `github` - `@react-oauth/github` package
- `playground` - Playground app
- `repo` - Repository config/tooling

**Examples:**

```
feat(google): add custom button themes
fix(github): handle popup blocked error
docs(repo): update contributing guide
```

## Versioning

This project uses [Changesets](https://github.com/changesets/changesets) for version management. If your PR includes user-facing changes:

1. Create a changeset: `yarn changeset`
2. Select the affected packages
3. Choose the type of change (major, minor, patch)
4. Write a summary of the changes
5. Commit the changeset file with your changes

## Questions?

Feel free to open an issue for any questions or concerns.
