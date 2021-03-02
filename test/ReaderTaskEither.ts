import * as assert from 'assert'
import { sequenceT } from '../src/Apply'
import * as E from '../src/Either'
import { pipe } from '../src/function'
import * as I from '../src/IO'
import * as IE from '../src/IOEither'
import * as N from '../src/number'
import * as O from '../src/Option'
import * as R from '../src/Reader'
import * as RE from '../src/ReaderEither'
import * as RT from '../src/ReaderTask'
import * as _ from '../src/ReaderTaskEither'
import * as S from '../src/string'
import * as T from '../src/Task'
import * as TE from '../src/TaskEither'
import { assertPar, assertSeq } from './util'

describe('ReaderTaskEither', () => {
  describe('pipeables', () => {
    it('map', async () => {
      const double = (n: number): number => n * 2
      assert.deepStrictEqual(await pipe(_.right(1), _.map(double))({})(), E.right(2))
    })

    it('ap', async () => {
      const double = (n: number): number => n * 2
      assert.deepStrictEqual(await pipe(_.right(double), _.ap(_.right(1)))({})(), E.right(2))
    })

    it('apFirst', async () => {
      assert.deepStrictEqual(await pipe(_.right('a'), _.apFirst(_.right('b')))({})(), E.right('a'))
    })

    it('apSecond', async () => {
      assert.deepStrictEqual(await pipe(_.right('a'), _.apSecond(_.right('b')))({})(), E.right('b'))
    })

    it('chain', async () => {
      const f = (a: string) => (a.length > 2 ? _.right(a.length) : _.left('b'))
      assert.deepStrictEqual(await pipe(_.right('aaa'), _.chain(f))({})(), E.right(3))
      assert.deepStrictEqual(await pipe(_.right('a'), _.chain(f))({})(), E.left('b'))
    })

    it('chainFirst', async () => {
      const f = (a: string) => (a.length > 2 ? _.right(a.length) : _.left('b'))
      assert.deepStrictEqual(await pipe(_.right('aaa'), _.chainFirst(f))({})(), E.right('aaa'))
    })

    it('chainFirstW', async () => {
      const f = (a: string) => (a.length > 2 ? _.right(a.length) : _.left('b'))
      assert.deepStrictEqual(await pipe(_.right<object, number, string>('aaa'), _.chainFirstW(f))({})(), E.right('aaa'))
    })

    it('flatten', async () => {
      assert.deepStrictEqual(await pipe(_.right(_.right('a')), _.flatten)({})(), E.right('a'))
    })

    it('bimap', async () => {
      const f = (s: string): number => s.length
      const g = (n: number): boolean => n > 2
      assert.deepStrictEqual(await pipe(_.right(1), _.bimap(f, g))({})(), E.right(false))
      assert.deepStrictEqual(await pipe(_.left('error'), _.bimap(f, g))({})(), E.left(5))
    })

    it('mapLeft', async () => {
      const len = (s: string): number => s.length
      assert.deepStrictEqual(await pipe(_.right(1), _.mapLeft(len))({})(), E.right(1))
      assert.deepStrictEqual(await pipe(_.left('err'), _.mapLeft(len))({})(), E.left(3))
    })

    it('alt', async () => {
      assert.deepStrictEqual(
        await pipe(
          _.right(1),
          _.alt(() => _.right(2))
        )({})(),
        E.right(1)
      )
      assert.deepStrictEqual(
        await pipe(
          _.left('a'),
          _.alt(() => _.right(2))
        )({})(),
        E.right(2)
      )
      assert.deepStrictEqual(
        await pipe(
          _.left('a'),
          _.alt(() => _.left('b'))
        )({})(),
        E.left('b')
      )
    })

    it('fromPredicate', async () => {
      const predicate = (n: number) => n >= 2
      const gt2 = _.fromPredicate(predicate, (n) => `Invalid number ${n}`)

      const refinement = (u: string | number): u is number => typeof u === 'number'
      const isNumber = _.fromPredicate(refinement, (u) => `Invalid number ${String(u)}`)

      assert.deepStrictEqual(await gt2(3)({})(), E.right(3))
      assert.deepStrictEqual(await gt2(1)({})(), E.left('Invalid number 1'))
      assert.deepStrictEqual(await isNumber(4)({})(), E.right(4))
    })

    it('fromEither', async () => {
      assert.deepStrictEqual(await _.fromEither(E.right(1))({})(), E.right(1))
      assert.deepStrictEqual(await _.fromEither(E.left('a'))({})(), E.left('a'))
    })

    it('fromOption', async () => {
      assert.deepStrictEqual(await _.fromOption(() => 'none')(O.none)({})(), E.left('none'))
      assert.deepStrictEqual(await _.fromOption(() => 'none')(O.some(1))({})(), E.right(1))
    })

    it('filterOrElse', async () => {
      assert.deepStrictEqual(
        await pipe(
          _.right(12),
          _.filterOrElse(
            (n) => n > 10,
            () => 'a'
          )
        )({})(),
        E.right(12)
      )
      assert.deepStrictEqual(
        await pipe(
          _.right(8),
          _.filterOrElse(
            (n) => n > 10,
            () => 'a'
          )
        )({})(),
        E.left('a')
      )
    })
  })

  // -------------------------------------------------------------------------------------
  // instances
  // -------------------------------------------------------------------------------------

  it('applicativeReaderTaskEitherSeq', async () => {
    await assertSeq(_.ApplicativeSeq, _.FromTask, (fa) => fa(null)())
  })

  it('applicativeReaderTaskEitherPar', async () => {
    await assertPar(_.ApplicativePar, _.FromTask, (fa) => fa(null)())
  })

  // -------------------------------------------------------------------------------------
  // constructors
  // -------------------------------------------------------------------------------------

  it('ask', async () => {
    return assert.deepStrictEqual(await _.ask<number>()(1)(), E.right(1))
  })

  it('asks', async () => {
    return assert.deepStrictEqual(await _.asks((s: string) => s.length)('foo')(), E.right(3))
  })

  it('local', async () => {
    const len = (s: string): number => s.length
    assert.deepStrictEqual(
      await pipe(
        _.asks((n: number) => n + 1),
        // tslint:disable-next-line: deprecation
        _.local(len)
      )('aaa')(),
      E.right(4)
    )
  })

  it('leftTask', async () => {
    assert.deepStrictEqual(await _.leftTask(T.of(1))({})(), E.left(1))
  })

  it('rightTask', async () => {
    assert.deepStrictEqual(await _.rightTask(T.of(1))({})(), E.right(1))
  })

  it('leftReaderTask', async () => {
    assert.deepStrictEqual(await _.leftReaderTask(RT.of(1))({})(), E.left(1))
  })

  it('rightReaderTask', async () => {
    assert.deepStrictEqual(await _.rightReaderTask(RT.of(1))({})(), E.right(1))
  })

  it('rightReader', async () => {
    assert.deepStrictEqual(await _.rightReader(R.of(1))({})(), E.right(1))
  })

  it('leftReader', async () => {
    assert.deepStrictEqual(await _.leftReader(R.of(1))({})(), E.left(1))
  })

  it('fromTaskEither', async () => {
    assert.deepStrictEqual(await _.fromTaskEither(TE.of(1))({})(), E.right(1))
  })

  it('leftIO', async () => {
    assert.deepStrictEqual(await _.leftIO(I.of(1))({})(), E.left(1))
  })

  it('fromIOEither', async () => {
    assert.deepStrictEqual(await _.fromIOEither(() => E.right(1))({})(), E.right(1))
    assert.deepStrictEqual(await _.fromIOEither(() => E.left('error'))({})(), E.left('error'))
  })

  it('fold', async () => {
    const fold = _.fold(
      (l: string) => R.of(T.of(l.length)),
      (a: number) => R.of(T.of(a * 2))
    )
    assert.deepStrictEqual(await fold(_.right(1))({})(), 2)
    assert.deepStrictEqual(await fold(_.left('err'))({})(), 3)
  })

  it('getOrElse', async () => {
    assert.deepStrictEqual(
      await pipe(
        _.right(1),
        _.getOrElse((l: string) => R.of(T.of(l.length)))
      )({})(),
      1
    )
    assert.deepStrictEqual(
      await pipe(
        _.left('err'),
        _.getOrElse((l: string) => R.of(T.of(l.length)))
      )({})(),
      3
    )
  })

  it('orElse', async () => {
    assert.deepStrictEqual(
      await pipe(
        _.right(1),
        _.orElse((s: string) => _.right(s.length))
      )({})(),
      E.right(1)
    )
    assert.deepStrictEqual(
      await pipe(
        _.left('error'),
        _.orElse((s) => _.right(s.length))
      )({})(),
      E.right(5)
    )
  })

  describe('MonadIO', () => {
    it('fromIO', async () => {
      assert.deepStrictEqual(await _.fromIO(() => 1)({})(), E.right(1))
    })
  })

  it('swap', async () => {
    assert.deepStrictEqual(await _.swap(_.right(1))({})(), E.left(1))
    assert.deepStrictEqual(await _.swap(_.left('a'))({})(), E.right('a'))
  })

  describe('getSemigroup', () => {
    it('concat', async () => {
      // tslint:disable-next-line: deprecation
      const S = _.getSemigroup(N.SemigroupSum)
      assert.deepStrictEqual(await S.concat(_.left('a'), _.left('b'))({})(), E.left('a'))
      assert.deepStrictEqual(await S.concat(_.left('a'), _.right(2))({})(), E.right(2))
      assert.deepStrictEqual(await S.concat(_.right(1), _.left('b'))({})(), E.right(1))
      assert.deepStrictEqual(await S.concat(_.right(1), _.right(2))({})(), E.right(3))
    })
  })

  it('getApplyMonoid', async () => {
    // tslint:disable-next-line: deprecation
    const M = _.getApplyMonoid(N.MonoidSum)

    assert.deepStrictEqual(await M.concat(_.right(1), _.right(2))({})(), E.right(3))
    assert.deepStrictEqual(await M.concat(_.right(1), _.left('b'))({})(), E.left('b'))
    assert.deepStrictEqual(await M.concat(_.right(1), M.empty)({})(), E.right(1))
    assert.deepStrictEqual(await M.concat(M.empty, _.right(1))({})(), E.right(1))
  })

  it('fromReaderEither', async () => {
    assert.deepStrictEqual(await _.fromReaderEither(RE.left('a'))({})(), E.left('a'))
    assert.deepStrictEqual(await _.fromReaderEither(RE.right(1))({})(), E.right(1))
  })

  it('getApplicativeReaderTaskValidation', async () => {
    const A = _.getApplicativeReaderTaskValidation(T.ApplicativePar, S.Semigroup)
    assert.deepStrictEqual(await sequenceT(A)(_.left('a'), _.left('b'))(null)(), E.left('ab'))
    // tslint:disable-next-line: deprecation
    const AV = _.getReaderTaskValidation(S.Semigroup)
    assert.deepStrictEqual(await sequenceT(AV)(_.left('a'), _.left('b'))(null)(), E.left('ab'))
  })

  it('getAltReaderTaskValidation', async () => {
    const A = _.getAltReaderTaskValidation(S.Semigroup)
    assert.deepStrictEqual(await A.alt(_.left('a'), () => _.left('b'))(null)(), E.left('ab'))
    // tslint:disable-next-line: deprecation
    const AV = _.getReaderTaskValidation(S.Semigroup)
    assert.deepStrictEqual(await AV.alt(_.left('a'), () => _.left('b'))(null)(), E.left('ab'))
  })

  describe('bracket', () => {
    // tslint:disable-next-line: readonly-array
    let log: Array<string> = []

    const acquireFailure = _.left('acquire failure')
    const acquireSuccess = _.right({ res: 'acquire success' })
    const useSuccess = () => _.right('use success')
    const useFailure = () => _.left('use failure')
    const releaseSuccess = () =>
      _.fromIO(() => {
        log.push('release success')
      })
    const releaseFailure = () => _.left('release failure')

    beforeEach(() => {
      log = []
    })

    it('should return the acquire error if acquire fails', async () => {
      assert.deepStrictEqual(
        await _.bracket(acquireFailure, useSuccess, releaseSuccess)(undefined)(),
        E.left('acquire failure')
      )
    })

    it('body and release must not be called if acquire fails', async () => {
      await _.bracket(acquireFailure, useSuccess, releaseSuccess)(undefined)()
      assert.deepStrictEqual(log, [])
    })

    it('should return the use error if use fails and release does not', async () => {
      assert.deepStrictEqual(
        await _.bracket(acquireSuccess, useFailure, releaseSuccess)(undefined)(),
        E.left('use failure')
      )
    })

    it('should return the release error if both use and release fail', async () => {
      assert.deepStrictEqual(
        await _.bracket(acquireSuccess, useFailure, releaseFailure)(undefined)(),
        E.left('release failure')
      )
    })

    it('release must be called if the body returns', async () => {
      await _.bracket(acquireSuccess, useSuccess, releaseSuccess)(undefined)()
      assert.deepStrictEqual(log, ['release success'])
    })

    it('release must be called if the body throws', async () => {
      await _.bracket(acquireSuccess, useFailure, releaseSuccess)(undefined)()
      assert.deepStrictEqual(log, ['release success'])
    })

    it('should return the release error if release fails', async () => {
      assert.deepStrictEqual(
        await _.bracket(acquireSuccess, useSuccess, releaseFailure)(undefined)(),
        E.left('release failure')
      )
    })
  })

  it('chainEitherK', async () => {
    const f = (s: string) => E.right(s.length)
    assert.deepStrictEqual(await pipe(_.right('a'), _.chainEitherK(f))(undefined)(), E.right(1))
  })

  it('chainIOEitherK', async () => {
    const f = (s: string) => IE.right(s.length)
    assert.deepStrictEqual(await pipe(_.right('a'), _.chainIOEitherK(f))(undefined)(), E.right(1))
  })

  it('chainTaskEitherK', async () => {
    const f = (s: string) => TE.right(s.length)
    assert.deepStrictEqual(await pipe(_.right('a'), _.chainTaskEitherK(f))(undefined)(), E.right(1))
  })

  // -------------------------------------------------------------------------------------
  // utils
  // -------------------------------------------------------------------------------------

  it('do notation', async () => {
    assert.deepStrictEqual(
      await pipe(
        _.right<void, string, number>(1),
        _.bindTo('a'),
        _.bind('b', () => _.right('b'))
      )(undefined)(),
      E.right({ a: 1, b: 'b' })
    )
  })

  it('apS', async () => {
    assert.deepStrictEqual(
      await pipe(_.right<void, string, number>(1), _.bindTo('a'), _.apS('b', _.right('b')))(undefined)(),
      E.right({ a: 1, b: 'b' })
    )
  })

  it('sequenceArray', async () => {
    // tslint:disable-next-line: readonly-array
    const log: Array<number | string> = []
    const right = (n: number): _.ReaderTaskEither<undefined, string, number> =>
      _.rightIO(() => {
        log.push(n)
        return n
      })
    const left = (s: string): _.ReaderTaskEither<undefined, string, number> =>
      _.leftIO(() => {
        log.push(s)
        return s
      })
    assert.deepStrictEqual(await pipe([right(1), right(2)], _.sequenceArray)(undefined)(), E.right([1, 2]))
    assert.deepStrictEqual(await pipe([right(3), left('a')], _.sequenceArray)(undefined)(), E.left('a'))
    assert.deepStrictEqual(await pipe([left('b'), right(4)], _.sequenceArray)(undefined)(), E.left('b'))
    assert.deepStrictEqual(log, [1, 2, 3, 'a', 'b', 4])
  })

  it('sequenceSeqArray', async () => {
    // tslint:disable-next-line: readonly-array
    const log: Array<number | string> = []
    const right = (n: number): _.ReaderTaskEither<undefined, string, number> =>
      _.rightIO(() => {
        log.push(n)
        return n
      })
    const left = (s: string): _.ReaderTaskEither<undefined, string, number> =>
      _.leftIO(() => {
        log.push(s)
        return s
      })
    assert.deepStrictEqual(await pipe([right(1), right(2)], _.sequenceSeqArray)(undefined)(), E.right([1, 2]))
    assert.deepStrictEqual(await pipe([right(3), left('a')], _.sequenceSeqArray)(undefined)(), E.left('a'))
    assert.deepStrictEqual(await pipe([left('b'), right(4)], _.sequenceSeqArray)(undefined)(), E.left('b'))
    assert.deepStrictEqual(log, [1, 2, 3, 'a', 'b'])
  })

  it('getCompactable', async () => {
    const C = _.getCompactable(S.Monoid)
    assert.deepStrictEqual(await C.compact(_.of(O.some('a')))({})(), E.right('a'))
  })

  it('getFilterable', async () => {
    const F = _.getFilterable(S.Monoid)
    assert.deepStrictEqual(await F.filter(_.of('a'), (s) => s.length > 0)({})(), E.right('a'))
    assert.deepStrictEqual(
      await F.filterMap(_.of('a'), (s) => (s.length > 0 ? O.some(s.length) : O.none))({})(),
      E.right(1)
    )
    const { left: left1, right: right1 } = F.partition(_.of('a'), (s) => s.length > 0)
    assert.deepStrictEqual(await left1({})(), E.left(''))
    assert.deepStrictEqual(await right1({})(), E.right('a'))
    const { left: left2, right: right2 } = F.partitionMap(_.of('a'), (s) =>
      s.length > 0 ? E.right(s.length) : E.left(s)
    )
    assert.deepStrictEqual(await left2({})(), E.left(''))
    assert.deepStrictEqual(await right2({})(), E.right(1))
  })
})
