---
title: Semigroup.ts
nav_order: 81
parent: Modules
---

## Semigroup overview

If a type `A` can form a `Semigroup` it has an **associative** binary operation.

```ts
interface Semigroup<A> {
  readonly concat: (x: A, y: A) => A
}
```

Associativity means the following equality must hold for any choice of `x`, `y`, and `z`.

```ts
concat(x, concat(y, z)) = concat(concat(x, y), z)
```

A common example of a semigroup is the type `string` with the operation `+`.

```ts
import { Semigroup } from 'fp-ts/Semigroup'

const semigroupString: Semigroup<string> = {
  concat: (x, y) => x + y,
}

const x = 'x'
const y = 'y'
const z = 'z'

semigroupString.concat(x, y) // 'xy'

semigroupString.concat(x, semigroupString.concat(y, z)) // 'xyz'

semigroupString.concat(semigroupString.concat(x, y), z) // 'xyz'
```

_Adapted from https://typelevel.org/cats_

Added in v2.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [combinators](#combinators)
  - [getDualSemigroup](#getdualsemigroup)
  - [getIntercalateSemigroup](#getintercalatesemigroup)
  - [getStructSemigroup](#getstructsemigroup)
  - [getTupleSemigroup](#gettuplesemigroup)
- [constructors](#constructors)
  - [getJoinSemigroup](#getjoinsemigroup)
  - [getMeetSemigroup](#getmeetsemigroup)
- [instances](#instances)
  - [getFirstSemigroup](#getfirstsemigroup)
  - [getLastSemigroup](#getlastsemigroup)
  - [getObjectSemigroup](#getobjectsemigroup)
  - [semigroupProduct](#semigroupproduct)
  - [semigroupString](#semigroupstring)
  - [semigroupSum](#semigroupsum)
  - [semigroupVoid](#semigroupvoid)
  - [~~getFunctionSemigroup~~](#getfunctionsemigroup)
  - [~~semigroupAll~~](#semigroupall)
  - [~~semigroupAny~~](#semigroupany)
- [type classes](#type-classes)
  - [Semigroup (interface)](#semigroup-interface)
- [utils](#utils)
  - [fold](#fold)

---

# combinators

## getDualSemigroup

The dual of a `Semigroup`, obtained by swapping the arguments of `concat`.

**Signature**

```ts
export declare const getDualSemigroup: <A>(S: Semigroup<A>) => Semigroup<A>
```

**Example**

```ts
import * as S from 'fp-ts/Semigroup'

assert.deepStrictEqual(S.getDualSemigroup(S.semigroupString).concat('a', 'b'), 'ba')
```

Added in v2.0.0

## getIntercalateSemigroup

You can glue items between and stay associative.

**Signature**

```ts
export declare function getIntercalateSemigroup<A>(a: A): (S: Semigroup<A>) => Semigroup<A>
```

**Example**

```ts
import * as S from 'fp-ts/Semigroup'

const S1 = S.getIntercalateSemigroup(' ')(S.semigroupString)

assert.strictEqual(S1.concat('a', 'b'), 'a b')
assert.strictEqual(S1.concat(S1.concat('a', 'b'), 'c'), S1.concat('a', S1.concat('b', 'c')))
```

Added in v2.5.0

## getStructSemigroup

Given a struct of semigroups returns a semigroup for the struct.

**Signature**

```ts
export declare const getStructSemigroup: <O extends Readonly<Record<string, any>>>(
  semigroups: { [K in keyof O]: Semigroup<O[K]> }
) => Semigroup<O>
```

**Example**

```ts
import * as S from 'fp-ts/Semigroup'

interface Point {
  readonly x: number
  readonly y: number
}

const semigroupPoint = S.getStructSemigroup<Point>({
  x: S.semigroupSum,
  y: S.semigroupSum,
})

assert.deepStrictEqual(semigroupPoint.concat({ x: 1, y: 2 }, { x: 3, y: 4 }), { x: 4, y: 6 })
```

Added in v2.0.0

## getTupleSemigroup

Given a tuple of semigroups returns a semigroup for the tuple.

**Signature**

```ts
export declare const getTupleSemigroup: <T extends readonly Semigroup<any>[]>(
  ...semigroups: T
) => Semigroup<{ [K in keyof T]: T[K] extends Semigroup<infer A> ? A : never }>
```

**Example**

```ts
import * as S from 'fp-ts/Semigroup'

const S1 = S.getTupleSemigroup(S.semigroupString, S.semigroupSum)
assert.deepStrictEqual(S1.concat(['a', 1], ['b', 2]), ['ab', 3])

const S2 = S.getTupleSemigroup(S.semigroupString, S.semigroupSum, S.semigroupAll)
assert.deepStrictEqual(S2.concat(['a', 1, true], ['b', 2, false]), ['ab', 3, false])
```

Added in v2.0.0

# constructors

## getJoinSemigroup

Get a semigroup where `concat` will return the maximum, based on the provided order.

**Signature**

```ts
export declare const getJoinSemigroup: <A>(O: Ord<A>) => Semigroup<A>
```

**Example**

```ts
import * as O from 'fp-ts/Ord'
import * as S from 'fp-ts/Semigroup'

const S1 = S.getJoinSemigroup(O.ordNumber)

assert.deepStrictEqual(S1.concat(1, 2), 2)
```

Added in v2.0.0

## getMeetSemigroup

Get a semigroup where `concat` will return the minimum, based on the provided order.

**Signature**

```ts
export declare const getMeetSemigroup: <A>(O: Ord<A>) => Semigroup<A>
```

**Example**

```ts
import * as O from 'fp-ts/Ord'
import * as S from 'fp-ts/Semigroup'

const S1 = S.getMeetSemigroup(O.ordNumber)

assert.deepStrictEqual(S1.concat(1, 2), 1)
```

Added in v2.0.0

# instances

## getFirstSemigroup

Always return the first argument.

**Signature**

```ts
export declare function getFirstSemigroup<A = never>(): Semigroup<A>
```

**Example**

```ts
import * as S from 'fp-ts/Semigroup'

assert.deepStrictEqual(S.getFirstSemigroup<number>().concat(1, 2), 1)
```

Added in v2.0.0

## getLastSemigroup

Always return the last argument.

**Signature**

```ts
export declare function getLastSemigroup<A = never>(): Semigroup<A>
```

**Example**

```ts
import * as S from 'fp-ts/Semigroup'

assert.deepStrictEqual(S.getLastSemigroup<number>().concat(1, 2), 2)
```

Added in v2.0.0

## getObjectSemigroup

Return a semigroup for objects, preserving their type.

**Signature**

```ts
export declare function getObjectSemigroup<A extends object = never>(): Semigroup<A>
```

**Example**

```ts
import * as S from 'fp-ts/Semigroup'

interface Person {
  name: string
  age: number
}

const S1 = S.getObjectSemigroup<Person>()
assert.deepStrictEqual(S1.concat({ name: 'name', age: 23 }, { name: 'name', age: 24 }), { name: 'name', age: 24 })
```

Added in v2.0.0

## semigroupProduct

`number` semigroup under multiplication.

**Signature**

```ts
export declare const semigroupProduct: Semigroup<number>
```

**Example**

```ts
import * as S from 'fp-ts/Semigroup'

assert.deepStrictEqual(S.semigroupProduct.concat(2, 3), 6)
```

Added in v2.0.0

## semigroupString

`string` semigroup under concatenation.

**Signature**

```ts
export declare const semigroupString: Semigroup<string>
```

**Example**

```ts
import * as S from 'fp-ts/Semigroup'

assert.deepStrictEqual(S.semigroupString.concat('a', 'b'), 'ab')
```

Added in v2.0.0

## semigroupSum

`number` semigroup under addition.

**Signature**

```ts
export declare const semigroupSum: Semigroup<number>
```

**Example**

```ts
import * as S from 'fp-ts/Semigroup'

assert.deepStrictEqual(S.semigroupSum.concat(2, 3), 5)
```

Added in v2.0.0

## semigroupVoid

**Signature**

```ts
export declare const semigroupVoid: Semigroup<void>
```

Added in v2.0.0

## ~~getFunctionSemigroup~~

Use `function.getSemigroup` instead.

**Signature**

```ts
export declare const getFunctionSemigroup: <S>(S: Semigroup<S>) => <A = never>() => Semigroup<(a: A) => S>
```

Added in v2.0.0

## ~~semigroupAll~~

Use `boolean.SemigroupAll` instead.

**Signature**

```ts
export declare const semigroupAll: Semigroup<boolean>
```

Added in v2.0.0

## ~~semigroupAny~~

Use `boolean.SemigroupAny` instead.

**Signature**

```ts
export declare const semigroupAny: Semigroup<boolean>
```

Added in v2.0.0

# type classes

## Semigroup (interface)

**Signature**

```ts
export interface Semigroup<A> extends Magma<A> {}
```

Added in v2.0.0

# utils

## fold

Given a sequence of `as`, concat them and return the total.

If `as` is empty, return the provided `startWith` value.

**Signature**

```ts
export declare function fold<A>(
  S: Semigroup<A>
): {
  (startWith: A): (as: ReadonlyArray<A>) => A
  (startWith: A, as: ReadonlyArray<A>): A
}
```

**Example**

```ts
import * as S from 'fp-ts/Semigroup'

const sum = S.fold(S.semigroupSum)(0)

assert.deepStrictEqual(sum([1, 2, 3]), 6)
assert.deepStrictEqual(sum([]), 0)
```

Added in v2.0.0
