/**
 * @file The `Apply` class provides the `ap` which is used to apply a function to an argument under a type constructor.
 *
 * `Apply` can be used to lift functions of two or more arguments to work on values wrapped with the type constructor
 * `f`.
 *
 * Instances must satisfy the following law in addition to the `Functor` laws:
 *
 * 1. Associative composition: `F.ap(F.ap(F.map(fbc, bc => ab => a => bc(ab(a))), fab), fa) = F.ap(fbc, F.ap(fab, fa))`
 *
 * Formally, `Apply` represents a strong lax semi-monoidal endofunctor.
 */
import { constant, curried, Curried2, Curried3, Curried4, Function1 } from './function'
import { Functor, Functor1, Functor2, Functor2C, Functor3, Functor3C } from './Functor'
import { HKT, Type, Type2, Type3, URIS, URIS2, URIS3 } from './HKT'
import { Semigroup } from './Semigroup'

/**
 * @since 1.0.0
 */
export interface Apply<F> extends Functor<F> {
  readonly ap: <A, B>(fab: HKT<F, (a: A) => B>, fa: HKT<F, A>) => HKT<F, B>
}

export interface Apply1<F extends URIS> extends Functor1<F> {
  readonly ap: <A, B>(fab: Type<F, (a: A) => B>, fa: Type<F, A>) => Type<F, B>
}

export interface Apply2<F extends URIS2> extends Functor2<F> {
  readonly ap: <L, A, B>(fab: Type2<F, L, (a: A) => B>, fa: Type2<F, L, A>) => Type2<F, L, B>
}

export interface Apply3<F extends URIS3> extends Functor3<F> {
  readonly ap: <U, L, A, B>(fab: Type3<F, U, L, (a: A) => B>, fa: Type3<F, U, L, A>) => Type3<F, U, L, B>
}

export interface Apply2C<F extends URIS2, L> extends Functor2C<F, L> {
  readonly ap: <A, B>(fab: Type2<F, L, (a: A) => B>, fa: Type2<F, L, A>) => Type2<F, L, B>
}

export interface Apply3C<F extends URIS3, U, L> extends Functor3C<F, U, L> {
  readonly ap: <A, B>(fab: Type3<F, U, L, (a: A) => B>, fa: Type3<F, U, L, A>) => Type3<F, U, L, B>
}

/**
 * Combine two effectful actions, keeping only the result of the first
 *
 * @since 1.0.0
 */
export function applyFirst<F extends URIS3>(
  F: Apply3<F>
): <U, L, A, B>(fa: Type3<F, U, L, A>, fb: Type3<F, U, L, B>) => Type3<F, U, L, A>
export function applyFirst<F extends URIS3, U, L>(
  F: Apply3C<F, U, L>
): <A, B>(fa: Type3<F, U, L, A>, fb: Type3<F, U, L, B>) => Type3<F, U, L, A>
export function applyFirst<F extends URIS2>(
  F: Apply2<F>
): <L, A, B>(fa: Type2<F, L, A>, fb: Type2<F, L, B>) => Type2<F, L, A>
export function applyFirst<F extends URIS2, L>(
  F: Apply2C<F, L>
): <A, B>(fa: Type2<F, L, A>, fb: Type2<F, L, B>) => Type2<F, L, A>
export function applyFirst<F extends URIS>(F: Apply1<F>): <A, B>(fa: Type<F, A>, fb: Type<F, B>) => Type<F, A>
export function applyFirst<F>(F: Apply<F>): <A, B>(fa: HKT<F, A>, fb: HKT<F, B>) => HKT<F, A>
export function applyFirst<F>(F: Apply<F>): <A, B>(fa: HKT<F, A>, fb: HKT<F, B>) => HKT<F, A> {
  return (fa, fb) => F.ap(F.map(fa, constant), fb)
}

/**
 * Combine two effectful actions, keeping only the result of the second
 *
 * @since 1.0.0
 */
export function applySecond<F extends URIS3>(
  F: Apply3<F>
): <U, L, A, B>(fa: Type3<F, U, L, A>, fb: Type3<F, U, L, B>) => Type3<F, U, L, B>
export function applySecond<F extends URIS3, U, L>(
  F: Apply3C<F, U, L>
): <A, B>(fa: Type3<F, U, L, A>, fb: Type3<F, U, L, B>) => Type3<F, U, L, B>
export function applySecond<F extends URIS2>(
  F: Apply2<F>
): <L, A, B>(fa: Type2<F, L, A>, fb: Type2<F, L, B>) => Type2<F, L, B>
export function applySecond<F extends URIS2, L>(
  F: Apply2C<F, L>
): <A, B>(fa: Type2<F, L, A>, fb: Type2<F, L, B>) => Type2<F, L, B>
export function applySecond<F extends URIS>(F: Apply1<F>): <A, B>(fa: Type<F, A>, fb: Type<F, B>) => Type<F, B>
export function applySecond<F>(F: Apply<F>): <A, B>(fa: HKT<F, A>, fb: HKT<F, B>) => HKT<F, B>
export function applySecond<F>(F: Apply<F>): <A, B>(fa: HKT<F, A>, fb: HKT<F, B>) => HKT<F, B> {
  return <A, B>(fa: HKT<F, A>, fb: HKT<F, B>) => F.ap(F.map(fa, () => (b: B) => b), fb)
}

/**
 * Lift a function of two arguments to a function which accepts and returns values wrapped with the type constructor `F`
 *
 * @since 1.0.0
 */
export function liftA2<F extends URIS3>(
  F: Apply3<F>
): <A, B, C>(f: Curried2<A, B, C>) => <U, L>(fa: Type3<F, U, L, A>) => (fb: Type3<F, U, L, B>) => Type3<F, U, L, C>
export function liftA2<F extends URIS3, U, L>(
  F: Apply3C<F, U, L>
): <A, B, C>(f: Curried2<A, B, C>) => (fa: Type3<F, U, L, A>) => (fb: Type3<F, U, L, B>) => Type3<F, U, L, C>
export function liftA2<F extends URIS2>(
  F: Apply2<F>
): <A, B, C>(f: Curried2<A, B, C>) => <L>(fa: Type2<F, L, A>) => (fb: Type2<F, L, B>) => Type2<F, L, C>
export function liftA2<F extends URIS2, L>(
  F: Apply2C<F, L>
): <A, B, C>(f: Curried2<A, B, C>) => (fa: Type2<F, L, A>) => (fb: Type2<F, L, B>) => Type2<F, L, C>
export function liftA2<F extends URIS>(
  F: Apply1<F>
): <A, B, C>(f: Curried2<A, B, C>) => Curried2<Type<F, A>, Type<F, B>, Type<F, C>>
export function liftA2<F>(F: Apply<F>): <A, B, C>(f: Curried2<A, B, C>) => Curried2<HKT<F, A>, HKT<F, B>, HKT<F, C>>
export function liftA2<F>(F: Apply<F>): <A, B, C>(f: Curried2<A, B, C>) => Curried2<HKT<F, A>, HKT<F, B>, HKT<F, C>> {
  return f => fa => fb => F.ap(F.map(fa, f), fb)
}

/**
 * Lift a function of three arguments to a function which accepts and returns values wrapped with the type constructor
 * `F`
 *
 * @since 1.0.0
 */
export function liftA3<F extends URIS3>(
  F: Apply3<F>
): <A, B, C, D>(
  f: Curried3<A, B, C, D>
) => <U, L>(fa: Type3<F, U, L, A>) => (fb: Type3<F, U, L, B>) => (fc: Type3<F, U, L, C>) => Type3<F, U, L, D>
export function liftA3<F extends URIS3, U, L>(
  F: Apply3C<F, U, L>
): <A, B, C, D>(
  f: Curried3<A, B, C, D>
) => (fa: Type3<F, U, L, A>) => (fb: Type3<F, U, L, B>) => (fc: Type3<F, U, L, C>) => Type3<F, U, L, D>
export function liftA3<F extends URIS2>(
  F: Apply2<F>
): <A, B, C, D>(
  f: Curried3<A, B, C, D>
) => <L>(fa: Type2<F, L, A>) => (fb: Type2<F, L, B>) => (fc: Type2<F, L, C>) => Type2<F, L, D>
export function liftA3<F extends URIS2, L>(
  F: Apply2C<F, L>
): <A, B, C, D>(
  f: Curried3<A, B, C, D>
) => (fa: Type2<F, L, A>) => (fb: Type2<F, L, B>) => (fc: Type2<F, L, C>) => Type2<F, L, D>
export function liftA3<F extends URIS>(
  F: Apply1<F>
): <A, B, C, D>(f: Curried3<A, B, C, D>) => Curried3<Type<F, A>, Type<F, B>, Type<F, C>, Type<F, D>>
export function liftA3<F>(
  F: Apply<F>
): <A, B, C, D>(f: Curried3<A, B, C, D>) => Curried3<HKT<F, A>, HKT<F, B>, HKT<F, C>, HKT<F, D>>
export function liftA3<F>(
  F: Apply<F>
): <A, B, C, D>(f: Curried3<A, B, C, D>) => Curried3<HKT<F, A>, HKT<F, B>, HKT<F, C>, HKT<F, D>> {
  return f => fa => fb => fc => F.ap(F.ap(F.map(fa, f), fb), fc)
}

/**
 * Lift a function of four arguments to a function which accepts and returns values wrapped with the type constructor
 * `F`
 *
 * @since 1.0.0
 */
export function liftA4<F extends URIS3>(
  F: Apply3<F>
): <A, B, C, D, E>(
  f: Curried4<A, B, C, D, E>
) => <U, L>(
  fa: Type3<F, U, L, A>
) => (fb: Type3<F, U, L, B>) => (fc: Type3<F, U, L, C>) => (fd: Type3<F, U, L, D>) => Type3<F, U, L, E>
export function liftA4<F extends URIS3, U, L>(
  F: Apply3C<F, U, L>
): <A, B, C, D, E>(
  f: Curried4<A, B, C, D, E>
) => (
  fa: Type3<F, U, L, A>
) => (fb: Type3<F, U, L, B>) => (fc: Type3<F, U, L, C>) => (fd: Type3<F, U, L, D>) => Type3<F, U, L, E>
export function liftA4<F extends URIS2>(
  F: Apply2<F>
): <A, B, C, D, E>(
  f: Curried4<A, B, C, D, E>
) => <L>(fa: Type2<F, L, A>) => (fb: Type2<F, L, B>) => (fc: Type2<F, L, C>) => (fd: Type2<F, L, D>) => Type2<F, L, E>
export function liftA4<F extends URIS2, L>(
  F: Apply2C<F, L>
): <A, B, C, D, E>(
  f: Curried4<A, B, C, D, E>
) => (fa: Type2<F, L, A>) => (fb: Type2<F, L, B>) => (fc: Type2<F, L, C>) => (fd: Type2<F, L, D>) => Type2<F, L, E>
export function liftA4<F extends URIS>(
  F: Apply1<F>
): <A, B, C, D, E>(f: Curried4<A, B, C, D, E>) => Curried4<Type<F, A>, Type<F, B>, Type<F, C>, Type<F, D>, Type<F, E>>
export function liftA4<F>(
  F: Apply<F>
): <A, B, C, D, E>(f: Curried4<A, B, C, D, E>) => Curried4<HKT<F, A>, HKT<F, B>, HKT<F, C>, HKT<F, D>, HKT<F, E>>
export function liftA4<F>(
  F: Apply<F>
): <A, B, C, D, E>(f: Curried4<A, B, C, D, E>) => Curried4<HKT<F, A>, HKT<F, B>, HKT<F, C>, HKT<F, D>, HKT<F, E>> {
  return f => fa => fb => fc => fd => F.ap(F.ap(F.ap(F.map(fa, f), fb), fc), fd)
}

/**
 * If `F` is a `Apply` and `S` is a `Semigroup` over `A` then `HKT<F, A>` is a `Semigroup` over `A` as well
 *
 * @example
 * import { getSemigroup } from 'fp-ts/lib/Apply'
 * import { option, some, none } from 'fp-ts/lib/Option'
 * import { monoidSum } from 'fp-ts/lib/Monoid'
 *
 * const S = getSemigroup(option, monoidSum)()
 * assert.deepStrictEqual(S.concat(none, none), none)
 * assert.deepStrictEqual(S.concat(some(1), none), none)
 * assert.deepStrictEqual(S.concat(none, some(2)), none)
 * assert.deepStrictEqual(S.concat(some(1), some(2)), some(3))
 *
 * @since 1.4.0
 */
export function getSemigroup<F extends URIS3, A>(
  F: Apply3<F>,
  S: Semigroup<A>
): <U = never, L = never>() => Semigroup<Type3<F, U, L, A>>
export function getSemigroup<F extends URIS3, U, L, A>(
  F: Apply3C<F, U, L>,
  S: Semigroup<A>
): () => Semigroup<Type3<F, U, L, A>>
export function getSemigroup<F extends URIS2, A>(
  F: Apply2<F>,
  S: Semigroup<A>
): <L = never>() => Semigroup<Type2<F, L, A>>
export function getSemigroup<F extends URIS2, L, A>(F: Apply2C<F, L>, S: Semigroup<A>): () => Semigroup<Type2<F, L, A>>
export function getSemigroup<F extends URIS, A>(F: Apply1<F>, S: Semigroup<A>): () => Semigroup<Type<F, A>>
export function getSemigroup<F, A>(F: Apply<F>, S: Semigroup<A>): () => Semigroup<HKT<F, A>>
export function getSemigroup<F, A>(F: Apply<F>, S: Semigroup<A>): () => Semigroup<HKT<F, A>> {
  const concatLifted = liftA2(F)((a: A) => (b: A) => S.concat(a, b))
  return () => ({
    concat: (x, y) => concatLifted(x)(y)
  })
}

const tupleConstructors: { [key: string]: Function1<any, any> } = {}

/**
 * Tuple sequencing, i.e., take a tuple of actions and do them from left-to-right, returning the resulting tuple.
 *
 * @example
 * import { sequenceT } from 'fp-ts/lib/Apply'
 * import { option, some, none } from 'fp-ts/lib/Option'
 *
 * const sequenceTOption = sequenceT(option)
 * assert.deepStrictEqual(sequenceTOption(some(1)), some([1]))
 * assert.deepStrictEqual(sequenceTOption(some(1), some('2')), some([1, '2']))
 * assert.deepStrictEqual(sequenceTOption(some(1), some('2'), none), none)
 *
 * @since 1.5.0
 */
export function sequenceT<F extends URIS3>(
  F: Apply3<F>
): <U, L, T extends Array<Type3<F, U, L, any>>>(
  ...t: T & { 0: Type3<F, U, L, any> }
) => Type3<F, U, L, { [K in keyof T]: T[K] extends Type3<F, U, L, infer A> ? A : never }>
export function sequenceT<F extends URIS3, U, L>(
  F: Apply3C<F, U, L>
): <T extends Array<Type3<F, U, L, any>>>(
  ...t: T & { 0: Type3<F, U, L, any> }
) => Type3<F, U, L, { [K in keyof T]: T[K] extends Type3<F, U, L, infer A> ? A : never }>
export function sequenceT<F extends URIS2>(
  F: Apply2<F>
): <L, T extends Array<Type2<F, L, any>>>(
  ...t: T & { 0: Type2<F, L, any> }
) => Type2<F, L, { [K in keyof T]: T[K] extends Type2<F, L, infer A> ? A : never }>
export function sequenceT<F extends URIS2, L>(
  F: Apply2C<F, L>
): <T extends Array<Type2<F, L, any>>>(
  ...t: T & { 0: Type2<F, L, any> }
) => Type2<F, L, { [K in keyof T]: T[K] extends Type2<F, L, infer A> ? A : never }>
export function sequenceT<F extends URIS>(
  F: Apply1<F>
): <T extends Array<Type<F, any>>>(
  ...t: T & { 0: Type<F, any> }
) => Type<F, { [K in keyof T]: T[K] extends Type<F, infer A> ? A : never }>
export function sequenceT<F>(
  F: Apply<F>
): <T extends Array<HKT<F, any>>>(
  ...t: T & { 0: HKT<F, any> }
) => HKT<F, { [K in keyof T]: T[K] extends HKT<F, infer A> ? A : never }>
export function sequenceT<F>(F: Apply<F>): (...args: Array<any>) => HKT<F, any> {
  return (...args: Array<any>) => {
    const len = args.length
    let f = tupleConstructors[len]
    if (!Boolean(f)) {
      f = tupleConstructors[len] = curried((...args: Array<any>): Array<any> => args, len - 1, [])
    }
    let r = F.map(args[0], f)
    for (let i = 1; i < len; i++) {
      r = F.ap(r, args[i])
    }
    return r
  }
}

type EnforceNonEmptyRecord<R> = keyof R extends never ? never : R

/**
 * Like `Apply.sequenceT` but works with structs instead of tuples.
 *
 * @example
 * import { either, right, left } from 'fp-ts/lib/Either'
 * import { sequenceS } from 'fp-ts/lib/Apply'
 *
 * const ado = sequenceS(either)
 *
 * assert.deepStrictEqual(
 *   ado({
 *     a: right<string, number>(1),
 *     b: right<string, boolean>(true)
 *   }),
 *   right({ a: 1, b: true })
 * )
 * assert.deepStrictEqual(
 *   ado({
 *     a: right<string, number>(1),
 *     b: left<string, number>('error')
 *   }),
 *   left('error')
 * )
 *
 * @since 1.15.0
 */
export function sequenceS<F extends URIS3>(
  F: Apply3<F>
): <U, L, R extends Record<string, Type3<F, U, L, any>>>(
  r: EnforceNonEmptyRecord<R> & Record<string, Type3<F, U, L, any>>
) => Type3<F, U, L, { [K in keyof R]: R[K] extends Type3<F, any, any, infer A> ? A : never }>
export function sequenceS<F extends URIS3, U, L>(
  F: Apply3C<F, U, L>
): <R extends Record<string, Type3<F, U, L, any>>>(
  r: EnforceNonEmptyRecord<R>
) => Type3<F, U, L, { [K in keyof R]: R[K] extends Type3<F, any, any, infer A> ? A : never }>
export function sequenceS<F extends URIS2>(
  F: Apply2<F>
): <L, R extends Record<string, Type2<F, L, any>>>(
  r: EnforceNonEmptyRecord<R> & Record<string, Type2<F, L, any>>
) => Type2<F, L, { [K in keyof R]: R[K] extends Type2<F, any, infer A> ? A : never }>
export function sequenceS<F extends URIS2, L>(
  F: Apply2C<F, L>
): <R extends Record<string, Type2<F, L, any>>>(
  r: EnforceNonEmptyRecord<R>
) => Type2<F, L, { [K in keyof R]: R[K] extends Type2<F, any, infer A> ? A : never }>
export function sequenceS<F extends URIS>(
  F: Apply1<F>
): <R extends Record<string, Type<F, any>>>(
  r: EnforceNonEmptyRecord<R>
) => Type<F, { [K in keyof R]: R[K] extends Type<F, infer A> ? A : never }>
export function sequenceS<F>(F: Apply<F>): (r: Record<string, HKT<F, any>>) => HKT<F, Record<string, any>>
export function sequenceS<F>(F: Apply<F>): (r: Record<string, HKT<F, any>>) => HKT<F, Record<string, any>> {
  return r => {
    const keys = Object.keys(r)
    const fst = keys[0]
    const others = keys.slice(1)
    let fr: HKT<F, Record<string, any>> = F.map(r[fst], a => ({ [fst]: a }))
    for (const key of others) {
      fr = F.ap(
        F.map(fr, r => (a: any) => {
          r[key] = a
          return r
        }),
        r[key]
      )
    }
    return fr
  }
}
