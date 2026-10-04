/**
 * Generates `src/styles/tokens.css` from the Figma variables export in `tokens/tokens.json`.
 *
 * - Primitives become Tailwind `--color-*` theme variables (`--color-blue-700`), so components
 *   can use them through classes like `text-blue-700`.
 * - Semantic tokens become Tailwind `--color-*` theme variables that reference the primitives,
 *   so components use them through classes like `bg-page-surface`.
 * - Tailwind's default palette is removed, so these are the only colors available.
 *
 * Run with: npm run build:tokens
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const tokensPath = resolve(import.meta.dirname, '../tokens/tokens.json')
const outputPath = resolve(import.meta.dirname, '../src/styles/tokens.css')
const primitiveCollectionName = 'primitive/light'
const semanticCollectionName = 'semantic/light'

/** Matches a token reference such as `{color.blue.700}` and captures the dotted path. */
const referencePattern = /^\{(.+)\}$/

/** A JSON object in the tokens export: a collection, a group, or a token. */
type TokenNode = Record<string, unknown>

/** A token pulled out of the nested export, with its path from the collection root. */
interface FlatToken {
  path: string[]
  value: unknown
  type: unknown
}

/**
 * Checks whether a JSON value is a plain object (as opposed to a string, number, array, or null).
 * @param value - Any parsed JSON value.
 * @returns `true` if the value can be walked as a token group or token.
 */
const isTokenNode = (value: unknown): value is TokenNode =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * Looks up a collection (e.g. `primitive/light`) in the tokens export.
 * @param tokensJson - The parsed contents of `tokens/tokens.json`.
 * @param collectionName - The collection key, written as `<collection>/<mode>`.
 * @returns The collection's token tree.
 * @throws If the collection is missing, listing the collections that do exist.
 */
const getCollection = (tokensJson: unknown, collectionName: string): TokenNode => {
  const collection = isTokenNode(tokensJson) ? tokensJson[collectionName] : undefined
  if (!isTokenNode(collection)) {
    const availableNames = isTokenNode(tokensJson) ? Object.keys(tokensJson).join(', ') : 'none'
    throw new Error(`Collection "${collectionName}" not found in tokens.json (found: ${availableNames})`)
  }
  return collection
}

/**
 * Recursively collects every token in a group into a flat list.
 * Keys starting with `$` (`$type`, `$extensions`, `$description`) are metadata and are skipped.
 * @param group - The group to walk. Start with a whole collection.
 * @param path - Names of the groups above `group`. Omit on the first call.
 * @returns Every token under `group`, each with its full path.
 */
const flattenTokens = (group: TokenNode, path: string[] = []): FlatToken[] => {
  const tokens: FlatToken[] = []
  for (const [key, child] of Object.entries(group)) {
    if (key.startsWith('$') || !isTokenNode(child)) continue

    const childPath = [...path, key]
    if ('$value' in child) {
      tokens.push({ path: childPath, value: child.$value, type: child.$type })
    }
    // Not an else: in Figma a token can also have child tokens (e.g. `bg` and `bg/hover`)
    tokens.push(...flattenTokens(child, childPath))
  }
  return tokens
}

/**
 * Converts a token's value to CSS. References like `{color.blue.700}` become
 * `var(--color-blue-700)`; raw values like `#f5f5f5` are returned as-is.
 * @param token - The token to convert.
 * @param primitiveNames - Dotted paths of every primitive, used to validate references.
 * @returns The CSS value.
 * @throws If the token isn't a color, or references a primitive that doesn't exist.
 */
const toCssValue = (token: FlatToken, primitiveNames: Set<string>): string => {
  const tokenName = token.path.join('.')
  if (token.type !== 'color' || typeof token.value !== 'string') {
    throw new Error(`Token "${tokenName}" has unsupported $type "${String(token.type)}"; only color tokens are handled`)
  }

  const reference = referencePattern.exec(token.value)
  if (!reference) return token.value

  const referencedName = reference[1]
  if (!primitiveNames.has(referencedName)) {
    throw new Error(`Token "${tokenName}" references unknown primitive "{${referencedName}}"`)
  }
  return `var(--${referencedName.replaceAll('.', '-')})`
}

/**
 * Checks that no two tokens produce the same CSS variable, now that primitives and semantic tokens
 * share the `--color-*` namespace (e.g. a semantic `red/700` would clash with the primitive `color/red/700`).
 * @param variableNames - Every CSS variable name the file will declare.
 * @throws If a name appears more than once.
 */
const assertUniqueVariableNames = (variableNames: string[]): void => {
  const duplicateNames = variableNames.filter((name, index) => variableNames.indexOf(name) !== index)
  if (duplicateNames.length > 0) {
    throw new Error(`Primitive and semantic tokens produce the same CSS variable: ${duplicateNames.join(', ')}`)
  }
}

/**
 * Builds the contents of `tokens.css` from the tokens export.
 * @param tokensJson - The parsed contents of `tokens/tokens.json`.
 * @returns The full CSS file as a string.
 */
const buildTokensCss = (tokensJson: unknown): string => {
  const primitives = flattenTokens(getCollection(tokensJson, primitiveCollectionName))
  const semantics = flattenTokens(getCollection(tokensJson, semanticCollectionName))
  const primitiveNames = new Set(primitives.map((token) => token.path.join('.')))

  // Primitive paths already start with `color` (e.g. `color/blue/700` → `--color-blue-700`)
  const primitiveVariables = primitives.map((token) => ({
    name: `--${token.path.join('-')}`,
    value: toCssValue(token, primitiveNames),
  }))
  const semanticVariables = semantics.map((token) => ({
    name: `--color-${token.path.join('-')}`,
    value: toCssValue(token, primitiveNames),
  }))
  assertUniqueVariableNames([...primitiveVariables, ...semanticVariables].map((variable) => variable.name))

  const toLine = ({ name, value }: { name: string; value: string }) => `  ${name}: ${value};`

  return [
    '/* Generated by scripts/build-tokens.ts from tokens/tokens.json. Do not edit; run `npm run build:tokens`. */',
    '',
    '/* `static` emits every token variable, even ones no utility class uses, so components can read them via var() */',
    '@theme static {',
    '  /* Remove Tailwind\'s default palette so only design tokens are available */',
    '  --color-*: initial;',
    '',
    '  /* Primitives */',
    ...primitiveVariables.map(toLine),
    '',
    '  /* Semantic tokens */',
    ...semanticVariables.map(toLine),
    '}',
    '',
  ].join('\n')
}

// Side effects: reads tokens/tokens.json and overwrites src/styles/tokens.css.
// tokens/ is gitignored, so a fresh clone won't have the export yet.
if (!existsSync(tokensPath)) {
  throw new Error('tokens/tokens.json not found. Export the Figma variables there first (the folder is gitignored).')
}
const tokensJson: unknown = JSON.parse(readFileSync(tokensPath, 'utf8'))
writeFileSync(outputPath, buildTokensCss(tokensJson))
console.log('Wrote src/styles/tokens.css')
