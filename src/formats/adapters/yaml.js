import { load as yamlParse, dump as yamlStringify, JSON_SCHEMA } from 'js-yaml'

// Parses a YAML file
const parse = function({ content, path }) {
  return yamlParse(content, {
    schema: JSON_SCHEMA,
    json: true,
    // Error handling
    filename: path,
    onWarning(error) {
      throw error
    },
  })
}

// Serializes a YAML file
const serialize = function({ content }) {
  return yamlStringify(content, {
    schema: JSON_SCHEMA,
    noRefs: true,
  })
}

export const yaml = {
  name: 'yaml',
  title: 'YAML',
  extensions: ['yml', 'yaml'],
  mimes: ['application/yaml', 'application/x-yaml', 'text/yaml', 'text/x-yaml'],
  mimeExtensions: ['+yaml'],
  // YAML specification also allows UTF-32, but iconv-lite does not support it
  charsets: ['utf-8', 'utf-16', 'utf-16be', 'utf-16le'],
  // Infinity is handled even with yaml.JSON_SCHEMA
  jsonCompat: ['superset'],
  parse,
  serialize,
}
