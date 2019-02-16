import * as assert from 'assert'
import * as eitherT from '../src/EitherT'
import * as either from '../src/Either'
import { task } from '../src/Task'

describe('EitherT', () => {
  it('getEitherT', () => {
    // tslint:disable-next-line: deprecation
    const { chain, of } = eitherT.getEitherT(task)
    const f = (n: number) => of(n * 2)
    const x = of(1)
    const y = eitherT.fromEither(task)<string, number>(either.left('foo'))
    return Promise.all([chain(f, x).run(), chain(f, y).run()]).then(([e1, e2]) => {
      assert.deepStrictEqual(e1, either.right(2))
      assert.deepStrictEqual(e2, either.left('foo'))
    })
  })

  it('getEitherT2v', () => {
    const { chain, of } = eitherT.getEitherT2v(task)
    const f = (n: number) => of(n * 2)
    const x = of(1)
    const y = eitherT.fromEither(task)<string, number>(either.left('foo'))
    return Promise.all([chain(x, f).run(), chain(y, f).run()]).then(([e1, e2]) => {
      assert.deepStrictEqual(e1, either.right(2))
      assert.deepStrictEqual(e2, either.left('foo'))
    })
  })
})
