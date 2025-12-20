/**
 * Utility function to merge CSS classes
 * Similar to clsx/classnames but lightweight
 *
 * @param {...(string | object | Array)} classes - Classes to merge
 * @returns {string} Merged class string
 *
 * @example
 * cn('foo', 'bar') // => 'foo bar'
 * cn('foo', { bar: true, baz: false }) // => 'foo bar'
 * cn(['foo', 'bar'], 'baz') // => 'foo bar baz'
 */
export function cn(...classes) {
  const result = [];

  for (const cls of classes) {
    if (!cls) continue;

    if (typeof cls === 'string') {
      result.push(cls);
    } else if (Array.isArray(cls)) {
      const merged = cn(...cls);
      if (merged) result.push(merged);
    } else if (typeof cls === 'object') {
      for (const key in cls) {
        if (cls[key]) {
          result.push(key);
        }
      }
    }
  }

  return result.join(' ').trim();
}
