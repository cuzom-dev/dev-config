# @cuzom/eslint-config

Cuzom Oy's ESLint flat config: the recommended JavaScript and TypeScript rules, light typing, and
formatting left to Prettier.

```bash
pnpm add -D eslint typescript @cuzom/eslint-config
```

`eslint.config.js`:

```js
import cuzom from '@cuzom/eslint-config'

export default [
  ...cuzom,
  // project rules and ignores
]
```

**Light typing.** Inference over annotations, no enums (a union of string literals instead), `any`
warns, `@ts-expect-error` needs a reason, and type-only imports are marked. Everything Prettier
handles is turned off through `eslint-config-prettier`.

**Vue and Nuxt.** Use Nuxt's own config and add the light-typing rules and Prettier last:

```js
// @ts-check
import { lightTypes } from '@cuzom/eslint-config'
import prettierConfig from 'eslint-config-prettier'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(lightTypes, prettierConfig)
```

Also exported: `ignores` (build output and tool folders).

Needs ESLint 10 and TypeScript 6; typescript-eslint does not support TypeScript 7 yet.

© Cuzom Oy. Apache-2.0. Source: [cuzom-dev/dev-config](https://github.com/cuzom-dev/dev-config).
