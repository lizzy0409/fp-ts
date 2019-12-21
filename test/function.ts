import * as assert from 'assert'
import {
  constFalse,
  constNull,
  constTrue,
  constUndefined,
  constVoid,
  decrement,
  flip,
  identity,
  increment,
  not,
  unsafeCoerce,
  absurd,
  flow
} from '../src/function'

const f = (n: number) => n + 1
const g = (n: number) => n * 2

describe('function', () => {
  it('flip', () => {
    const f = (a: number, b: string) => a - b.length
    assert.deepStrictEqual(flip(f)('aaa', 2), -1)
  })

  it('not', () => {
    const n = not(Boolean)
    assert.deepStrictEqual(n(false), true)
    assert.deepStrictEqual(n(1), false)
    assert.deepStrictEqual(n(''), true)
  })

  it('unsafeCoerce', () => {
    assert.deepStrictEqual(unsafeCoerce, identity)
  })

  it('constTrue', () => {
    assert.deepStrictEqual(constTrue(), true)
  })

  it('constFalse', () => {
    assert.deepStrictEqual(constFalse(), false)
  })

  it('constNull', () => {
    assert.deepStrictEqual(constNull(), null)
  })

  it('constUndefined', () => {
    assert.deepStrictEqual(constUndefined(), undefined)
  })

  it('constVoid', () => {
    assert.deepStrictEqual(constVoid(), undefined)
  })

  it('increment', () => {
    assert.deepStrictEqual(increment(2), 3)
  })

  it('decrement', () => {
    assert.deepStrictEqual(decrement(2), 1)
  })

  it('absurd', () => {
    assert.throws(() => absurd<string>((null as any) as never))
  })

  it('flow', () => {
    assert.deepStrictEqual(flow(f)(2), 3)
    assert.deepStrictEqual(flow(f, g)(2), 6)
    assert.deepStrictEqual(flow(f, g, f)(2), 7)
    assert.deepStrictEqual(flow(f, g, f, g)(2), 14)
    assert.deepStrictEqual(flow(f, g, f, g, f)(2), 15)
    assert.deepStrictEqual(flow(f, g, f, g, f, g)(2), 30)
    assert.deepStrictEqual(flow(f, g, f, g, f, g, f)(2), 31)
    assert.deepStrictEqual(flow(f, g, f, g, f, g, f, g)(2), 62)
    assert.deepStrictEqual(flow(f, g, f, g, f, g, f, g, f)(2), 63)
  })
})
