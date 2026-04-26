# CineMatch Frontend

## API Configuration

This app supports two API base URL modes:

- Development (recommended):
  the frontend calls `/api/*`, and Vite proxies requests to the backend.
- Production/non-dev:
  the frontend calls `http://<current-hostname>:8080` by default.
- Optional override via environment variable:
  set `VITE_API_BASE_URL` in a `.env` file for non-dev mode.

The Vite proxy target can be configured with `VITE_PROXY_TARGET` (defaults to `http://localhost:8080`).

Example:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_PROXY_TARGET=http://localhost:8080
```

An `.env.example` file is included as a template.

## Access From Phone Or Internet

Use this if you want other people to open your running app from a phone or public link.

1. Start your backend on port 8080.
2. Start frontend in fixed host mode:

```bash
npm run dev:host
```

3. For same Wi-Fi devices, share the Vite Network URL.
4. For internet sharing, open a public tunnel:

```bash
npm run tunnel
```

The tunnel command returns a public URL you can share.

Notes:
- Keep both terminal commands running while people use the app.
- API requests are proxied through the frontend server (`/api`), so browser CORS is avoided in dev.
- If backend is on another host, set `VITE_PROXY_TARGET` in `.env` and restart dev server.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
