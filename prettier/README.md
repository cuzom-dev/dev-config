# @cuzom/prettier-config

Cuzom Oy's Prettier settings: no semicolons, single quotes, trailing commas where ES5 allows them,
width 100, and Markdown wrapped at 100.

```bash
pnpm add -D prettier @cuzom/prettier-config
```

`package.json`:

```json
"prettier": "@cuzom/prettier-config"
```

To change one setting, import and spread it instead:

```js
// prettier.config.js
import cuzom from '@cuzom/prettier-config' with { type: 'json' }

export default { ...cuzom, printWidth: 120 }
```

© Cuzom Oy. Apache-2.0. Source: [cuzom-dev/dev-config](https://github.com/cuzom-dev/dev-config).
