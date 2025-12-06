# Research Gennie Frontend - Setup Documentation

## Project Foundation

This project is built with:
- **Vite** - Fast build tool and dev server
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first CSS framework with dark mode support
- **shadcn/ui** - Accessible component library
- **Zustand** - State management
- **Axios** - HTTP client
- **React Router v7** - Client-side routing
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing utilities
- **fast-check** - Property-based testing library

## Configuration Files

### Environment Variables
- `.env` - Local environment configuration
- `.env.example` - Template for environment variables

Required environment variables:
```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_VERSION=1.0.0
```

### TypeScript Configuration
- `tsconfig.json` - Root TypeScript configuration
- `tsconfig.app.json` - Application TypeScript configuration with path aliases
- `tsconfig.node.json` - Node.js TypeScript configuration

Path aliases configured:
- `@/*` maps to `./src/*`

### Vite Configuration
- `vite.config.ts` - Vite build configuration with React plugin, Tailwind CSS, and path aliases

### Vitest Configuration
- `vitest.config.ts` - Test runner configuration
- `src/test/setup.ts` - Test setup file with jest-dom matchers

### shadcn/ui Configuration
- `components.json` - shadcn/ui component configuration
- `src/lib/utils.ts` - Utility functions for class name merging

## Tailwind CSS Dark Mode

Dark mode is configured using the `class` strategy. The application defaults to dark mode.

To toggle dark mode, add/remove the `dark` class on the root HTML element:
```typescript
document.documentElement.classList.toggle('dark');
```

CSS variables are defined in `src/index.css` for both light and dark themes.

## Testing

### Running Tests
```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui
```

### Test Structure
- Unit tests: `*.test.ts` or `*.test.tsx`
- Property-based tests: `*.property.test.ts`

### Property-Based Testing
Property-based tests use `fast-check` and should run a minimum of 100 iterations:
```typescript
fc.assert(
  fc.property(
    fc.string(),
    (input) => {
      // Test logic
      return true;
    }
  ),
  { numRuns: 100 }
);
```

## Development

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components
│   ├── research/       # Research-specific components
│   └── common/         # Common components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API service layer
├── store/              # Zustand stores
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── routes/             # Route configuration
├── layouts/            # Layout wrappers
├── lib/                # Library utilities
├── test/               # Test setup and utilities
├── App.tsx             # Root component
└── main.tsx            # Entry point
```

## Next Steps

1. Create core type definitions (Task 2)
2. Set up Zustand stores (Task 3)
3. Build layout components (Task 4)
4. Implement pages and features

## Verification

To verify the setup is complete:
1. ✅ Tests pass: `npm run test:run`
2. ✅ Build succeeds: `npm run build`
3. ✅ Dev server starts: `npm run dev`
