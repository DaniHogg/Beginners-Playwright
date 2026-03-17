# Playwright Testing Project

A comprehensive end-to-end testing project built with Playwright and JavaScript.

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in UI mode (interactive)
```bash
npm run test:ui
```

### Run tests in headed mode (browser visible)
```bash
npm run test:headed
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run tests for specific browser
```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### View test report
```bash
npm run report
```

## Codegen

Generate test code by recording interactions:
```bash
npm run codegen
```

## Project Structure

```
playwright-testing/
├── .github/
│   └── workflows/
│       └── tests.yml          # GitHub Actions CI/CD workflow
├── tests/
│   ├── example.spec.ts        # Example test file
│   └── fixtures/              # Shared test fixtures
├── playwright.config.ts       # Playwright configuration
├── package.json              # Project dependencies
├── tsconfig.json             # TypeScript configuration
├── README.md                 # Project documentation
└── .gitignore               # Git ignore rules
```

## Writing Tests

Tests should be placed in the `tests/` directory with `.spec.js` extension.

Example test structure:
```typescript
import { test, expect } from '@playwright/test';

test('example test', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});
```

## Configuration

Edit `playwright.config.js` to:
- Add/remove browsers
- Configure timeouts
- Set up test runs in parallel
- Configure reporters
- Add base URL for your application

## CI/CD

GitHub Actions workflow is configured in `.github/workflows/tests.yml` to automatically run tests on push and pull requests.

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Test-Runner](https://playwright.dev/docs/test-runner)

## License

MIT
