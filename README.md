# @mastermunj/oxc-config

Shared Oxlint and Oxfmt configuration for TypeScript packages.

## What this package provides

- Shareable `oxlint` base config
- Shareable `oxfmt` base config
- A simple starting point that teams can customize per package

## Install

```sh
npm install --save-dev @mastermunj/oxc-config oxlint oxfmt oxlint-tsgolint@latest
```

## Usage

### 1) Oxlint config

Create `.oxlintrc.json` in your project root:

```json
{
  "extends": ["./node_modules/@mastermunj/oxc-config/.oxlintrc.json"]
}
```

### 2) Customize lint rules on top

Yes, you can both override existing rules and add new rules.

Example:

```json
{
  "extends": ["./node_modules/@mastermunj/oxc-config/.oxlintrc.json"],
  "rules": {
    "typescript/no-explicit-any": "warn",
    "no-console": "error"
  },
  "overrides": [
    {
      "files": ["scripts/**/*.ts"],
      "rules": {
        "eslint/no-console": "off"
      }
    }
  ]
}
```

### 3) Oxfmt config

Use the shared formatter config via `--config`:

```sh
oxfmt --check --config ./node_modules/@mastermunj/oxc-config/.oxfmtrc.json .
oxfmt --write --config ./node_modules/@mastermunj/oxc-config/.oxfmtrc.json .
```

### 4) Scripts

```json
{
  "scripts": {
    "lint": "oxlint --type-aware .",
    "lint:fix": "npm run lint -- --fix",
    "format": "oxfmt --check --config ./node_modules/@mastermunj/oxc-config/.oxfmtrc.json .",
    "format:fix": "oxfmt --write --config ./node_modules/@mastermunj/oxc-config/.oxfmtrc.json ."
  }
}
```

### 5) Customize formatter settings

`oxfmt` does not currently support deep config inheritance like lint `extends` in the same way.

Recommended approach:

- Start from the shared config file
- Copy into your package as `.oxfmtrc.json`
- Adjust only settings you want to change

## Package Exports

- `@mastermunj/oxc-config/oxlint`
- `@mastermunj/oxc-config/oxfmt`

## License

MIT
