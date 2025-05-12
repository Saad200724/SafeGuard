# Recommended VS Code Extensions

These extensions will enhance your development experience when working with the SafeGuard Parent Dashboard project in VS Code.

## Essential Extensions

### 1. ESLint
**ID**: dbaeumer.vscode-eslint

Provides JavaScript/TypeScript linting to catch and fix problems in your code.

### 2. Prettier - Code formatter
**ID**: esbenp.prettier-vscode

Ensures consistent code formatting across your project.

### 3. Tailwind CSS IntelliSense
**ID**: bradlc.vscode-tailwindcss

Offers autocompletion, syntax highlighting, and linting for Tailwind CSS classes.

### 4. TypeScript React code snippets
**ID**: infeng.vscode-react-typescript

Provides snippets for React with TypeScript integration.

### 5. ES7+ React/Redux/React-Native snippets
**ID**: dsznajder.es7-react-js-snippets

Offers useful snippets for React development.

## Additional Helpful Extensions

### 6. Path Intellisense
**ID**: christian-kohler.path-intellisense

Helps autocomplete filenames in import statements.

### 7. Auto Rename Tag
**ID**: formulahendry.auto-rename-tag

Automatically renames paired HTML/JSX tags.

### 8. Import Cost
**ID**: wix.vscode-import-cost

Displays the size of imported packages inline.

### 9. GitLens
**ID**: eamodio.gitlens

Enhances Git capabilities within VS Code.

### 10. REST Client
**ID**: humao.rest-client

Allows you to test API endpoints directly within VS Code.

## Setting Up

### Quick Installation

You can install all essential extensions at once by running these commands in your terminal:

```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension infeng.vscode-react-typescript
code --install-extension dsznajder.es7-react-js-snippets
```

### Manual Installation

1. Open VS Code
2. Go to Extensions view (Ctrl+Shift+X or Cmd+Shift+X on macOS)
3. Search for each extension by name or ID
4. Click Install

## Recommended Settings

Add these settings to your VS Code `settings.json` file for better development experience with this project:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescript][typescriptreact][javascript][javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "tailwindCSS.emmetCompletions": true,
  "editor.quickSuggestions": {
    "strings": true
  }
}
```

## Setting Up Project-Specific Settings

You can also create a `.vscode` folder in your project with a `settings.json` file containing these settings to ensure all team members use consistent settings for this project.