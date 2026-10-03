// What the shared config accepts and refuses. Run with `pnpm test`.
import assert from 'node:assert/strict'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import stylelint from 'stylelint'
import config from './index.js'

// The cases are written on one line to keep them short; the standard config wants one declaration per
// line, so they are broken up here and what is left to judge is the rule under test.
const lines = (code) =>
  code
    .replace(/\{\s*/g, '{\n  ')
    .replace(/;\s*(?=[^}\s])/g, ';\n  ')
    .replace(/\s*\}/g, '\n}') + '\n'

async function warnings(code) {
  const { results } = await stylelint.lint({ code: lines(code), codeFilename: 'a.css', config })
  return results.flatMap((result) => result.warnings.map((w) => w.rule))
}

async function warningsOfVue(style, { alone = false } = {}) {
  const dir = await mkdtemp(join(tmpdir(), 'cuzom-stylelint-'))
  const file = join(dir, 'A.vue')
  await writeFile(
    file,
    `<template>\n  <p class="a">x</p>\n</template>\n\n<style scoped>\n${style}\n</style>\n`
  )
  const { results } = await stylelint.lint({
    files: file,
    config,
    ...(alone ? { cwd: dir } : {}),
  })
  await rm(dir, { recursive: true })
  return results.flatMap((result) => result.warnings.map((w) => w.rule))
}

const refused = [
  ['a hard-coded font size', '.a { font-size: 13px; }'],
  ['a hard-coded rem font size', '.a { font-size: 0.8125rem; }'],
  ['a hex colour', '.a { color: #cc0000; }'],
  ['a colour function', '.a { background-color: rgb(0 0 0 / 0.5); }'],
  ['a spacing literal', '.a { margin: 1rem; }'],
  ['a padding literal in a shorthand', '.a { padding: 0 1.5rem; }'],
  ['a gap literal', '.a { gap: 12px; }'],
  ['a radius literal', '.a { border-radius: 8px; }'],
  ['a shadow colour that is a function', '.a { box-shadow: 0 1px 2px rgb(0 0 0 / 0.1); }'],
  ['a shadow colour that is a hex', '.a { box-shadow: 0 1px 2px #000; }'],
  ['a z-index literal', '.a { z-index: 40; }'],
  ['!important', '.a { color: var(--c) !important; }'],
  ['an id selector', '#a { color: var(--c); }'],
  ['max-width media notation', '@media (max-width: 640px) { .a { color: var(--c); } }'],
  ['a class name that is not kebab-case', '.someClass { color: var(--c); }'],
]

const accepted = [
  [
    'tokens',
    '.a { font-size: var(--font-size-2); margin: 0 var(--space-4); z-index: var(--z-nav); }',
  ],
  ['kebab-case names', '.product-title-big { color: var(--color-text); }'],
  [
    'keywords and zero',
    '.a { margin: 0 auto; padding: 0; color: currentcolor; background-color: transparent; }',
  ],
  ['a percentage', '.a { margin-left: calc(50% - 50vw); padding: 50%; }'],
  ['an em that follows the text', '.a { font-size: 0.85em; padding: 0.15em 0.35em; }'],
  ['an optical nudge under 4px', '.a { margin-top: 2px; border-radius: 2px; }'],
  ['a function over tokens', '.a { padding: clamp(var(--space-3), 6vw, var(--space-7)); }'],
  [
    'the geometry of a shadow over a token colour',
    '.a { box-shadow: 0 4px 12px var(--black-a2); }',
  ],
  ['a layer behind its parent', '.a { z-index: -1; }'],
  ['a hairline gap in rem', '.a { gap: 0.2rem; }'],
  ['range media notation', '@media (width <= 640px) { .a { color: var(--c); } }'],
]

for (const [name, code] of refused) {
  test(`refuses ${name}`, async () => {
    assert.notDeepEqual(await warnings(code), [], code)
  })
}

for (const [name, code] of accepted) {
  test(`accepts ${name}`, async () => {
    assert.deepEqual(await warnings(code), [], code)
  })
}

test('finds its own dependencies from a project that has none of them', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'cuzom-stylelint-project-'))
  const { results } = await stylelint.lint({
    code: `.a {
  font-size: 13px;
}
`,
    codeFilename: join(dir, 'a.css'),
    config,
    cwd: dir,
  })
  await rm(dir, { recursive: true })
  assert.ok(results[0].warnings.length > 0)
})

test('reads Vue style blocks from a project that has none of the dependencies', async () => {
  assert.ok(
    (
      await warningsOfVue(
        `.a {
  font-size: 13px;
}`,
        { alone: true }
      )
    ).length > 0
  )
})

test('reads the style block of a Vue component', async () => {
  assert.ok((await warningsOfVue('.a {\n  font-size: 13px;\n}')).length > 0)
  assert.deepEqual(await warningsOfVue('.a {\n  font-size: var(--font-size-2);\n}'), [])
})
