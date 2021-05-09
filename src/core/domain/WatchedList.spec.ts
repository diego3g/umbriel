import { WatchedList } from './WatchedList'

class NumberList extends WatchedList<number> {
  compareItems(a: number, b: number) {
    return a === b
  }
}

describe('Core WatchedList', () => {
  it('should be able to instantiate', () => {
    const numberList = new NumberList()

    expect(numberList.getItems()).toEqual([])
    expect(numberList.getNewItems()).toEqual([])
    expect(numberList.getRemovedItems()).toEqual([])
  })

  it('should be able to instantiate with initial items', () => {
    const numberList = new NumberList([1, 2])

    expect(numberList.getItems()).toEqual([1, 2])
    expect(numberList.exists(1)).toBe(true)
    expect(numberList.exists(2)).toBe(true)
  })

  it('should be able to add a new item', () => {
    const numberList = new NumberList()

    numberList.add(1)

    expect(numberList.getItems()).toEqual([1])
    expect(numberList.getNewItems()).toEqual([1])
    expect(numberList.getRemovedItems()).toEqual([])
  })

  it('should be able to remove an item', () => {
    const numberList = new NumberList([1, 2])

    numberList.remove(2)

    expect(numberList.getItems()).toEqual([1])
    expect(numberList.getNewItems()).toEqual([])
    expect(numberList.getRemovedItems()).toEqual([2])
  })

  it('should be able to add an already removed item', () => {
    const numberList = new NumberList([1, 2])

    numberList.remove(2)
    numberList.add(2)

    expect(numberList.getItems()).toEqual([1, 2])
    expect(numberList.getNewItems()).toEqual([])
    expect(numberList.getRemovedItems()).toEqual([])
  })

  it('should be able to remove a new item', () => {
    const numberList = new NumberList([1, 2])

    numberList.add(3)
    numberList.remove(3)

    expect(numberList.getItems()).toEqual([1, 2])
    expect(numberList.getNewItems()).toEqual([])
    expect(numberList.getRemovedItems()).toEqual([])
  })
})
