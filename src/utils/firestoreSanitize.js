/**
 * Remove valores `undefined` (Firestore rejeita) e normaliza aninhados.
 * @param {unknown} value
 * @returns {unknown}
 */
export function sanitizeForFirestore(value) {
  if (value === undefined) return undefined;

  if (value === null) return null;

  if (Array.isArray(value)) {
    if (value.some((item) => Array.isArray(item))) {
      return value
        .map((item) => {
          if (Array.isArray(item)) {
            return sanitizeForFirestore({ cells: item });
          }
          return sanitizeForFirestore(item);
        })
        .filter((item) => item !== undefined);
    }
    return value
      .map((item) => sanitizeForFirestore(item))
      .filter((item) => item !== undefined);
  }

  if (typeof value === 'object' && value !== null) {
    /** @type {Record<string, unknown>} */
    const out = {};
    Object.entries(value).forEach(([key, val]) => {
      if (val === undefined) return;
      const cleaned = sanitizeForFirestore(val);
      if (cleaned !== undefined) {
        out[key] = cleaned;
      }
    });
    return out;
  }

  return value;
}

export default sanitizeForFirestore;
