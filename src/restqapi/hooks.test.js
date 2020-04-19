beforeEach(() => {
  jest.resetModules()
})

describe('# hooks', () => {
  test('init', () => {
    let Hooks = require('./hooks')

    let $this = {
      setConfig: jest.fn(),
      data: {
        parse: jest.fn()
      }
    }

    let config = {
      foo: 'bar'
    }
    let fns = {
      Before: jest.fn((...params) => {
        return params.pop().call($this, { name : 'sc1' })
      }),
      BeforeAll: jest.fn(),
      After: jest.fn(),
      AfterAll: jest.fn()
    }

    Hooks(config, fns)

    expect(fns.Before.mock.calls.length).toBe(4)
    expect(typeof fns.Before.mock.calls[0][0]).toBe('function')
    expect($this.setConfig.mock.calls.length).toBe(1)
    expect($this.setConfig.mock.calls[0][0]).toEqual({foo: 'bar' })

    expect(typeof fns.Before.mock.calls[1][0]).toBe('function')
    expect($this.data.parse.mock.calls.length).toBe(1)
    expect($this.data.parse.mock.calls[0][0]).toEqual({name: 'sc1'})

    expect(fns.Before.mock.calls[2][0]).toBe('@skip')
    expect(typeof fns.Before.mock.calls[2][1]).toBe('function')
    expect(fns.Before.mock.results[2].value).toBe('skipped')

    expect(fns.Before.mock.calls[3][0]).toBe('@wip')
    expect(typeof fns.Before.mock.calls[3][1]).toBe('function')
    expect(fns.Before.mock.results[3].value).toBe('skipped')

    expect(fns.BeforeAll.mock.calls.length).toBe(0)
    expect(fns.After.mock.calls.length).toBe(0)
    expect(fns.AfterAll.mock.calls.length).toBe(0)

    expect($this.skipped).toEqual(true)
  })
})


