import { assert, chunk } from "../src/utils"

describe("Utils", () => {
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

  describe("assert", () => {
    it('should return specify error message',() => {
      try {
        assert(false, "got error")
      } catch (e) {
        expect(e.message).toBe("got error")
      }
    });

    it('should return default error message', () => {
      try {
        assert(false)
      } catch (e) {
        expect(e.message).toBe("unexpected compiler condition")
      }
    });
  })
})
