# @cuzom/tsconfig

Cuzom Oy's base TypeScript settings: strict, ES2023, bundler resolution, isolated modules.

```bash
pnpm add -D @cuzom/tsconfig
```

`tsconfig.json`:

```json
{
  "extends": "@cuzom/tsconfig/base.json",
  "compilerOptions": { "lib": ["ES2023", "DOM", "DOM.Iterable"], "noEmit": true },
  "include": ["src"]
}
```

The base sets no `lib`, `noEmit`, `outDir` or `include`: each project says what it builds and where
it runs. `noUncheckedIndexedAccess` is off on purpose, to keep everyday code free of non-null
assertions.

© Cuzom Oy. Apache-2.0. Source: [cuzom-dev/dev-config](https://github.com/cuzom-dev/dev-config).
