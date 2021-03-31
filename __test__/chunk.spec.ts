import { chunk } from "../src/chunk"

describe("chunk", () => {
  it('should return correct error message', () => {
    try {
      // @ts-ignore
      chunk("", 2)
    } catch (e) {
      expect(e.message).toBe("Required an array.")
    }
  });
  it('should split array correct', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([ [ 1, 2 ], [ 3, 4 ], [ 5 ] ])
  });
})
