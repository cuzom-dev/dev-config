# dev-config

Cuzom Oy's shared ESLint, Prettier and TypeScript settings, published so they can be reused.

| Package                  | What it is                                                                                          |
| ------------------------ | --------------------------------------------------------------------------------------------------- |
| `@cuzom/eslint-config`   | flat config: recommended JavaScript and TypeScript rules, light typing, formatting left to Prettier |
| `@cuzom/prettier-config` | no semicolons, single quotes, width 100, Markdown wrapped at 100                                    |
| `@cuzom/tsconfig`        | strict, modern target, bundler resolution                                                           |

The packages are on npm, and they are plain JSON and JavaScript with no build step, so they can also
be installed straight from this repository with a tag.

## Prettier

```bash
pnpm add -D prettier @cuzom/prettier-config
```

`package.json`:

```json
"prettier": "@cuzom/prettier-config"
```

## ESLint

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

Besides the recommended rules it keeps typing light: inference over annotations, no enums (a union
of string literals instead), `any` warns, and `@ts-expect-error` needs a reason. Everything Prettier
handles is turned off.

**Vue and Nuxt.** Nuxt projects use Nuxt's own config and add the light-typing rules and Prettier
last:

```js
// @ts-check
import { lightTypes } from '@cuzom/eslint-config'
import prettierConfig from 'eslint-config-prettier'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(lightTypes, prettierConfig)
```

TypeScript 6 for now: typescript-eslint does not support TypeScript 7 yet.

## TypeScript

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

## Versions

All three packages share one version and follow semantic versioning:

- **patch** for fixes that change nothing for a project;
- **minor** for new settings or rules that a project can adopt without touching its code;
- **major** when a project must change its own code, for example a rule that starts failing or a
  stricter compiler option.

Each release is also a git tag `vX.Y.Z`. The current version is the one npm shows.

Without npm, install from a tag (never from `main`):

```bash
pnpm add -D "@cuzom/eslint-config@github:cuzom-dev/dev-config#<tag>&path:/eslint"
```

## Releasing

Releases are driven by the Conventional Commits that land on `main`; all three packages share one
version.

1. Merge your work as usual. [release-please](https://github.com/googleapis/release-please) keeps
   **one release pull request** open and updates it as commits land: it bumps the version in every
   package and writes `CHANGELOG.md`. Nothing is released while it sits there.
2. **Merge that pull request when you want to release.** It creates the tag and the GitHub release,
   and the same workflow run then stages the packages on npm, using trusted publishing over OpenID
   Connect, so there is no npm token anywhere and the packages get provenance.
3. **Approve the staged versions**, which is what makes them installable: the **Staged Packages**
   tab on npmjs.com, or `npm stage approve <stage-id>` after `npm stage list`. Both ask for 2FA. To
   look first: `npm stage view <stage-id>` or `npm stage download <stage-id>`.

The version comes from the commit types: `fix:` gives a patch, `feat:` a minor, and `!` or a
`BREAKING CHANGE:` footer a major release.

The **first** publish of a package is manual (`npm publish ./eslint`), because a package's trusted
publisher is configured in its settings on npmjs.com, which exist only once the package does.

## Licence

© Cuzom Oy. [Apache-2.0](LICENSE): use and copy these settings freely.
