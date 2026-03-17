# Playwright Project Guidelines

## Project Overview
This is a Playwright end-to-end testing project with TypeScript support, configured for multiple browsers and GitHub Actions CI/CD.

## Best Practices

### Test Organization
- Place tests in the `tests/` directory with `.spec.ts` extension
- Use descriptive test names that explain what is being tested
- Group related tests using `test.describe()`
- Keep tests focused and independent

### Test Structure
- Use page object models for complex applications
- Leverage fixtures for setup/teardown
- Follow AAA pattern: Arrange, Act, Assert
- Use data factories for test data generation

### Selectors
- Prefer stable selectors (data-testid, role, text)
- Avoid brittle selectors (xy coordinates, pseudo-selectors)
- Use getByRole, getByLabel, getByText when possible
- Consider accessibility when writing selectors

### Assertions
- Use specific assertions (exact values over partial matches)
- Check for visibility before interaction
- Verify both positive and negative scenarios
- Use soft assertions for non-critical checks

### Debugging
- Use `--debug` flag for step-through debugging
- Enable `--ui` mode for interactive test execution
- Check test reports in html report
- Use trace viewer for detailed debugging

## GitHub Actions
- Tests run automatically on push and pull requests
- Configured for serial execution on CI to avoid flakiness
- HTML reports are generated on test completion
- Browser cache is disabled on CI

## Common Scripts
- `npm install` - Install dependencies
- `npm test` - Run all tests
- `npm run test:ui` - Run in interactive UI mode
- `npm run test:debug` - Debug tests with inspector
- `npm run report` - View HTML test report

## Dependencies
- `@playwright/test` - Testing framework
- `typescript` - TypeScript support
- `@types/node` - Node.js type definitions

## Resources
- Playwright Docs: https://playwright.dev/
- API Reference: https://playwright.dev/docs/api/class-playwr right
- Best Practices: https://playwright.dev/docs/best-practices
