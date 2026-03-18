import { en } from './en'
import { nl } from './nl'

export const locales = ['en', 'nl'] as const
export type Locale = (typeof locales)[number]

export const messages = { en, nl } as const

type AnyRecord = Record<string, unknown>

function getPath(obj: AnyRecord, path: string): unknown {
  const parts = path.split('.').filter(Boolean)
  let cur: unknown = obj
  for (const part of parts) {
    if (cur && typeof cur === 'object' && part in (cur as AnyRecord)) {
      cur = (cur as AnyRecord)[part]
      continue
    }
    return undefined
  }
  return cur
}

export function createTranslator(locale: Locale) {
  const dict = messages[locale] as unknown as AnyRecord

  return (key: string) => {
    const value = getPath(dict, key)
    if (typeof value === 'string') return value
    return key
  }
}

