# @mastermunj/oxc-config

Shared Oxlint and Oxfmt configuration for TypeScript packages.

## What this package provides

- Shareable `oxlint` base config with type-aware linting (tsgolint)
- Shareable `oxfmt` base config
- TypeScript-first: fully typed, composable via `extends` / spread

## Install

```sh
npm install --save-dev @mastermunj/oxc-config oxlint oxfmt oxlint-tsgolint
```

## Usage

### 1) Oxlint config

Create `oxlint.config.ts` in your project root:

```ts
import { defineConfig } from 'oxlint';
import baseConfig from '@mastermunj/oxc-config/oxlint';

export default defineConfig({
  extends: [baseConfig],
});
```

### 2) Customize lint rules on top

Pass additional rules or overrides after `extends`:

```ts
import { defineConfig } from 'oxlint';
import baseConfig from '@mastermunj/oxc-config/oxlint';

export default defineConfig({
  extends: [baseConfig],
  rules: {
    'no-console': 'error',
  },
  overrides: [
    {
      files: ['scripts/**/*.ts'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
});
```

### 3) Oxfmt config

Create `oxfmt.config.ts` in your project root:

```ts
import { defineConfig } from 'oxfmt';
import baseConfig from '@mastermunj/oxc-config/oxfmt';

export default defineConfig({
  ...baseConfig,
});
```

### 4) Customize formatter settings

Spread the base config and override only what you need:

```ts
import { defineConfig } from 'oxfmt';
import baseConfig from '@mastermunj/oxc-config/oxfmt';

export default defineConfig({
  ...baseConfig,
  printWidth: 100,
});
```

### 5) Scripts

Both tools auto-discover `oxlint.config.ts` and `oxfmt.config.ts` in the project root — no `--config` flag needed.

```json
{
  "scripts": {
    "lint": "oxlint .",
    "lint:fix": "oxlint --fix .",
    "format": "oxfmt --check .",
    "format:fix": "oxfmt --write ."
  }
}
```

> **Type-aware linting** is enabled automatically via `options.typeAware: true` in the base config (powered by tsgolint). No `--type-aware` CLI flag needed.

## Package Exports

- `@mastermunj/oxc-config/oxlint` → `oxlint.config.js` (ESM, compiled from `oxlint.config.ts`)
- `@mastermunj/oxc-config/oxfmt` → `oxfmt.config.js` (ESM, compiled from `oxfmt.config.ts`)

## License

MIT
