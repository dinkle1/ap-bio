```markdown
# ap-bio Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `ap-bio` JavaScript repository. It covers file organization, import/export styles, commit message habits, and testing patterns. Use this guide to ensure consistency and efficiency when contributing to or maintaining the codebase.

## Coding Conventions

### File Naming
- Use **kebab-case** for all file names.
  - Example:  
    ```
    cell-division.js
    dna-replication.test.js
    ```

### Import Style
- Use **relative imports** for modules within the project.
  - Example:
    ```javascript
    import { calculateMitosis } from './cell-division.js';
    ```

### Export Style
- Use **named exports** for functions, constants, or classes.
  - Example:
    ```javascript
    // In cell-division.js
    export function calculateMitosis() { ... }
    export const MITOSIS_PHASES = [...];
    ```

### Commit Messages
- Freeform style, no strict prefixes.
- Average message length: ~71 characters.
  - Example:
    ```
    Add helper for chromosome pairing in meiosis
    ```

## Workflows

### Adding a New Feature
**Trigger:** When implementing a new functionality.
**Command:** `/add-feature`

1. Create a new file using kebab-case (e.g., `gene-expression.js`).
2. Write your feature using named exports.
3. Import dependencies using relative paths.
4. Add or update relevant test files (e.g., `gene-expression.test.js`).
5. Commit with a clear, descriptive message.
6. Push your changes and open a pull request.

### Writing and Running Tests
**Trigger:** When adding or updating code that requires verification.
**Command:** `/run-tests`

1. Create or update test files matching the `*.test.*` pattern.
2. Write tests for all new or modified functions.
3. Run your test suite using the project's test runner (framework unknown—refer to project docs or package.json).
4. Ensure all tests pass before committing.

### Refactoring Code
**Trigger:** When improving or restructuring existing code.
**Command:** `/refactor`

1. Identify files to refactor and ensure file names follow kebab-case.
2. Update import/export statements to maintain relative and named conventions.
3. Update or add tests if necessary.
4. Commit changes with a descriptive message.
5. Run all tests to confirm nothing is broken.

## Testing Patterns

- Test files are named using the `*.test.*` pattern (e.g., `photosynthesis.test.js`).
- The specific testing framework is unknown; check the project documentation or configuration files for details.
- Place tests alongside or near the code they verify.
- Example test file structure:
  ```javascript
  // photosynthesis.test.js
  import { calculatePhotosynthesis } from './photosynthesis.js';

  describe('calculatePhotosynthesis', () => {
    it('returns correct value for standard input', () => {
      // test logic here
    });
  });
  ```

## Commands
| Command        | Purpose                                   |
|----------------|-------------------------------------------|
| /add-feature   | Start the process for adding a new feature|
| /run-tests     | Run or write tests for your code          |
| /refactor      | Refactor existing code                    |
```
