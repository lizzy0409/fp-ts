/**
 * The `Applicative` type class extends the `Apply` type class with a `of` function, which can be used to create values
 * of type `f a` from values of type `a`.
 *
 * Where `Apply` provides the ability to lift functions of two or more arguments to functions whose arguments are
 * wrapped using `f`, and `Functor` provides the ability to lift functions of one argument, `pure` can be seen as the
 * function which lifts functions of _zero_ arguments. That is, `Applicative` functors support a lifting operation for
 * any number of function arguments.
 *
 * Instances must satisfy the following laws in addition to the `Apply` laws:
 *
 * 1. Identity: `A.ap(A.of(a => a), fa) <-> fa`
 * 2. Homomorphism: `A.ap(A.of(ab), A.of(a)) <-> A.of(ab(a))`
 * 3. Interchange: `A.ap(fab, A.of(a)) <-> A.ap(A.of(ab => ab(a)), fab)`
 *
 * Note. `Functor`'s `map` can be derived: `A.map(x, f) = A.ap(A.of(f), x)`
 *
 * @since 2.0.0
 */
import { Apply, Apply1, Apply2, Apply2C, Apply3, Apply3C, Apply4, ap_, getApplySemigroup } from './Apply'
import { pipe } from './function'
import {
  FunctorComposition,
  FunctorComposition11,
  FunctorComposition12,
  FunctorComposition12C,
  FunctorComposition21,
  FunctorComposition22,
  FunctorComposition22C,
  FunctorComposition2C1,
  FunctorCompositionHKT1,
  FunctorCompositionHKT2,
  FunctorCompositionHKT2C,
  getFunctorComposition
} from './Functor'
import { HKT, Kind, Kind2, Kind3, Kind4, URIS, URIS2, URIS3, URIS4 } from './HKT'
import { Monoid } from './Monoid'
import { Pointed, Pointed1, Pointed2, Pointed2C, Pointed3, Pointed3C, Pointed4 } from './Pointed'

/**
 * @category type classes
 * @since 2.0.0
 */
export interface Applicative<F> extends Apply<F>, Pointed<F> {}

/**
 * @category type classes
 * @since 2.0.0
 */
export interface Applicative1<F extends URIS> extends Apply1<F>, Pointed1<F> {}

/**
 * @category type classes
 * @since 2.0.0
 */
export interface Applicative2<F extends URIS2> extends Apply2<F>, Pointed2<F> {}

/**
 * @category type classes
 * @since 2.0.0
 */
export interface Applicative2C<F extends URIS2, E> extends Apply2C<F, E>, Pointed2C<F, E> {}

/**
 * @category type classes
 * @since 2.0.0
 */
export interface Applicative3<F extends URIS3> extends Apply3<F>, Pointed3<F> {}

/**
 * @category type classes
 * @since 2.2.0
 */
export interface Applicative3C<F extends URIS3, E> extends Apply3C<F, E>, Pointed3C<F, E> {}

/**
 * @category type classes
 * @since 2.0.0
 */
export interface Applicative4<F extends URIS4> extends Apply4<F>, Pointed4<F> {}

/**
 * Lift a monoid into 'F', the inner values are concatenated using the provided `Monoid`.
 *
 * @since 2.10.0
 */
export function getApplicativeMonoid<F extends URIS4>(
  F: Applicative4<F>
): <A, S, R, E>(M: Monoid<A>) => Monoid<Kind4<F, S, R, E, A>>
export function getApplicativeMonoid<F extends URIS3>(
  F: Applicative3<F>
): <A, R, E>(M: Monoid<A>) => Monoid<Kind3<F, R, E, A>>
export function getApplicativeMonoid<F extends URIS3, E>(
  F: Applicative3C<F, E>
): <A, R>(S: Monoid<A>) => Monoid<Kind3<F, R, E, A>>
export function getApplicativeMonoid<F extends URIS2>(
  F: Applicative2<F>
): <A, E>(M: Monoid<A>) => Monoid<Kind2<F, E, A>>
export function getApplicativeMonoid<F extends URIS2, E>(
  F: Applicative2C<F, E>
): <A>(M: Monoid<A>) => Monoid<Kind2<F, E, A>>
export function getApplicativeMonoid<F extends URIS>(F: Applicative1<F>): <A>(M: Monoid<A>) => Monoid<Kind<F, A>>
export function getApplicativeMonoid<F>(F: Applicative<F>): <A>(M: Monoid<A>) => Monoid<HKT<F, A>>
export function getApplicativeMonoid<F>(F: Applicative<F>): <A>(M: Monoid<A>) => Monoid<HKT<F, A>> {
  const f = getApplySemigroup(F)
  return <A>(M: Monoid<A>) => ({
    concat: f(M).concat,
    empty: F.of(M.empty)
  })
}

// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------

/**
 * @since 2.0.0
 * @deprecated
 */
// tslint:disable-next-line: deprecation
export interface ApplicativeComposition<F, G> extends FunctorComposition<F, G> {
  readonly of: <A>(a: A) => HKT<F, HKT<G, A>>
  readonly ap: <A, B>(fgab: HKT<F, HKT<G, (a: A) => B>>, fga: HKT<F, HKT<G, A>>) => HKT<F, HKT<G, B>>
}

/**
 * @since 2.0.0
 * @deprecated
 */
// tslint:disable-next-line: deprecation
export interface ApplicativeCompositionHKT1<F, G extends URIS> extends FunctorCompositionHKT1<F, G> {
  readonly of: <A>(a: A) => HKT<F, Kind<G, A>>
  readonly ap: <A, B>(fgab: HKT<F, Kind<G, (a: A) => B>>, fga: HKT<F, Kind<G, A>>) => HKT<F, Kind<G, B>>
}

/**
 * @since 2.0.0
 * @deprecated
 */
// tslint:disable-next-line: deprecation
export interface ApplicativeCompositionHKT2<F, G extends URIS2> extends FunctorCompositionHKT2<F, G> {
  readonly of: <E, A>(a: A) => HKT<F, Kind2<G, E, A>>
  readonly ap: <E, A, B>(fgab: HKT<F, Kind2<G, E, (a: A) => B>>, fga: HKT<F, Kind2<G, E, A>>) => HKT<F, Kind2<G, E, B>>
}

/**
 * @since 2.0.0
 * @deprecated
 */
// tslint:disable-next-line: deprecation
export interface ApplicativeCompositionHKT2C<F, G extends URIS2, E> extends FunctorCompositionHKT2C<F, G, E> {
  readonly of: <A>(a: A) => HKT<F, Kind2<G, E, A>>
  readonly ap: <A, B>(fgab: HKT<F, Kind2<G, E, (a: A) => B>>, fga: HKT<F, Kind2<G, E, A>>) => HKT<F, Kind2<G, E, B>>
}

/**
 * @since 2.0.0
 * @deprecated
 */
// tslint:disable-next-line: deprecation
export interface ApplicativeComposition11<F extends URIS, G extends URIS> extends FunctorComposition11<F, G> {
  readonly of: <A>(a: A) => Kind<F, Kind<G, A>>
  readonly ap: <A, B>(fgab: Kind<F, Kind<G, (a: A) => B>>, fga: Kind<F, Kind<G, A>>) => Kind<F, Kind<G, B>>
}

/**
 * @since 2.0.0
 * @deprecated
 */
// tslint:disable-next-line: deprecation
export interface ApplicativeComposition12<F extends URIS, G extends URIS2> extends FunctorComposition12<F, G> {
  readonly of: <E, A>(a: A) => Kind<F, Kind2<G, E, A>>
  readonly ap: <E, A, B>(
    fgab: Kind<F, Kind2<G, E, (a: A) => B>>,
    fga: Kind<F, Kind2<G, E, A>>
  ) => Kind<F, Kind2<G, E, B>>
}

/**
 * @since 2.0.0
 * @deprecated
 */
// tslint:disable-next-line: deprecation
export interface ApplicativeComposition12C<F extends URIS, G extends URIS2, E> extends FunctorComposition12C<F, G, E> {
  readonly of: <A>(a: A) => Kind<F, Kind2<G, E, A>>
  readonly ap: <A, B>(fgab: Kind<F, Kind2<G, E, (a: A) => B>>, fga: Kind<F, Kind2<G, E, A>>) => Kind<F, Kind2<G, E, B>>
}

/**
 * @since 2.0.0
 * @deprecated
 */
// tslint:disable-next-line: deprecation
export interface ApplicativeComposition21<F extends URIS2, G extends URIS> extends FunctorComposition21<F, G> {
  readonly of: <E, A>(a: A) => Kind2<F, E, Kind<G, A>>
  readonly ap: <E, A, B>(
    fgab: Kind2<F, E, Kind<G, (a: A) => B>>,
    fga: Kind2<F, E, Kind<G, A>>
  ) => Kind2<F, E, Kind<G, B>>
}

/**
 * @since 2.0.0
 * @deprecated
 */
// tslint:disable-next-line: deprecation
export interface ApplicativeComposition2C1<F extends URIS2, G extends URIS, E> extends FunctorComposition2C1<F, G, E> {
  readonly of: <A>(a: A) => Kind2<F, E, Kind<G, A>>
  readonly ap: <A, B>(fgab: Kind2<F, E, Kind<G, (a: A) => B>>, fga: Kind2<F, E, Kind<G, A>>) => Kind2<F, E, Kind<G, B>>
}

/**
 * @since 2.0.0
 * @deprecated
 */
// tslint:disable-next-line: deprecation
export interface ApplicativeComposition22<F extends URIS2, G extends URIS2> extends FunctorComposition22<F, G> {
  readonly of: <FE, GE, A>(a: A) => Kind2<F, FE, Kind2<G, GE, A>>
  readonly ap: <FE, GE, A, B>(
    fgab: Kind2<F, FE, Kind2<G, GE, (a: A) => B>>,
    fga: Kind2<F, FE, Kind2<G, GE, A>>
  ) => Kind2<F, FE, Kind2<G, GE, B>>
}

/**
 * @since 2.0.0
 * @deprecated
 */
// tslint:disable-next-line: deprecation
export interface ApplicativeComposition22C<F extends URIS2, G extends URIS2, E> extends FunctorComposition22C<F, G, E> {
  readonly of: <FE, A>(a: A) => Kind2<F, FE, Kind2<G, E, A>>
  readonly ap: <FE, A, B>(
    fgab: Kind2<F, FE, Kind2<G, E, (a: A) => B>>,
    fga: Kind2<F, FE, Kind2<G, E, A>>
  ) => Kind2<F, FE, Kind2<G, E, B>>
}

/**
 * Like `Functor`, `Applicative`s compose. If `F` and `G` have `Applicative` instances, then so does `F<G<_>>`
 *
 * @example
 * import { getApplicativeComposition } from 'fp-ts/Applicative'
 * import { option, Option, some } from 'fp-ts/Option'
 * import { task, Task } from 'fp-ts/Task'
 *
 * // an Applicative instance for Task<Option<A>>
 * const A = getApplicativeComposition(task, option)
 *
 * const x: Task<Option<number>> = task.of(some(1))
 * const y: Task<Option<number>> = task.of(some(2))
 *
 * const sum = (a: number) => (b: number): number => a + b
 *
 * A.ap(A.map(x, sum), y)()
 *   .then(result => assert.deepStrictEqual(result, some(3)))
 *
 * @since 2.0.0
 * @deprecated
 */
export function getApplicativeComposition<F extends URIS2, G extends URIS2, E>(
  F: Applicative2<F>,
  G: Applicative2C<G, E>
  // tslint:disable-next-line: deprecation
): ApplicativeComposition22C<F, G, E>
/** @deprecated */
export function getApplicativeComposition<F extends URIS2, G extends URIS2>(
  F: Applicative2<F>,
  G: Applicative2<G>
  // tslint:disable-next-line: deprecation
): ApplicativeComposition22<F, G>
/** @deprecated */
export function getApplicativeComposition<F extends URIS2, G extends URIS2, E>(
  F: Applicative2<F>,
  G: Applicative2C<G, E>
  // tslint:disable-next-line: deprecation
): ApplicativeComposition22C<F, G, E>
/** @deprecated */
export function getApplicativeComposition<F extends URIS2, G extends URIS>(
  F: Applicative2<F>,
  G: Applicative1<G>
  // tslint:disable-next-line: deprecation
): ApplicativeComposition21<F, G>
/** @deprecated */
export function getApplicativeComposition<F extends URIS, G extends URIS2>(
  F: Applicative1<F>,
  G: Applicative2<G>
  // tslint:disable-next-line: deprecation
): ApplicativeComposition12<F, G>
/** @deprecated */
export function getApplicativeComposition<F extends URIS, G extends URIS2, E>(
  F: Applicative1<F>,
  G: Applicative2C<G, E>
  // tslint:disable-next-line: deprecation
): ApplicativeComposition12C<F, G, E>
/** @deprecated */
export function getApplicativeComposition<F extends URIS, G extends URIS>(
  F: Applicative1<F>,
  G: Applicative1<G>
  // tslint:disable-next-line: deprecation
): ApplicativeComposition11<F, G>
/** @deprecated */
export function getApplicativeComposition<F, G extends URIS2>(
  F: Applicative<F>,
  G: Applicative2<G>
  // tslint:disable-next-line: deprecation
): ApplicativeCompositionHKT2<F, G>
/** @deprecated */
export function getApplicativeComposition<F, G extends URIS2, E>(
  F: Applicative<F>,
  G: Applicative2C<G, E>
  // tslint:disable-next-line: deprecation
): ApplicativeCompositionHKT2C<F, G, E>
/** @deprecated */
export function getApplicativeComposition<F, G extends URIS>(
  F: Applicative<F>,
  G: Applicative1<G>
  // tslint:disable-next-line: deprecation
): ApplicativeCompositionHKT1<F, G>
/** @deprecated */
// tslint:disable-next-line: deprecation
export function getApplicativeComposition<F, G>(F: Applicative<F>, G: Applicative<G>): ApplicativeComposition<F, G>
/** @deprecated */
// tslint:disable-next-line: deprecation
export function getApplicativeComposition<F, G>(F: Applicative<F>, G: Applicative<G>): ApplicativeComposition<F, G> {
  // tslint:disable-next-line: deprecation
  const map = getFunctorComposition(F, G).map
  const ap = ap_(F, G)
  return {
    map,
    of: (a) => F.of(G.of(a)),
    ap: (fgab, fga) => pipe(fgab, ap(fga))
  }
}
