/**
 * @since 2.0.0
 */
import { Alt1 } from './Alt'
import { Applicative as ApplicativeHKT, Applicative1 } from './Applicative'
import { Apply1, apS_ } from './Apply'
import { ChainRec1, tailRec } from './ChainRec'
import { Comonad1 } from './Comonad'
import { Eq } from './Eq'
import { Extend1 } from './Extend'
import { Foldable1 } from './Foldable'
import { bind_, flow, identity as id, pipe } from './function'
import { bindTo_, Functor1 } from './Functor'
import { HKT } from './HKT'
import { Monad1 } from './Monad'
import { Monoid } from './Monoid'
import { Show } from './Show'
import { PipeableTraverse1, Traversable1 } from './Traversable'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 2.0.0
 */
export type Identity<A> = A

// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------

const _map: Monad1<URI>['map'] = (fa, f) => pipe(fa, map(f))
const _ap: Monad1<URI>['ap'] = (fab, fa) => pipe(fab, ap(fa))
const _chain: Monad1<URI>['chain'] = (ma, f) => pipe(ma, chain(f))
/* istanbul ignore next */
const _reduce: Foldable1<URI>['reduce'] = (fa, b, f) => pipe(fa, reduce(b, f))
/* istanbul ignore next */
const _foldMap: Foldable1<URI>['foldMap'] = (M) => (fa, f) => pipe(fa, foldMap(M)(f))
/* istanbul ignore next */
const _reduceRight: Foldable1<URI>['reduceRight'] = (fa, b, f) => pipe(fa, reduceRight(b, f))
/* istanbul ignore next */
const _alt: Alt1<URI>['alt'] = (fa, that) => pipe(fa, alt(that))
/* istanbul ignore next */
const _extend: Extend1<URI>['extend'] = (wa, f) => pipe(wa, extend(f))
/* istanbul ignore next */
const _traverse = <F>(
  F: ApplicativeHKT<F>
): (<A, B>(ta: Identity<A>, f: (a: A) => HKT<F, B>) => HKT<F, Identity<B>>) => {
  const traverseF = traverse(F)
  return (ta, f) => pipe(ta, traverseF(f))
}
const _chainRec: ChainRec1<URI>['chainRec'] = tailRec

// -------------------------------------------------------------------------------------
// pipeables
// -------------------------------------------------------------------------------------

/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.0.0
 */
export const map: <A, B>(f: (a: A) => B) => (fa: Identity<A>) => Identity<B> = (f) => (fa) => f(fa)

/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.0.0
 */
export const ap: <A>(fa: Identity<A>) => <B>(fab: Identity<(a: A) => B>) => Identity<B> = (fa) => (fab) => fab(fa)

/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
export const apFirst: <B>(fb: Identity<B>) => <A>(fa: Identity<A>) => Identity<A> = (fb) =>
  flow(
    map((a) => () => a),
    ap(fb)
  )

/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
export const apSecond = <B>(fb: Identity<B>): (<A>(fa: Identity<A>) => Identity<B>) =>
  flow(
    map(() => (b: B) => b),
    ap(fb)
  )

/**
 * Wrap a value into the type constructor.
 *
 * @category Applicative
 * @since 2.0.0
 */
export const of: Applicative1<URI>['of'] = id

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.0.0
 */
export const chain: <A, B>(f: (a: A) => Identity<B>) => (ma: Identity<A>) => Identity<B> = (f) => (ma) => f(ma)

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Monad`.
 *
 * @category combinators
 * @since 2.0.0
 */
export const chainFirst: <A, B>(f: (a: A) => Identity<B>) => (ma: Identity<A>) => Identity<A> = (f) =>
  chain((a) =>
    pipe(
      f(a),
      map(() => a)
    )
  )

/**
 * @category Extend
 * @since 2.0.0
 */
export const extend: <A, B>(f: (wa: Identity<A>) => B) => (wa: Identity<A>) => Identity<B> = (f) => (wa) => f(wa)

/**
 * @category Extract
 * @since 2.6.2
 */
export const extract: <A>(wa: Identity<A>) => A = id

/**
 * Derivable from `Extend`.
 *
 * @category combinators
 * @since 2.0.0
 */
export const duplicate: <A>(ma: Identity<A>) => Identity<Identity<A>> =
  /*#__PURE__*/
  extend(id)

/**
 * Derivable from `Monad`.
 *
 * @category combinators
 * @since 2.0.0
 */
export const flatten: <A>(mma: Identity<Identity<A>>) => Identity<A> =
  /*#__PURE__*/
  chain(id)

/**
 * @category Foldable
 * @since 2.0.0
 */
export const reduce: <A, B>(b: B, f: (b: B, a: A) => B) => (fa: Identity<A>) => B = (b, f) => (fa) => f(b, fa)

/**
 * @category Foldable
 * @since 2.0.0
 */
export const foldMap: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => (fa: Identity<A>) => M = () => (f) => (fa) => f(fa)

/**
 * @category Foldable
 * @since 2.0.0
 */
export const reduceRight: <A, B>(b: B, f: (a: A, b: B) => B) => (fa: Identity<A>) => B = (b, f) => (fa) => f(fa, b)

/**
 * @since 2.6.3
 */
export const traverse: PipeableTraverse1<URI> = <F>(
  F: ApplicativeHKT<F>
): (<A, B>(f: (a: A) => HKT<F, B>) => (ta: Identity<A>) => HKT<F, Identity<B>>) => (f) => (ta) => F.map(f(ta), id)

/**
 * @since 2.6.3
 */
export const sequence: Traversable1<URI>['sequence'] = <F>(F: ApplicativeHKT<F>) => <A>(
  ta: Identity<HKT<F, A>>
): HKT<F, Identity<A>> => {
  return F.map(ta, id)
}

/**
 * Less strict version of [`alt`](#alt).
 *
 * @category Alt
 * @since 2.9.0
 */
export const altW: <B>(that: () => Identity<B>) => <A>(fa: Identity<A>) => Identity<A | B> = () => id

/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category Alt
 * @since 2.0.0
 */
export const alt: <A>(that: () => Identity<A>) => (fa: Identity<A>) => Identity<A> = altW

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @category instances
 * @since 2.0.0
 */
export const URI = 'Identity'

/**
 * @category instances
 * @since 2.0.0
 */
export type URI = typeof URI

declare module './HKT' {
  interface URItoKind<A> {
    readonly [URI]: Identity<A>
  }
}

/**
 * @category instances
 * @since 2.0.0
 */
export const getShow: <A>(S: Show<A>) => Show<Identity<A>> = id

/**
 * @category instances
 * @since 2.0.0
 */
export const getEq: <A>(E: Eq<A>) => Eq<Identity<A>> = id

/**
 * @category instances
 * @since 2.7.0
 */
export const Functor: Functor1<URI> = {
  URI,
  map: _map
}

/**
 * @category instances
 * @since 2.10.0
 */
export const Apply: Apply1<URI> = {
  URI,
  map: _map,
  ap: _ap
}

/**
 * @category instances
 * @since 2.7.0
 */
export const Applicative: Applicative1<URI> = {
  URI,
  map: _map,
  ap: _ap,
  of
}

/**
 * @category instances
 * @since 2.7.0
 */
export const Monad: Monad1<URI> = {
  URI,
  map: _map,
  ap: _ap,
  of,
  chain: _chain
}

/**
 * @category instances
 * @since 2.7.0
 */
export const Foldable: Foldable1<URI> = {
  URI,
  reduce: _reduce,
  foldMap: _foldMap,
  reduceRight: _reduceRight
}

/**
 * @category instances
 * @since 2.7.0
 */
export const Traversable: Traversable1<URI> = {
  URI,
  map: _map,
  reduce: _reduce,
  foldMap: _foldMap,
  reduceRight: _reduceRight,
  traverse: _traverse,
  sequence
}

/**
 * @category instances
 * @since 2.7.0
 */
export const Alt: Alt1<URI> = {
  URI,
  map: _map,
  alt: _alt
}

/**
 * @category instances
 * @since 2.7.0
 */
export const Comonad: Comonad1<URI> = {
  URI,
  map: _map,
  extend: _extend,
  extract
}

/**
 * @category instances
 * @since 2.7.0
 */
export const ChainRec: ChainRec1<URI> = {
  URI,
  map: _map,
  ap: _ap,
  chain: _chain,
  chainRec: _chainRec
}

// TODO: remove in v3
/**
 * @category instances
 * @since 2.0.0
 */
export const identity: Monad1<URI> & Foldable1<URI> & Traversable1<URI> & Alt1<URI> & Comonad1<URI> & ChainRec1<URI> = {
  URI,
  map: _map,
  ap: _ap,
  of,
  chain: _chain,
  reduce: _reduce,
  foldMap: _foldMap,
  reduceRight: _reduceRight,
  traverse: _traverse,
  sequence,
  alt: _alt,
  extract,
  extend: _extend,
  chainRec: _chainRec
}

// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------

/**
 * @since 2.9.0
 */
export const Do: Identity<{}> =
  /*#__PURE__*/
  of({})

/**
 * @since 2.8.0
 */
export const bindTo =
  /*#__PURE__*/
  bindTo_(Functor)

/**
 * @since 2.8.0
 */
export const bind = <N extends string, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Identity<B>
): ((fa: Identity<A>) => Identity<{ [K in keyof A | N]: K extends keyof A ? A[K] : B }>) =>
  chain((a) =>
    pipe(
      f(a),
      map((b) => bind_(a, name, b))
    )
  )

// -------------------------------------------------------------------------------------
// pipeable sequence S
// -------------------------------------------------------------------------------------

/**
 * @since 2.8.0
 */
export const apS =
  /*#__PURE__*/
  apS_(Apply)
