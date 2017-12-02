import cosmiconfig from 'cosmiconfig'
import { get as getRoot } from 'app-root-dir'
import { relative, resolve } from 'path'
import jsome from 'jsome'

import Schema from './schema'

export const Root = getRoot()

export const configError = ({ key, value, type }) =>
  `Frost: The config for ${key} is of the wrong type. Frost expected a ${type} but received ${typeof value}`

export function validateConfig(config, schema) {
  return Object.keys(schema).reduce((acc, curr) => {
    const structure = schema[curr]
    const value = config[curr] || {}

    if (!structure.type) {
      acc[curr] = validateConfig(value, structure)
    } else {
      if (config[curr]) {
        acc[curr] = processEntry(curr, value, structure)
      } else {
        acc[curr] = structure.defaults
      }
    }

    return acc
  }, {})
}

/* eslint-disable no-unused-vars */

export function processEntry(key, value, { type, defaults }) {
  const props = { key, value, type }
  let parsed

  switch (type) {
    case 'string':
    case 'url':
      if (typeof value !== 'string') {
        throw new Error(configError(props))
      }
      return value

    case 'object-or-bool':
        if (typeof value !== 'object' || typeof value !== 'boolean') {
            throw new Error(configError(props));
        }

        if (typeof value === 'object') {
            return value;
        } else if (typeof value === 'boolean') {
            if (value == true) {
                return defaults;
            }
            return false;
        }
    case 'number':
      parsed = parseFloat(value, 10)
      if (isNaN(parsed)) {
        throw new Error(configError(props))
      }
      return parsed

    case 'array':
      if (!Array.isArray(value)) {
        throw new Error(configError(props))
      }
      return value

    case 'boolean':
      return !!value

    case 'regex':
      if (value.constructor !== RegExp) {
        throw new Error(configError(props))
      }
      return value

    case 'path':
      if (typeof value !== 'string') {
        throw new Error(configError(props))
      }
      return resolve(Root, value)

    default:
      throw new Error(`Frost: Received an entry in config that is not supported. Found the following Entry \n\n ${key}: ${value}`)
  }
}

/* eslint-enable no-unused-vars */
function setFlags(flags, config) {
  for (const key in flags) {
    config[key] = flags[key]
  }

  return config
}

export async function loadConfig(prefix = 'frost', flags = {}) {
  const loader = cosmiconfig(prefix, {
    rcExtensions: true,
    stopDir: Root
  })

  const result = await loader.load(Root)
  const root = relative(Root, result.filepath)
  const config = validateConfig(setFlags(flags, result.config), Schema)
  config.root = Root;

  return { config, root }
}
