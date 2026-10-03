# @cuzom/stylelint-config

Cuzom Oy's Stylelint config: the standard rules, Vue single-file components, and values that come
from design tokens instead of being written into a component.

```bash
pnpm add -D stylelint @cuzom/stylelint-config
```

`stylelint.config.js`:

```js
import cuzom from '@cuzom/stylelint-config'

export default {
  ...cuzom,
  // project rules; ignoreFiles: ['**/dist/**', '.nuxt/**', '.output/**']
}
```

Run it on CSS and Vue files: `stylelint "**/*.{css,vue}"`.

## What it adds to `stylelint-config-standard` and `stylelint-config-recommended-vue`

- **Tokens, not literals.** `color`, `background-color`, `border-color`, `font-size`,
  `border-radius`, `z-index`, `gap`, `margin*` and `padding*` take `var(--…)` (or a function such as
  `calc()` or `clamp()`), not `13px` or `#cc0000`. Allowed as they are: `0`, `auto`, `inherit`,
  `currentColor`, `transparent`, percentages, an `em` that follows the text around it, and a nudge
  under 4px (and a hairline under 0.25rem). A shadow's offsets and blur are geometry and stay
  literal; its colour is a token, because hex and `rgb()` are refused.
- **No hex colours and no `rgb()`, `hsl()` or similar** in a component. `color-mix()` is fine. A
  token file (`tokens.css`) defines the colours; turn the rule off for it:

  ```js
  overrides: [
    {
      files: ['**/tokens.css'],
      rules: {
        'color-no-hex': null,
        'function-disallowed-list': null,
        'scale-unlimited/declaration-strict-value': null,
      },
    },
  ],
  ```

- **No `!important`, no id selectors**, and media queries in range syntax (`width <= 640px`).
- **Kebab-case class names**, the standard rule unchanged (Radix Themes and aura-aq-sim name theirs
  that way). A repository that already has BEM names (`block__element--modifier`) can allow them
  with its own `selector-class-pattern`. `no-descending-specificity` is off, because it fights with
  scoped component styles.

Formatting is left to Prettier. `pnpm test` in this repository checks what the config accepts and
refuses.
