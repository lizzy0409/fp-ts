import * as assert from 'assert'
import * as RA from '../src/ReadonlyArray'
import { getFunctorWithIndexComposition } from '../src/FunctorWithIndex'

describe('FunctorWithIndex', () => {
  it('getFunctorComposition', () => {
    // tslint:disable-next-line: deprecation
    const FWI = getFunctorWithIndexComposition(RA.FunctorWithIndex, RA.FunctorWithIndex)
    const f = ([i, j]: readonly [number, number], a: string) => a + i + j
    assert.deepStrictEqual(
      FWI.map([[1], [2]], (n) => n * 2),
      [[2], [4]]
    )
    assert.deepStrictEqual(
      FWI.mapWithIndex(
        [
          ['a', 'b'],
          ['c', 'd']
        ],
        f
      ),
      [
        ['a00', 'b01'],
        ['c10', 'd11']
      ]
    )
  })
})
