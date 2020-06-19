export function parseQuoteMeta(meta) {
  if (!meta) { return null; }

  const attributes = {};
  const split = meta.split(';');

  if (split.length === 1) {
    attributes.nickname = split[0];
  } else {
    const id = split[0].slice(1);

    switch (split[0][0]) {
      case 'c':
        attributes.comment_id = id;
        break;
      case 'm':
        attributes.message_id = id;
        break;
      case 't':
        attributes.topic_id = id;
        break;
    }

    attributes.user_id = split[1];
    attributes.nickname = split[2];
  }

  return attributes;
}

export function parseSpoilerMeta(meta) {
  if (!meta) { return null; }

  return {
    label: meta
  };
}

export function parseDivMeta(meta) {
  if (!meta) { return null; }

  return {
    class: meta
  };
}
