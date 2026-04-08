# Grafana Monitoring App Demo

This repository contains a Playwright-based end-to-end (E2E) testing framework for the Grafana Monitoring App.

## Project Structure

```
├── page_objects/          # Page Object Model classes
│   ├── base.page.ts       # Base class for common page methods
│   ├── synthetics.home.page.ts  # Page object for the Synthetics Home page
│   ├── synthetics.checks.page.ts # Page object for the Synthetics Checks page
├── fixtures/              # Playwright fixtures for shared setup
│   ├── pages.fixture.ts   # Fixture for initializing page objects
├── helpers/               # Helper functions for tests
│   ├── home.page.helpers.ts # Helper for region filtering logic
├── tests/                 # Test specifications
│   ├── specs/             # Playwright test files
│   │   ├── synthetics.home.spec.ts # Tests for the Synthetics Home page
├── playwright.config.ts   # Playwright configuration file
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

## Features

- **Page Object Model (POM):**
  - Encapsulates page-specific logic in reusable classes.
  - Includes `SyntheticsHomePage` and `SyntheticsChecksPage`.

- **Fixtures:**
  - Shared setup for initializing pages (`homePage`, `checksPage`).
  - Defined in `tests/fixtures/pages.fixture.ts`.

- **TypeScript Support:**
  - Strongly typed tests and page objects.
  - Ensures better developer experience with autocompletion and type checking.

## Setup

### Prerequisites

- Node.js (v22 or later)
- Playwright browsers

### Installation

1. Clone the repository:

2. Install dependencies:

   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Running Tests

### Run All Tests

```bash
npx playwright test
```

### Run Tests in UI mode

```bash
npx playwright test --ui
```

### Run Specific Tests

```bash
npx playwright test --grep "@smoke"
```

### Run Smoke Tests

```bash
npx playwright test --grep "@smoke"
```

This command will execute only the tests tagged with `@smoke`. Use this to quickly verify critical functionalities.
