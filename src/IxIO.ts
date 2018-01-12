import { Monad } from './Monad'
import { IxMonad, FantasyIxMonad } from './IxMonad'
import { IO } from './IO'
import * as io from './IO'

declare module './HKT' {
  interface URI2HKT3<U, L, A> {
    IxIO: IxIO<U, L, A>
  }
}

export const URI = 'IxIO'

export type URI = typeof URI

/**
 * @data
 * @constructor IxIO
 */
export class IxIO<I, O, A> implements FantasyIxMonad<URI, A, O, I> {
  // prettier-ignore
  readonly '_A': A
  // prettier-ignore
  readonly '_L': O
  // prettier-ignore
  readonly '_U': I
  // prettier-ignore
  readonly '_URI': URI
  constructor(readonly value: IO<A>) {}
  run(): A {
    return this.value.run()
  }
  ichain<Z, B>(f: (a: A) => IxIO<O, Z, B>): IxIO<I, Z, B> {
    return new IxIO<I, Z, B>(this.value.chain(a => f(a).value))
  }
  map<B>(f: (a: A) => B): IxIO<I, O, B> {
    return new IxIO<I, O, B>(this.value.map(f))
  }
  ap<B>(fab: IxIO<I, I, (a: A) => B>): IxIO<I, I, B> {
    return new IxIO<I, I, B>(this.value.ap(fab.value))
  }
  chain<B>(f: (a: A) => IxIO<I, I, B>): IxIO<I, I, B> {
    return new IxIO<I, I, B>(this.value.chain(a => f(a).value))
  }
}

/** @function */
export const iof = <I, A>(a: A): IxIO<I, I, A> => {
  return new IxIO<I, I, A>(io.of(a))
}

/** @function */
export const ichain = <I, O, Z, A, B>(f: (a: A) => IxIO<O, Z, B>, fa: IxIO<I, O, A>): IxIO<I, Z, B> => {
  return fa.ichain(f)
}

/** @function */
export const map = <I, A, B>(f: (a: A) => B, fa: IxIO<I, I, A>): IxIO<I, I, B> => {
  return fa.map(f)
}

/**
 * @function
 * @alias iof
 */
export const of = iof

/** @function */
export const ap = <I, A, B>(fab: IxIO<I, I, (a: A) => B>, fa: IxIO<I, I, A>): IxIO<I, I, B> => {
  return fa.ap(fab)
}

/** @function */
export const chain = <I, A, B>(f: (a: A) => IxIO<I, I, B>, fa: IxIO<I, I, A>): IxIO<I, I, B> => {
  return fa.chain(f)
}

/** @instance */
export const ixIO: Monad<URI> & IxMonad<URI> = {
  URI,
  map,
  of,
  ap,
  chain,
  iof,
  ichain
}
