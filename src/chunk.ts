/**
 * @param {array} array The array to process.
 * @param {step} [step=1] The length of each chunk
 * @returns {array} Returns the new array of chunks.
 * @example
 *
 * chunk(['a', 'b', 'c', 'd'], 2)
 * // => [['a', 'b'], ['c', 'd']]
 *
 * chunk(['a', 'b', 'c', 'd'], 3)
 * // => [['a', 'b', 'c'], ['d']]
 */

export function chunk<T extends any>(array: T[], step = 1) {
  if (!Array.isArray(array)) {
    throw new Error('Required an array.')
  }
  const res = []
  const length = array.length
  let index = 0
  while (index < length) {
    res.push(array.slice(index, index += step))
  }
  return res
}
