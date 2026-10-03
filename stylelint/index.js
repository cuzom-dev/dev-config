// @ts-check
import { fileURLToPath } from 'node:url'

// Stylelint resolves `extends` and `plugins` names from the project that uses this config, and under pnpm a
// project does not see its dependencies' dependencies. So they are resolved here, from this package, and
// handed over as paths.
const here = (name) => fileURLToPath(import.meta.resolve(name))

// Values that are fine as they are: nothing to tokenise.
const KEYWORDS = [
  '0',
  'auto',
  'inherit',
  'initial',
  'unset',
  'currentColor',
  'currentcolor',
  'transparent',
  'none',
]

/** @type {import('stylelint').Config} */
export default {
  extends: [here('stylelint-config-standard'), here('stylelint-config-recommended-vue')],
  plugins: [here('stylelint-declaration-strict-value')],
  rules: {
    // Colours, sizes, spacing, radii, shadows and layers come from design tokens (custom properties), never
    // as a literal in a component. A value that is not a token is a value nobody named.
    'scale-unlimited/declaration-strict-value': [
      [
        'color',
        'background-color',
        'border-color',
        'font-size',
        'border-radius',
        'box-shadow',
        'z-index',
        'gap',
        'row-gap',
        'column-gap',
        '/^margin/',
        '/^padding/',
      ],
      {
        ignoreValues: [
          ...KEYWORDS,
          // A percentage, and an `em` that follows the text around it on purpose.
          String.raw`/^-?\d*\.?\d+%$/`,
          String.raw`/^-?\d*\.?\d+em$/`,
          // One or two pixels of optical nudge: under 4px.
          String.raw`/^-?[0-3](\.\d+)?px$/`,
          // A hairline radius or offset in rem, below 0.25rem.
          String.raw`/^-?0?\.(0\d*|1\d*|2[0-4]\d*)rem$/`,
        ],
        // A value that is a function (var(), calc(), clamp(), color-mix()) is built from tokens or from the
        // situation, so it is not a literal; the plugin lets functions through. Colour functions are the
        // exception and are refused below.
        message: 'Use a design token (var(--…)) for "${property}", not "${value}".',
      },
    ],
    'color-no-hex': true,
    'function-disallowed-list': [
      'rgb',
      'rgba',
      'hsl',
      'hsla',
      'hwb',
      'lab',
      'lch',
      'oklab',
      'oklch',
    ],
    'declaration-no-important': true,
    'selector-max-id': 0,
    'media-feature-range-notation': 'context',
    // BEM names (`block__element--modifier`) are the naming of the component CSS, so the standard
    // kebab-case-only pattern would reject nearly every class.
    'selector-class-pattern': [
      '^[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$',
      { message: 'Class names are kebab-case BEM: block__element--modifier.' },
    ],
    // Scoped component styles are written where they are used; the order is not a specificity argument.
    'no-descending-specificity': null,
  },
}
