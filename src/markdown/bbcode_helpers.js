export function parseQuoteMeta(meta) {
  if (!meta) { return null; }

  const attributes = {};
  const split = meta.split(';')

  if (split.length === 1) {
    attributes.nickname = split[0];
  }

  return attributes;
}
