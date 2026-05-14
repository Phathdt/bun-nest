export function camelToSnakeCase(value: string): string {
  return value.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function convertToCamelCase(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(convertToCamelCase);
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  return Object.entries(value as Record<string, unknown>).reduce<Record<string, unknown>>(
    (acc, [key, entryValue]) => {
      acc[toCamelCase(key)] = convertToCamelCase(entryValue);
      return acc;
    },
    {},
  );
}

function toCamelCase(value: string): string {
  return value.replace(/[_-]([a-zA-Z0-9])/g, (_, letter: string) =>
    letter.toUpperCase(),
  );
}
