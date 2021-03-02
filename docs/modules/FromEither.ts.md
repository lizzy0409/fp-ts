---
title: FromEither.ts
nav_order: 34
parent: Modules
---

## FromEither overview

The `FromEither` type class represents those data types which support errors.

Added in v2.10.0

---

<h2 class="text-delta">Table of contents</h2>

- [type classes](#type-classes)
  - [FromEither (interface)](#fromeither-interface)
  - [FromEither1 (interface)](#fromeither1-interface)
  - [FromEither2 (interface)](#fromeither2-interface)
  - [FromEither2C (interface)](#fromeither2c-interface)
  - [FromEither3 (interface)](#fromeither3-interface)
  - [FromEither3C (interface)](#fromeither3c-interface)
  - [FromEither4 (interface)](#fromeither4-interface)
- [utils](#utils)
  - [fromOption\_](#fromoption_)
  - [fromPredicate\_](#frompredicate_)

---

# type classes

## FromEither (interface)

**Signature**

```ts
export interface FromEither<F> {
  readonly URI: F
  readonly fromEither: <E, A>(e: Either<E, A>) => HKT2<F, E, A>
}
```

Added in v2.10.0

## FromEither1 (interface)

**Signature**

```ts
export interface FromEither1<F extends URIS> {
  readonly URI: F
  readonly fromEither: <E, A>(e: Either<E, A>) => Kind<F, A>
}
```

Added in v2.10.0

## FromEither2 (interface)

**Signature**

```ts
export interface FromEither2<F extends URIS2> {
  readonly URI: F
  readonly fromEither: <E, A>(e: Either<E, A>) => Kind2<F, E, A>
}
```

Added in v2.10.0

## FromEither2C (interface)

**Signature**

```ts
export interface FromEither2C<F extends URIS2, E> {
  readonly URI: F
  readonly _E?: E
  readonly fromEither: <A>(e: Either<E, A>) => Kind2<F, E, A>
}
```

Added in v2.10.0

## FromEither3 (interface)

**Signature**

```ts
export interface FromEither3<F extends URIS3> {
  readonly URI: F
  readonly fromEither: <R, E, A>(e: Either<E, A>) => Kind3<F, R, E, A>
}
```

Added in v2.10.0

## FromEither3C (interface)

**Signature**

```ts
export interface FromEither3C<F extends URIS3, E> {
  readonly URI: F
  readonly _E?: E
  readonly fromEither: <R, A>(e: Either<E, A>) => Kind3<F, R, E, A>
}
```

Added in v2.10.0

## FromEither4 (interface)

**Signature**

```ts
export interface FromEither4<F extends URIS4> {
  readonly URI: F
  readonly fromEither: <S, R, E, A>(e: Either<E, A>) => Kind4<F, S, R, E, A>
}
```

Added in v2.10.0

# utils

## fromOption\_

**Signature**

```ts
export declare function fromOption_<F extends URIS4>(
  F: FromEither4<F>
): <E>(onNone: Lazy<E>) => <S, R, A>(ma: Option<A>) => Kind4<F, S, R, E, A>
export declare function fromOption_<F extends URIS3>(
  F: FromEither3<F>
): <E>(onNone: Lazy<E>) => <R, A>(ma: Option<A>) => Kind3<F, R, E, A>
export declare function fromOption_<F extends URIS3, E>(
  F: FromEither3C<F, E>
): (onNone: Lazy<E>) => <A, R>(ma: Option<A>) => Kind3<F, R, E, A>
export declare function fromOption_<F extends URIS2>(
  F: FromEither2<F>
): <E>(onNone: Lazy<E>) => <A>(ma: Option<A>) => Kind2<F, E, A>
export declare function fromOption_<F extends URIS2, E>(
  F: FromEither2C<F, E>
): (onNone: Lazy<E>) => <A>(ma: Option<A>) => Kind2<F, E, A>
export declare function fromOption_<F>(F: FromEither<F>): <E>(onNone: Lazy<E>) => <A>(ma: Option<A>) => HKT2<F, E, A>
```

Added in v2.10.0

## fromPredicate\_

**Signature**

```ts
export declare function fromPredicate_<F extends URIS4>(
  F: FromEither4<F>
): {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <S, R>(a: A) => Kind4<F, S, R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <S, R>(a: A) => Kind4<F, S, R, E, A>
}
export declare function fromPredicate_<F extends URIS3>(
  F: FromEither3<F>
): {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <R>(a: A) => Kind3<F, R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R>(a: A) => Kind3<F, R, E, A>
}
export declare function fromPredicate_<F extends URIS2>(
  F: FromEither2<F>
): {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (a: A) => Kind2<F, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): (a: A) => Kind2<F, E, A>
}
export declare function fromPredicate_<F>(
  F: FromEither<F>
): {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (a: A) => HKT2<F, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): (a: A) => HKT2<F, E, A>
}
```

Added in v2.10.0
