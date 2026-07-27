import { type UserConfig } from 'tsdown';

const config: UserConfig = {
  entry: ['oxlint.config.ts', 'oxfmt.config.ts'],
  format: 'esm',
  outExtensions: () => ({ js: '.js', dts: '.d.ts' }),
  deps: { neverBundle: ['oxlint', 'oxfmt'] },
  dts: true,
  clean: true,
};

export default config;
