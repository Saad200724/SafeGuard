# Project Dependencies

This file lists all the dependencies needed for running the SafeGuard Parent Dashboard application locally in VS Code.

## Core Dependencies

```bash
npm install react react-dom @supabase/supabase-js @tanstack/react-query react-hook-form @hookform/resolvers zod drizzle-orm drizzle-zod express pg wouter lucide-react date-fns recharts 
```

## UI and Component Libraries

```bash
npm install class-variance-authority clsx tailwind-merge tailwindcss-animate cmdk embla-carousel-react input-otp next-themes react-day-picker react-resizable-panels vaul
```

## Radix UI Components

```bash
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip
```

## Backend and Database

```bash
npm install express express-session passport passport-local memorystore connect-pg-simple pg ws
```

## Development Dependencies

```bash
npm install --save-dev typescript @types/react @types/react-dom @types/node @types/express @types/express-session @types/passport @types/passport-local @types/connect-pg-simple @types/ws @vitejs/plugin-react esbuild tsx autoprefixer postcss tailwindcss drizzle-kit cross-env
```

## Note on Dependency Versions

If you encounter version compatibility issues, please refer to the `package.json` file in the repository for the exact versions used in the project.

## Cross-Platform Compatibility

To ensure scripts work across different operating systems (Windows, macOS, Linux), install cross-env:

```bash
npm install --save-dev cross-env
```

And update your scripts in package.json to use it for environment variables:

```json
"scripts": {
  "dev": "cross-env NODE_ENV=development tsx server/index.ts",
  "start": "cross-env NODE_ENV=production node dist/index.js",
  // other scripts...
}
```