/**
 * @since 2.0.0
 */
import { Apply, Apply1, Apply2 } from './Apply'
import { flow } from './function'
import { Functor, Functor1, Functor2 } from './Functor'
import { HKT, Kind, Kind2, Kind3, URIS, URIS2, URIS3 } from './HKT'
import { Monad, Monad1, Monad2, Monad2C, Monad3 } from './Monad'
import { Pointed, Pointed1, Pointed2 } from './Pointed'
import { Reader } from './Reader'

/**
 * @since 2.10.0
 */
export function of_<M extends URIS2>(M: Pointed2<M>): <A, R, ME>(a: A) => Reader<R, Kind2<M, ME, A>>
export function of_<M extends URIS>(M: Pointed1<M>): <A, R>(a: A) => Reader<R, Kind<M, A>>
export function of_<M>(M: Pointed<M>): <A, R>(a: A) => Reader<R, HKT<M, A>>
export function of_<M>(M: Pointed<M>): <A, R>(a: A) => Reader<R, HKT<M, A>> {
  return (a) => () => M.of(a)
}

/**
 * @since 2.10.0
 */
export function map_<F extends URIS2>(
  F: Functor2<F>
): <A, B>(f: (a: A) => B) => <R, FE>(fa: Reader<R, Kind2<F, FE, A>>) => Reader<R, Kind2<F, FE, B>>
export function map_<F extends URIS>(
  F: Functor1<F>
): <A, B>(f: (a: A) => B) => <R>(fa: Reader<R, Kind<F, A>>) => Reader<R, Kind<F, B>>
export function map_<F>(F: Functor<F>): <A, B>(f: (a: A) => B) => <R>(fa: Reader<R, HKT<F, A>>) => Reader<R, HKT<F, B>>
export function map_<F>(
  F: Functor<F>
): <A, B>(f: (a: A) => B) => <R>(fa: Reader<R, HKT<F, A>>) => Reader<R, HKT<F, B>> {
  return (f) => (fa) => (r) => F.map(fa(r), f)
}

/**
 * @since 2.10.0
 */
export function ap_<F extends URIS2>(
  F: Apply2<F>
): <R, E, A>(
  fa: Reader<R, Kind2<F, E, A>>
) => <B>(fab: Reader<R, Kind2<F, E, (a: A) => B>>) => Reader<R, Kind2<F, E, B>>
export function ap_<F extends URIS>(
  F: Apply1<F>
): <R, A>(fa: Reader<R, Kind<F, A>>) => <B>(fab: Reader<R, Kind<F, (a: A) => B>>) => Reader<R, Kind<F, B>>
export function ap_<F>(
  F: Apply<F>
): <R, A>(fa: Reader<R, HKT<F, A>>) => <B>(fab: Reader<R, HKT<F, (a: A) => B>>) => Reader<R, HKT<F, B>>
export function ap_<F>(
  F: Apply<F>
): <R, A>(fa: Reader<R, HKT<F, A>>) => <B>(fab: Reader<R, HKT<F, (a: A) => B>>) => Reader<R, HKT<F, B>> {
  return (fa) => (fab) => (r) => F.ap(fab(r), fa(r))
}

/**
 * @since 2.10.0
 */
export function chain_<M extends URIS2>(
  M: Monad2<M>
): <A, R, E, B>(f: (a: A) => Reader<R, Kind2<M, E, B>>) => (ma: Reader<R, Kind2<M, E, A>>) => Reader<R, Kind2<M, E, B>>
export function chain_<M extends URIS>(
  M: Monad1<M>
): <A, R, B>(f: (a: A) => Reader<R, Kind<M, B>>) => (ma: Reader<R, Kind<M, A>>) => Reader<R, Kind<M, B>>
export function chain_<M>(
  M: Monad<M>
): <A, R, B>(f: (a: A) => Reader<R, HKT<M, B>>) => (ma: Reader<R, HKT<M, A>>) => Reader<R, HKT<M, B>>
export function chain_<M>(
  M: Monad<M>
): <A, R, B>(f: (a: A) => Reader<R, HKT<M, B>>) => (ma: Reader<R, HKT<M, A>>) => Reader<R, HKT<M, B>> {
  return (f) => (ma) => (r) => M.chain(ma(r), (a) => f(a)(r))
}

/**
 * @since 2.10.0
 */
export function ask_<M extends URIS2>(M: Pointed2<M>): <R, E>() => Reader<R, Kind2<M, E, R>>
export function ask_<M extends URIS>(M: Pointed1<M>): <R>() => Reader<R, Kind<M, R>>
export function ask_<M>(M: Pointed<M>): <R>() => Reader<R, HKT<M, R>>
export function ask_<M>(M: Pointed<M>): <R>() => Reader<R, HKT<M, R>> {
  return () => M.of
}

/**
 * @since 2.10.0
 */
export function asks_<M extends URIS2>(M: Pointed2<M>): <R, A, E>(f: (r: R) => A) => Reader<R, Kind2<M, E, A>>
export function asks_<M extends URIS>(M: Pointed1<M>): <R, A>(f: (r: R) => A) => Reader<R, Kind<M, A>>
export function asks_<M>(M: Pointed<M>): <R, A>(f: (r: R) => A) => Reader<R, HKT<M, A>>
export function asks_<M>(M: Pointed<M>): <R, A>(f: (r: R) => A) => Reader<R, HKT<M, A>> {
  return (f) => flow(f, M.of)
}

/**
 * @since 2.10.0
 */
export function fromReader_<M extends URIS2>(M: Pointed2<M>): <R, A, E>(ma: Reader<R, A>) => Reader<R, Kind2<M, E, A>>
export function fromReader_<M extends URIS>(M: Pointed1<M>): <R, A>(ma: Reader<R, A>) => Reader<R, Kind<M, A>>
export function fromReader_<M>(M: Pointed<M>): <R, A>(ma: Reader<R, A>) => Reader<R, HKT<M, A>>
export function fromReader_<M>(M: Pointed<M>): <R, A>(ma: Reader<R, A>) => Reader<R, HKT<M, A>> {
  return (ma) => flow(ma, M.of)
}

// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------

// tslint:disable: deprecation

/**
 * @category model
 * @since 2.0.0
 * @deprecated
 */
export interface ReaderT<M, R, A> {
  (r: R): HKT<M, A>
}

/**
 * @since 2.0.0
 * @deprecated
 */
export interface ReaderM<M> {
  readonly map: <R, A, B>(ma: ReaderT<M, R, A>, f: (a: A) => B) => ReaderT<M, R, B>
  readonly of: <R, A>(a: A) => ReaderT<M, R, A>
  readonly ap: <R, A, B>(mab: ReaderT<M, R, (a: A) => B>, ma: ReaderT<M, R, A>) => ReaderT<M, R, B>
  readonly chain: <R, A, B>(ma: ReaderT<M, R, A>, f: (a: A) => ReaderT<M, R, B>) => ReaderT<M, R, B>
  readonly ask: <R>() => ReaderT<M, R, R>
  readonly asks: <R, A>(f: (r: R) => A) => ReaderT<M, R, A>
  readonly local: <R1, A, R2>(ma: ReaderT<M, R1, A>, f: (d: R2) => R1) => ReaderT<M, R2, A>
  readonly fromReader: <R, A>(ma: Reader<R, A>) => ReaderT<M, R, A>
  readonly fromM: <R, A>(ma: HKT<M, A>) => ReaderT<M, R, A>
}

/**
 * @category model
 * @since 2.0.0
 * @deprecated
 */
export interface ReaderT1<M extends URIS, R, A> {
  (r: R): Kind<M, A>
}

/**
 * @since 2.0.0
 * @deprecated
 */
export interface ReaderM1<M extends URIS> {
  readonly map: <R, A, B>(ma: ReaderT1<M, R, A>, f: (a: A) => B) => ReaderT1<M, R, B>
  readonly of: <R, A>(a: A) => ReaderT1<M, R, A>
  readonly ap: <R, A, B>(mab: ReaderT1<M, R, (a: A) => B>, ma: ReaderT1<M, R, A>) => ReaderT1<M, R, B>
  readonly chain: <R, A, B>(ma: ReaderT1<M, R, A>, f: (a: A) => ReaderT1<M, R, B>) => ReaderT1<M, R, B>
  readonly ask: <R>() => ReaderT1<M, R, R>
  readonly asks: <R, A>(f: (r: R) => A) => ReaderT1<M, R, A>
  readonly local: <R1, A, R2>(ma: ReaderT1<M, R1, A>, f: (d: R2) => R1) => ReaderT1<M, R2, A>
  readonly fromReader: <R, A>(ma: Reader<R, A>) => ReaderT1<M, R, A>
  readonly fromM: <R, A>(ma: Kind<M, A>) => ReaderT1<M, R, A>
}

/**
 * @category model
 * @since 2.0.0
 * @deprecated
 */
export interface ReaderT2<M extends URIS2, R, E, A> {
  (r: R): Kind2<M, E, A>
}

/**
 * @since 2.0.0
 * @deprecated
 */
export interface ReaderM2<M extends URIS2> {
  readonly map: <R, E, A, B>(ma: ReaderT2<M, R, E, A>, f: (a: A) => B) => ReaderT2<M, R, E, B>
  readonly of: <R, E, A>(a: A) => ReaderT2<M, R, E, A>
  readonly ap: <R, E, A, B>(mab: ReaderT2<M, R, E, (a: A) => B>, ma: ReaderT2<M, R, E, A>) => ReaderT2<M, R, E, B>
  readonly chain: <R, E, A, B>(ma: ReaderT2<M, R, E, A>, f: (a: A) => ReaderT2<M, R, E, B>) => ReaderT2<M, R, E, B>
  readonly ask: <R, E>() => ReaderT2<M, R, E, R>
  readonly asks: <R, E, A>(f: (r: R) => A) => ReaderT2<M, R, E, A>
  readonly local: <R1, E, A, R2>(ma: ReaderT2<M, R1, E, A>, f: (d: R2) => R1) => ReaderT2<M, R2, E, A>
  readonly fromReader: <R, E, A>(ma: Reader<R, A>) => ReaderT2<M, R, E, A>
  readonly fromM: <R, E, A>(ma: Kind2<M, E, A>) => ReaderT2<M, R, E, A>
}

/**
 * @since 2.2.0
 * @deprecated
 */
export interface ReaderM2C<M extends URIS2, E> {
  readonly map: <R, A, B>(ma: ReaderT2<M, R, E, A>, f: (a: A) => B) => ReaderT2<M, R, E, B>
  readonly of: <R, A>(a: A) => ReaderT2<M, R, E, A>
  readonly ap: <R, A, B>(mab: ReaderT2<M, R, E, (a: A) => B>, ma: ReaderT2<M, R, E, A>) => ReaderT2<M, R, E, B>
  readonly chain: <R, A, B>(ma: ReaderT2<M, R, E, A>, f: (a: A) => ReaderT2<M, R, E, B>) => ReaderT2<M, R, E, B>
  readonly ask: <R>() => ReaderT2<M, R, E, R>
  readonly asks: <R, A>(f: (r: R) => A) => ReaderT2<M, R, E, A>
  readonly local: <R1, A, R2>(ma: ReaderT2<M, R1, E, A>, f: (d: R2) => R1) => ReaderT2<M, R2, E, A>
  readonly fromReader: <R, A>(ma: Reader<R, A>) => ReaderT2<M, R, E, A>
  readonly fromM: <R, A>(ma: Kind2<M, E, A>) => ReaderT2<M, R, E, A>
}

/**
 * @since 2.0.0
 * @deprecated
 */
export interface ReaderT3<M extends URIS3, R, U, E, A> {
  (r: R): Kind3<M, U, E, A>
}

/**
 * @since 2.0.0
 * @deprecated
 */
export interface ReaderM3<M extends URIS3> {
  readonly map: <R, U, E, A, B>(ma: ReaderT3<M, R, U, E, A>, f: (a: A) => B) => ReaderT3<M, R, U, E, B>
  readonly of: <R, U, E, A>(a: A) => ReaderT3<M, R, U, E, A>
  readonly ap: <R, U, E, A, B>(
    mab: ReaderT3<M, R, U, E, (a: A) => B>,
    ma: ReaderT3<M, R, U, E, A>
  ) => ReaderT3<M, R, U, E, B>
  readonly chain: <R, U, E, A, B>(
    ma: ReaderT3<M, R, U, E, A>,
    f: (a: A) => ReaderT3<M, R, U, E, B>
  ) => ReaderT3<M, R, U, E, B>
  readonly ask: <R, U, E>() => ReaderT3<M, R, U, E, R>
  readonly asks: <R, U, E, A>(f: (r: R) => A) => ReaderT3<M, R, U, E, A>
  readonly local: <R1, U, E, A, R2>(ma: ReaderT3<M, R1, U, E, A>, f: (d: R2) => R1) => ReaderT3<M, R2, U, E, A>
  readonly fromReader: <R, U, E, A>(ma: Reader<R, A>) => ReaderT3<M, R, U, E, A>
  readonly fromM: <R, U, E, A>(ma: Kind3<M, U, E, A>) => ReaderT3<M, R, U, E, A>
}

/**
 * @since 2.0.0
 * @deprecated
 */
export function getReaderM<M extends URIS3>(M: Monad3<M>): ReaderM3<M>
/** @deprecated */
export function getReaderM<M extends URIS2>(M: Monad2<M>): ReaderM2<M>
/** @deprecated */
export function getReaderM<M extends URIS2, E>(M: Monad2C<M, E>): ReaderM2C<M, E>
/** @deprecated */
export function getReaderM<M extends URIS>(M: Monad1<M>): ReaderM1<M>
/** @deprecated */
export function getReaderM<M>(M: Monad<M>): ReaderM<M>
/** @deprecated */
export function getReaderM<M>(M: Monad<M>): ReaderM<M> {
  return {
    map: (ma, f) => (r) => M.map(ma(r), f),
    of: (a) => () => M.of(a),
    ap: (mab, ma) => (r) => M.ap(mab(r), ma(r)),
    chain: (ma, f) => (r) => M.chain(ma(r), (a) => f(a)(r)),
    ask: () => M.of,
    asks: (f) => (r) => M.map(M.of(r), f),
    local: (ma, f) => (q) => ma(f(q)),
    fromReader: (ma) => (r) => M.of(ma(r)),
    fromM: (ma) => () => ma
  }
}
