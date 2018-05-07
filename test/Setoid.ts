import * as assert from 'assert'
import { contramap, getProductSetoid, getRecordSetoid, setoidDate, setoidNumber, setoidString } from '../src/Setoid'

describe('Setoid', () => {
  interface Person {
    name: string
    age: number
  }

  it('getRecordSetoid', () => {
    const S = getRecordSetoid<Person>({
      name: setoidString,
      age: setoidNumber
    })
    assert.strictEqual(S.equals({ name: 'a', age: 1 }, { name: 'a', age: 1 }), true)
    assert.strictEqual(S.equals({ name: 'a', age: 1 }, { name: 'a', age: 2 }), false)
    assert.strictEqual(S.equals({ name: 'a', age: 1 }, { name: 'b', age: 1 }), false)
  })

  it('getProductSetoid', () => {
    const S = getProductSetoid(setoidString, setoidNumber)
    assert.strictEqual(S.equals(['a', 1], ['a', 1]), true)
    assert.strictEqual(S.equals(['a', 1], ['b', 1]), false)
    assert.strictEqual(S.equals(['a', 1], ['a', 2]), false)
  })

  it('contramap', () => {
    const S = contramap((p: Person) => p.name, setoidString)
    assert.strictEqual(S.equals({ name: 'a', age: 1 }, { name: 'a', age: 2 }), true)
    assert.strictEqual(S.equals({ name: 'a', age: 1 }, { name: 'a', age: 1 }), true)
    assert.strictEqual(S.equals({ name: 'a', age: 1 }, { name: 'b', age: 1 }), false)
    assert.strictEqual(S.equals({ name: 'a', age: 1 }, { name: 'b', age: 2 }), false)
  })

  it('setoidDate', () => {
    assert.strictEqual(setoidDate.equals(new Date(0), new Date(0)), true)
    assert.strictEqual(setoidDate.equals(new Date(0), new Date(1)), false)
    assert.strictEqual(setoidDate.equals(new Date(1), new Date(0)), false)
  })
})
