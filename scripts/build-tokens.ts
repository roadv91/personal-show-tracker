/**
 * Generates `src/styles/tokens.css` from the Figma variables export in `tokens/tokens.json`.
 *
 * Colors:
 * - Primitives become Tailwind `--color-*` theme variables (`--color-blue-700`), so components
 *   can use them through classes like `text-blue-700`.
 * - Semantic tokens become Tailwind `--color-*` theme variables that reference the primitives,
 *   so components use them through classes like `bg-page-surface`.
 * - Tailwind's default palette is removed, so these are the only colors available.
 *
 * Numbers (Figma exports them as plain pixel values, e.g. `8`):
 * - Primitives (`spacing/8`, `radius/10`, …) become plain CSS variables in rem (`--spacing-8: 0.5rem`)
 *   with no classes, so they don't override Tailwind's own spacing scale (`gap-1` stays 4px).
 * - Semantic tokens with a `spacing` or `size` part become `--spacing-*` theme variables
 *   (`input/spacing/content` → `gap-input-spacing-content`), and ones with a `radius` part become
 *   `--radius-*` theme variables (`input/radius/field` → `rounded-input-radius-field`). Both in rem,
 *   so they grow with the browser's text size.
 * - Other semantic number tokens (border and focus ring widths) have no Tailwind namespace. They
 *   become plain CSS variables in px, so thin lines stay crisp (`--input-border-width: 1px`).
 *
 * Run with: npm run build:tokens
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const tokensPath = resolve(import.meta.dirname, '../tokens/tokens.json')
const outputPath = resolve(import.meta.dirname, '../src/styles/tokens.css')
const primitiveCollectionName = 'primitive/light'
const semanticCollectionName = 'semantic/light'
/** Pixels per rem, the browser default text size. */
const pixelsPerRem = 16

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

/** A CSS custom property to write to `tokens.css`. */
interface CssVariable {
  name: string
  value: string
}

/** The unit a number token is written in. */
type LengthUnit = 'rem' | 'px'

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
 * @throws If a token is neither a color nor a number.
 */
const flattenTokens = (group: TokenNode, path: string[] = []): FlatToken[] => {
  const tokens: FlatToken[] = []
  for (const [key, child] of Object.entries(group)) {
    if (key.startsWith('$') || !isTokenNode(child)) continue

    const childPath = [...path, key]
    if ('$value' in child) {
      if (child.$type !== 'color' && child.$type !== 'number') {
        throw new Error(
          `Token "${childPath.join('.')}" has unsupported $type "${String(child.$type)}"; only color and number tokens are handled`,
        )
      }
      tokens.push({ path: childPath, value: child.$value, type: child.$type })
    }
    // Not an else: in Figma a token can also have child tokens (e.g. `surface` and `surface/hover`)
    tokens.push(...flattenTokens(child, childPath))
  }
  return tokens
}

/**
 * Finds the primitive a token references, when its value is a reference like `{spacing.8}`.
 * @param token - The token to check.
 * @param primitivesByName - Every primitive, keyed by its dotted path.
 * @returns The referenced primitive, or `undefined` if the token holds a raw value.
 * @throws If the reference names a primitive that doesn't exist.
 */
const getReferencedPrimitive = (token: FlatToken, primitivesByName: Map<string, FlatToken>): FlatToken | undefined => {
  if (typeof token.value !== 'string') return undefined

  const reference = referencePattern.exec(token.value)
  if (!reference) return undefined

  const primitive = primitivesByName.get(reference[1])
  if (!primitive) {
    throw new Error(`Token "${token.path.join('.')}" references unknown primitive "{${reference[1]}}"`)
  }
  return primitive
}

/**
 * Builds a `var()` pointing at a primitive's CSS variable (`spacing/8` → `var(--spacing-8)`).
 * @param primitive - The referenced primitive.
 * @returns The `var()` expression.
 */
const toVariableReference = (primitive: FlatToken): string => `var(--${primitive.path.join('-')})`

/**
 * Converts a color token's value to CSS: a reference to its primitive, or the raw color (e.g. `#f5f5f5`).
 * @param token - The color token.
 * @param primitivesByName - Every primitive, keyed by its dotted path.
 * @returns The CSS value.
 * @throws If the value isn't a string, or references a primitive that doesn't exist.
 */
const toColorValue = (token: FlatToken, primitivesByName: Map<string, FlatToken>): string => {
  const primitive = getReferencedPrimitive(token, primitivesByName)
  if (primitive) return toVariableReference(primitive)
  if (typeof token.value !== 'string') {
    throw new Error(`Color token "${token.path.join('.')}" has a non-string value`)
  }
  return token.value
}

/**
 * Converts a number token's value (in Figma pixels) to a CSS length. rem tokens reference their
 * primitive; px tokens use the primitive's number directly, since the primitive variables are in rem.
 * @param token - The number token.
 * @param primitivesByName - Every primitive, keyed by its dotted path.
 * @param unit - The unit to write the value in.
 * @returns The CSS value, e.g. `var(--spacing-8)`, `0.5rem`, or `1px`.
 * @throws If the value isn't a number, or references a primitive that doesn't exist.
 */
const toLengthValue = (token: FlatToken, primitivesByName: Map<string, FlatToken>, unit: LengthUnit): string => {
  const primitive = getReferencedPrimitive(token, primitivesByName)
  if (primitive && unit === 'rem') return toVariableReference(primitive)

  const pixels = (primitive ?? token).value
  if (typeof pixels !== 'number') {
    throw new Error(`Number token "${token.path.join('.')}" doesn't resolve to a number`)
  }
  if (pixels === 0) return '0'
  return unit === 'px' ? `${pixels}px` : `${pixels / pixelsPerRem}rem`
}

/**
 * Picks the Tailwind theme namespace for a semantic number token from the parts of its name.
 * @param path - The token's path, e.g. `['input', 'spacing', 'content']`.
 * @returns `spacing` (padding, gap, width, height classes), `radius` (`rounded-*` classes), or
 *   `undefined` when Tailwind has no namespace for it (e.g. border widths).
 */
const getNumberNamespace = (path: string[]): 'spacing' | 'radius' | undefined => {
  if (path.includes('spacing') || path.includes('size')) return 'spacing'
  if (path.includes('radius')) return 'radius'
  return undefined
}

/**
 * Checks that no two tokens produce the same CSS variable, since primitives and semantic tokens
 * share namespaces (e.g. a semantic `red/700` would clash with the primitive `color/red/700`).
 * @param variableNames - Every CSS variable name the file will declare.
 * @throws If a name appears more than once.
 */
const assertUniqueVariableNames = (variableNames: string[]): void => {
  const duplicateNames = variableNames.filter((name, index) => variableNames.indexOf(name) !== index)
  if (duplicateNames.length > 0) {
    throw new Error(`Tokens produce the same CSS variable: ${duplicateNames.join(', ')}`)
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
  const primitivesByName = new Map(primitives.map((token) => [token.path.join('.'), token]))

  // Theme variables get Tailwind classes; plain variables are only usable through var()
  const themePrimitives: CssVariable[] = []
  const plainPrimitives: CssVariable[] = []
  const themeSemantics: CssVariable[] = []
  const plainSemantics: CssVariable[] = []

  for (const token of primitives) {
    // Primitive paths already start with their group (e.g. `color/blue/700` → `--color-blue-700`)
    const name = `--${token.path.join('-')}`
    if (token.type === 'color') {
      themePrimitives.push({ name, value: toColorValue(token, primitivesByName) })
    } else {
      plainPrimitives.push({ name, value: toLengthValue(token, primitivesByName, 'rem') })
    }
  }

  for (const token of semantics) {
    const pathName = token.path.join('-')
    if (token.type === 'color') {
      themeSemantics.push({ name: `--color-${pathName}`, value: toColorValue(token, primitivesByName) })
      continue
    }
    const namespace = getNumberNamespace(token.path)
    if (namespace) {
      themeSemantics.push({ name: `--${namespace}-${pathName}`, value: toLengthValue(token, primitivesByName, 'rem') })
    } else {
      plainSemantics.push({ name: `--${pathName}`, value: toLengthValue(token, primitivesByName, 'px') })
    }
  }

  assertUniqueVariableNames(
    [...themePrimitives, ...plainPrimitives, ...themeSemantics, ...plainSemantics].map((variable) => variable.name),
  )

  const toLine = ({ name, value }: CssVariable) => `  ${name}: ${value};`

  return [
    '/* Generated by scripts/build-tokens.ts from tokens/tokens.json. Do not edit; run `npm run build:tokens`. */',
    '',
    '/* `static` emits every token variable, even ones no utility class uses, so components can read them via var() */',
    '@theme static {',
    '  /* Remove Tailwind\'s default palette so only design tokens are available */',
    '  --color-*: initial;',
    '',
    '  /* Primitives */',
    ...themePrimitives.map(toLine),
    '',
    '  /* Semantic tokens */',
    ...themeSemantics.map(toLine),
    '}',
    '',
    '/*',
    ' * Variables without Tailwind classes, used through var() or e.g. `p-(--spacing-8)`.',
    ' * Number primitives stay out of the theme so they don\'t override Tailwind\'s spacing scale (`gap-1`).',
    ' * Semantic tokens here have no Tailwind namespace, e.g. `border-(length:--input-border-width)`.',
    ' */',
    ':root {',
    '  /* Primitives */',
    ...plainPrimitives.map(toLine),
    '',
    '  /* Semantic tokens */',
    ...plainSemantics.map(toLine),
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
