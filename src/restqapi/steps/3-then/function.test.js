beforeEach(() => {
  jest.resetModules()
})

describe('#StepDefinition - then - functions', () => {
  test('Configuration', () => {
    const Then = require('./functions')
    const fns = Object.keys(Then)
    expect(fns.length).toBe(23)
    const expectedFunctions = [
      'httpCode',
      'httpTiming',
      'headerValueExist',
      'headerValueNotExist',
      'headerValueEqual',
      'headers',
      'shouldBeEmptyArrayResponse',
      'shouldNotBeEmptyArrayResponse',
      'shouldBeEmptyResponse',
      'shouldBeNumber',
      'shouldBeTrue',
      'shouldBeFalse',
      'shouldBeNull',
      'shouldBeString',
      'shouldBeEmpty',
      'shouldNotBeNull',
      'shouldBeArraySize',
      'shouldBeAnArray',
      'shouldBeAnArrayOfXItems',
      'shouldMatch',
      'shouldBeNow',
      'addHeaderPropertyToDataset',
      'addBodyPropertyToDataset'
    ]
    expect(fns).toEqual(expectedFunctions)
  })

  describe('API Default Functions', () => {
    test('httpCode', () => {
      const assert = require('assert')
      jest.mock('assert')
      assert.strictEqual = jest.fn()

      const $this = {
        api: {
          response: {
            statusCode: 201,
            request: {
              prefix: '[POST /users]'
            }
          }
        }
      }

      const Then = require('./functions')
      Then.httpCode.call($this, 200)

      expect(assert.strictEqual.mock.calls.length).toBe(1)
      expect(assert.strictEqual.mock.calls[0][0]).toBe(201)
      expect(assert.strictEqual.mock.calls[0][1]).toBe(200)
      expect(assert.strictEqual.mock.calls[0][2]).toBe('[POST /users] The response httpCode is invalid, received 201 should be 200')
    })

    test('httpTiming - When timing is higher', () => {
      const assert = require('assert')
      jest.mock('assert')
      assert.ok = jest.fn()

      const $this = {
        api: {
          response: {
            timing: 1000,
            request: {
              prefix: '[POST /users]'
            }
          }
        }
      }

      const Then = require('./functions')
      Then.httpTiming.call($this, 200)

      expect(assert.ok.mock.calls.length).toBe(1)
      expect(assert.ok.mock.calls[0][0]).toBe(false)
      expect(assert.ok.mock.calls[0][1]).toBe('[POST /users] The response time is invalid, received 1000 should be lower than 200')
    })

    test('httpTiming - When timing is lower', () => {
      const assert = require('assert')
      jest.mock('assert')
      assert.ok = jest.fn()

      const $this = {
        api: {
          response: {
            timing: 100,
            request: {
              prefix: '[POST /users]'
            }
          }
        }
      }

      const Then = require('./functions')
      Then.httpTiming.call($this, 200)

      expect(assert.ok.mock.calls.length).toBe(1)
      expect(assert.ok.mock.calls[0][0]).toBe(true)
    })
  })

  describe('API Headers Functions', () => {
    test('headerValueExist', () => {
      const assert = require('assert')
      jest.mock('assert')
      assert.notStrictEqual = jest.fn()

      const $this = {
        api: {
          response: {
            findInHeader: jest.fn().mockReturnValue('xxx-yyy-zzz'),
            request: {
              prefix: '[POST /users]'
            }
          }
        }
      }

      const Then = require('./functions')
      Then.headerValueExist.call($this, 'x-req-id')

      expect(assert.notStrictEqual.mock.calls.length).toBe(1)
      expect(assert.notStrictEqual.mock.calls[0][0]).toBe('xxx-yyy-zzz')
      expect(assert.notStrictEqual.mock.calls[0][1]).toBeUndefined()
      expect(assert.notStrictEqual.mock.calls[0][2]).toBe('[POST /users] The response header should contain the x-req-id property')
    })

    test('headerValueNotExist', () => {
      const assert = require('assert')
      jest.mock('assert')
      assert.strictEqual = jest.fn()

      const $this = {
        api: {
          response: {
            findInHeader: jest.fn().mockReturnValue('xxx-yyy-zzz'),
            request: {
              prefix: '[POST /users]'
            }
          }
        }
      }

      const Then = require('./functions')
      Then.headerValueNotExist.call($this, 'x-req-id')

      expect(assert.strictEqual.mock.calls.length).toBe(1)
      expect(assert.strictEqual.mock.calls[0][0]).toBe('xxx-yyy-zzz')
      expect(assert.strictEqual.mock.calls[0][1]).toBeUndefined()
      expect(assert.strictEqual.mock.calls[0][2]).toBe('[POST /users] The response header should not contain the x-req-id property')
    })

    test('headerValueEqual', () => {
      const assert = require('assert')
      jest.mock('assert')
      assert.strictEqual = jest.fn()

      const $this = {
        api: {
          response: {
            findInHeader: jest.fn().mockReturnValue('xxx-yyy-zzz'),
            request: {
              prefix: '[POST /users]'
            }
          }
        }
      }

      const Then = require('./functions')
      Then.headerValueEqual.call($this, 'x-req-id', 'aaa-bbb-ccc')

      expect(assert.strictEqual.mock.calls.length).toBe(1)
      expect(assert.strictEqual.mock.calls[0][0]).toBe('xxx-yyy-zzz')
      expect(assert.strictEqual.mock.calls[0][1]).toBe('aaa-bbb-ccc')
      expect(assert.strictEqual.mock.calls[0][2]).toBe('[POST /users] The response header is invalid, the x-req-id property should be aaa-bbb-ccc but received xxx-yyy-zzz')
    })

    test('headers', () => {
      const Then = require('./functions')
      Then.headerValueEqual = jest.fn()
      const table = {
        raw: () => {
          return [
            ['foo', 'bar'],
            ['abc', 'def']
          ]
        }
      }
      Then.headers.call({}, table)

      expect(Then.headerValueEqual.mock.calls.length).toBe(2)
      expect(Then.headerValueEqual.mock.calls[0][0]).toBe('foo')
      expect(Then.headerValueEqual.mock.calls[0][1]).toBe('bar')
      expect(Then.headerValueEqual.mock.calls[1][0]).toBe('abc')
      expect(Then.headerValueEqual.mock.calls[1][1]).toBe('def')
    })
  })

  describe('API Body Functions', () => {
    test('shouldBeEmptyArrayResponse', () => {
      const assert = require('assert')
      jest.mock('assert')
      assert.strictEqual = jest.fn()

      const $this = {
        api: {
          response: {
            body: [1, 2, 3],
            request: {
              prefix: '[POST /users]'
            }
          }
        }
      }

      const Then = require('./functions')
      Then.shouldBeEmptyArrayResponse.call($this)

      expect(assert.strictEqual.mock.calls.length).toBe(1)
      expect(assert.strictEqual.mock.calls[0][0]).toBe(3)
      expect(assert.strictEqual.mock.calls[0][1]).toBe(0)
      expect(assert.strictEqual.mock.calls[0][2]).toBe('[POST /users] The response body should return an empty array, but received an array with 3 items')
    })

    test('shouldNotBeEmptyArrayResponse', () => {
      const assert = require('assert')
      jest.mock('assert')
      assert.notStrictEqual = jest.fn()

      const $this = {
        api: {
          response: {
            body: [],
            request: {
              prefix: '[POST /users]'
            }
          }
        }
      }

      const Then = require('./functions')
      Then.shouldNotBeEmptyArrayResponse.call($this)

      expect(assert.notStrictEqual.mock.calls.length).toBe(1)
      expect(assert.notStrictEqual.mock.calls[0][0]).toBe(0)
      expect(assert.notStrictEqual.mock.calls[0][1]).toBe(0)
      expect(assert.notStrictEqual.mock.calls[0][2]).toBe('[POST /users] The response body should return an array containing items, but received an array with 0 items')
    })

    test('shouldBeEmptyResponse', () => {
      const assert = require('assert')
      jest.mock('assert')
      assert.strictEqual = jest.fn()

      const $this = {
        api: {
          response: {
            request: {
              prefix: '[POST /users]'
            }
          }
        }
      }

      const Then = require('./functions')
      Then.shouldBeEmptyResponse.call($this)

      expect(assert.strictEqual.mock.calls.length).toBe(1)
      expect(assert.strictEqual.mock.calls[0][0]).toBe(undefined)
      expect(assert.strictEqual.mock.calls[0][1]).toBe(undefined)
      expect(assert.strictEqual.mock.calls[0][2]).toBe('[POST /users] The response body should be empty')
    })

    test('shouldBeNumber', () => {
      const assert = require('assert')
      jest.mock('assert')
      assert.strictEqual = jest.fn()

      const $this = {
        data: {
          get: jest.fn().mockReturnValue(456)
        },
        api: {
          response: {
            findInBody: jest.fn((_) => 123),
            request: {
              prefix: '[POST /users]'
            }
          }
        }
      }

      const Then = require('./functions')
      Then.shouldBeNumber.call($this, 'foo', '{{ val }}')

      expect($this.data.get.mock.calls.length).toBe(1)
      expect($this.data.get.mock.calls[0][0]).toBe('{{ val }}')
      expect($this.api.response.findInBody.mock.calls[0][0]).toBe('foo')
      expect($this.api.response.findInBody.mock.calls.length).toBe(1)
      expect($this.api.response.findInBody.mock.calls[0][0]).toBe('foo')
      expect($this.api.response.findInBody.mock.calls.length).toBe(1)
      expect($this.api.response.findInBody.mock.calls[0][0]).toBe('foo')
      expect(assert.strictEqual.mock.calls.length).toBe(1)
      expect(assert.strictEqual.mock.calls[0][0]).toBe(123)
      expect(assert.strictEqual.mock.calls[0][1]).toBe(456)
      expect(assert.strictEqual.mock.calls[0][2]).toBe('[POST /users] The response body property foo should be 456 but received 123')
    })

    test('shouldBeTrue', () => {
      const assert = require('assert')
      jest.mock('assert')
      assert.strictEqual = jest.fn()

      const $this = {
        api: {
          response: {
            findInBody: jest.fn((_) => false),
            request: {
              prefix: '[POST /users]'
            }
          }
        }
      }

      const Then = require('./functions')
      Then.shouldBeTrue.call($this, 'foo')

      expect($this.api.response.findInBody.mock.calls.length).toBe(1)
      expect($this.api.response.findInBody.mock.calls[0][0]).toBe('foo')
      expect(assert.strictEqual.mock.calls.length).toBe(1)
      expect(assert.strictEqual.mock.calls[0][0]).toBe(false)
      expect(assert.strictEqual.mock.calls[0][1]).toBe(true)
      expect(assert.strictEqual.mock.calls[0][2]).toBe('[POST /users] The response body property foo should be true but received false')
    })

    test('shouldBeFalse', () => {
      const assert = require('assert')
      jest.mock('assert')
      assert.strictEqual = jest.fn()

      const $this = {
        api: {
          response: {
            findInBody: jest.fn((_) => true),
            request: {
              prefix: '[POST /users]'
            }
          }
        }
      }

      const Then = require('./functions')
      Then.shouldBeFalse.call($this, 'foo')

      expect($this.api.response.findInBody.mock.calls.length).toBe(1)
      expect($this.api.response.findInBody.mock.calls[0][0]).toBe('foo')
      expect(assert.strictEqual.mock.calls.length).toBe(1)
      expect(assert.strictEqual.mock.calls[0][0]).toBe(true)
      expect(assert.strictEqual.mock.calls[0][1]).toBe(false)
      expect(assert.strictEqual.mock.calls[0][2]).toBe('[POST /users] The response body property foo should be false but received true')
    })

    test('shouldBeNull', () => {
      const assert = require('assert')
      jest.mock('assert')
      assert.strictEqual = jest.fn()

      const $this = {
        api: {
          response: {
            findInBody: jest.fn((_) => 'my value'),
            request: {
              prefix: '[POST /users]'
            }
          }
        }
      }

      const Then = require('./functions')
      Then.shouldBeNull.call($this, 'foo')

      expect($this.api.response.findInBody.mock.calls.length).toBe(1)
      expect($this.api.response.findInBody.mock.calls[0][0]).toBe('foo')
      expect(assert.strictEqual.mock.calls.length).toBe(1)
      expect(assert.strictEqual.mock.calls[0][0]).toBe('my value')
      expect(assert.strictEqual.mock.calls[0][1]).toBe(null)
      expect(assert.strictEqual.mock.calls[0][2]).toBe('[POST /users] The response body property foo should be null but received my value')
    })

    test('shouldBeNull', () => {
      const assert = require('assert')
      jest.mock('assert')
      assert.strictEqual = jest.fn()

      const $this = {
        api: {
          response: {
            findInBody: jest.fn((_) => 'my value'),
            request: {
              prefix: '[POST /users]'
            }
          }
        }
      }

      const Then = require('./functions')
      Then.shouldBeNull.call($this, 'foo')

      expect($this.api.response.findInBody.mock.calls.length).toBe(1)
      expect($this.api.response.findInBody.mock.calls[0][0]).toBe('foo')
      expect(assert.strictEqual.mock.calls.length).toBe(1)
      expect(assert.strictEqual.mock.calls[0][0]).toBe('my value')
      expect(assert.strictEqual.mock.calls[0][1]).toBe(null)
      expect(assert.strictEqual.mock.calls[0][2]).toBe('[POST /users] The response body property foo should be null but received my value')
    })

    test('shouldBeString - Boolean true case', () => {
      const $this = {
        data: {
          get: jest.fn().mockReturnValue('true')
        },
        api: {
          response: {
            findInBody: jest.fn((_) => 'my value'),
            request: {
              prefix: '[POST /users]'
            }
          }
        }
      }

      const Then = require('./functions')
      Then.shouldBeTrue = jest.fn()
      Then.shouldBeString.call($this, '{{ foo.bar }}', 'true')

      expect($this.data.get.mock.calls.length).toBe(1)
      expect($this.data.get.mock.calls[0][0]).toBe('true')
      expect(Then.shouldBeTrue.mock.calls.length).toBe(1)
      expect(Then.shouldBeTrue.mock.calls[0][0]).toBe('{{ foo.bar }}')
    })

    test('shouldBeString - Boolean false case', () => {
      const $this = {
        data: {
          get: jest.fn().mockReturnValue('false')
        },
        api: {
          response: {
            findInBody: jest.fn((_) => 'my value'),
            request: {
              prefix: '[POST /users]'
            }
          }
        }
      }

      const Then = require('./functions')
      Then.shouldBeFalse = jest.fn()
      Then.shouldBeString.call($this, '{{ foo.bar }}', 'false')

      expect($this.data.get.mock.calls.length).toBe(1)
      expect($this.data.get.mock.calls[0][0]).toBe('false')
      expect(Then.shouldBeFalse.mock.calls.length).toBe(1)
      expect(Then.shouldBeFalse.mock.calls[0][0]).toBe('{{ foo.bar }}')
    })

    test('shouldBeString - Boolean null case', () => {
      const $this = {
        data: {
          get: jest.fn().mockReturnValue('null')
        },
        api: {
          response: {
            findInBody: jest.fn((_) => 'my value'),
            request: {
              prefix: '[POST /users]'
            }
          }
        }
      }

      const Then = require('./functions')
      Then.shouldBeNull = jest.fn()
      Then.shouldBeString.call($this, '{{ foo.bar }}', 'null')

      expect($this.data.get.mock.calls.length).toBe(1)
      expect($this.data.get.mock.calls[0][0]).toBe('null')
      expect(Then.shouldBeNull.mock.calls.length).toBe(1)
      expect(Then.shouldBeNull.mock.calls[0][0]).toBe('{{ foo.bar }}')
    })

    test('shouldBeString - string', () => {
      const assert = require('assert')
      jest.mock('assert')
      assert.strictEqual = jest.fn()

      const $this = {
        data: {
          get: jest.fn().mockReturnValue('my-value')
        },
        api: {
          response: {
            findInBody: jest.fn((_) => 'my value'),
            request: {
              prefix: '[POST /users]'
            }
          }
        }
      }

      const Then = require('./functions')
      Then.shouldBeString.call($this, 'foo.bar', '{{ placehoder }}')

      expect($this.data.get.mock.calls.length).toBe(1)
      expect($this.data.get.mock.calls[0][0]).toBe('{{ placehoder }}')
      expect(assert.strictEqual.mock.calls.length).toBe(1)
      expect(assert.strictEqual.mock.calls[0][0]).toBe('my value')
      expect(assert.strictEqual.mock.calls[0][1]).toBe('my-value')
      expect(assert.strictEqual.mock.calls[0][2]).toBe('[POST /users] The response body property foo.bar should be my-value but received my value')
    })

    test('shouldBeEmpty', () => {
      const assert = require('assert')
      jest.mock('assert')
      assert.strictEqual = jest.fn()

      const $this = {
        api: {
          response: {
            findInBody: jest.fn((_) => 'my value'),
            request: {
              prefix: '[POST /users]'
            }
          }
        }
      }

      const Then = require('./functions')
      Then.shouldBeEmpty.call($this, 'foo.bar')

      expect(assert.strictEqual.mock.calls.length).toBe(1)
      expect(assert.strictEqual.mock.calls[0][0]).toBe('my value')
      expect(assert.strictEqual.mock.calls[0][1]).toBe('')
      expect(assert.strictEqual.mock.calls[0][2]).toBe('[POST /users] The response body property foo.bar should be empty but received my value')
    })

    test('shouldNotBeNull', () => {
      const assert = require('assert')
      jest.mock('assert')
      assert.notStrictEqual = jest.fn()

      const $this = {
        api: {
          response: {
            findInBody: jest.fn((_) => 'my value'),
            request: {
              prefix: '[POST /users]'
            }
          }
        }
      }

      const Then = require('./functions')
      Then.shouldNotBeNull.call($this, 'foo.bar')

      expect(assert.notStrictEqual.mock.calls.length).toBe(1)
      expect(assert.notStrictEqual.mock.calls[0][0]).toBe('my value')
      expect(assert.notStrictEqual.mock.calls[0][1]).toBe(null)
      expect(assert.notStrictEqual.mock.calls[0][2]).toBe('[POST /users] The response body property foo.bar should not be null but received null')
    })

    test('shouldBeArraySize', () => {
      const assert = require('assert')
      jest.mock('assert')
      assert.strictEqual = jest.fn()

      const $this = {
        api: {
          response: {
            body: [1, 2, 3],
            request: {
              prefix: '[POST /users]'
            }
          }
        }
      }

      const Then = require('./functions')
      Then.shouldBeArraySize.call($this, 2)

      expect(assert.strictEqual.mock.calls.length).toBe(1)
      expect(assert.strictEqual.mock.calls[0][0]).toBe(3)
      expect(assert.strictEqual.mock.calls[0][1]).toBe(2)
      expect(assert.strictEqual.mock.calls[0][2]).toBe('[POST /users] The response body property should contain an array of 2 items but received an array of 3 items')
    })

    test('shouldBeAnArray', () => {
      const assert = require('assert')
      jest.mock('assert')
      assert.ok = jest.fn()

      const $this = {
        api: {
          response: {
            findInBody: jest.fn((_) => 'my value'),
            body: {
              foo: 'test'
            },
            request: {
              prefix: '[POST /users]'
            }
          }
        }
      }

      const Then = require('./functions')
      Then.shouldBeAnArray.call($this, '$.foo')

      expect($this.api.response.findInBody.mock.calls.length).toBe(1)
      expect($this.api.response.findInBody.mock.calls[0][0]).toBe('$.foo')
      expect(assert.ok.mock.calls.length).toBe(1)
      expect(assert.ok.mock.calls[0][0]).toBe(false)
      expect(assert.ok.mock.calls[0][1]).toBe('[POST /users] The response body property should contain an array but received a string (my value)')
    })

    test('shouldBeAnArrayOfXItems', () => {
      const assert = require('assert')
      jest.mock('assert')
      assert.strictEqual = jest.fn()

      const $this = {
        api: {
          response: {
            findInBody: jest.fn((_) => [1, 2, 3]),
            body: {
              foo: [1, 2, 3]
            },
            request: {
              prefix: '[POST /users]'
            }
          }
        }
      }

      const Then = require('./functions')
      Then.shouldBeAnArrayOfXItems.call($this, '$.foo', 2)

      expect($this.api.response.findInBody.mock.calls.length).toBe(1)
      expect($this.api.response.findInBody.mock.calls[0][0]).toBe('$.foo')
      expect(assert.strictEqual.mock.calls.length).toBe(1)
      expect(assert.strictEqual.mock.calls[0][0]).toBe(3)
      expect(assert.strictEqual.mock.calls[0][1]).toBe(2)
      expect(assert.strictEqual.mock.calls[0][2]).toBe('[POST /users] The response body property $.foo should contain an array of 2 but received 3 item(s)')
    })

    test('shouldBeArraySize', () => {
      const assert = require('assert')
      jest.mock('assert')
      assert.strictEqual = jest.fn()

      const $this = {
        api: {
          response: {
            body: [1, 2, 3],
            request: {
              prefix: '[POST /users]'
            }
          }
        }
      }

      const Then = require('./functions')
      Then.shouldBeArraySize.call($this, 2)

      expect(assert.strictEqual.mock.calls.length).toBe(1)
      expect(assert.strictEqual.mock.calls[0][0]).toBe(3)
      expect(assert.strictEqual.mock.calls[0][1]).toBe(2)
      expect(assert.strictEqual.mock.calls[0][2]).toBe('[POST /users] The response body property should contain an array of 2 items but received an array of 3 items')
    })

    describe('shouldMatch', () => {
      test('shouldMatch with a regex format like \\d(.*)', () => {
        const assert = require('assert')
        jest.mock('assert')
        assert.ok = jest.fn()

        const $this = {
          api: {
            response: {
              findInBody: jest.fn((_) => 'my value'),
              request: {
                prefix: '[POST /users]'
              }
            }
          }
        }

        const Then = require('./functions')
        Then.shouldMatch.call($this, 'foo.bar', '^test$')

        expect(assert.ok.mock.calls.length).toBe(1)
        expect(assert.ok.mock.calls[0][0]).toEqual(false)
        expect(assert.ok.mock.calls[0][1]).toBe('[POST /users] The response body property foo.bar should match the regexp ^test$ but received : my value')

        Then.shouldMatch.call($this, 'foo.bar', '^my value$')

        expect(assert.ok.mock.calls.length).toBe(2)
        expect(assert.ok.mock.calls[1][0]).toEqual(true)
        expect(assert.ok.mock.calls[1][1]).toBe('[POST /users] The response body property foo.bar should match the regexp ^my value$ but received : my value')
      })

      test('shouldMatch with a regex format like /\\d(.*)/', () => {
        const assert = require('assert')
        jest.mock('assert')
        assert.ok = jest.fn()

        const $this = {
          api: {
            response: {
              findInBody: jest.fn((_) => 'my value'),
              request: {
                prefix: '[POST /users]'
              }
            }
          }
        }

        const Then = require('./functions')
        Then.shouldMatch.call($this, 'foo.bar', '/^test$/')

        expect(assert.ok.mock.calls.length).toBe(1)
        expect(assert.ok.mock.calls[0][0]).toEqual(false)
        expect(assert.ok.mock.calls[0][1]).toBe('[POST /users] The response body property foo.bar should match the regexp /^test$/ but received : my value')

        Then.shouldMatch.call($this, 'foo.bar', '/^my value$/')

        expect(assert.ok.mock.calls.length).toBe(2)
        expect(assert.ok.mock.calls[1][0]).toEqual(true)
        expect(assert.ok.mock.calls[1][1]).toBe('[POST /users] The response body property foo.bar should match the regexp /^my value$/ but received : my value')
      })
    })

    test('shouldBeNow ', () => {
      global.Date.now = jest.fn(() => new Date('2019-04-07T10:20:30Z').getTime())

      const assert = require('assert')
      jest.mock('assert')
      assert.ok = jest.fn()

      const $this = {
        api: {
          response: {
            findInBody: jest.fn((_) => '2019-04-07T10:21:30Z'),
            request: {
              prefix: '[POST /users]'
            }
          }
        }
      }

      const Then = require('./functions')
      Then.shouldBeNow.call($this, 'foo.bar')

      expect($this.api.response.findInBody.mock.calls.length).toBe(1)
      expect($this.api.response.findInBody.mock.calls[0][0]).toBe('foo.bar')
      expect(assert.ok.mock.calls.length).toBe(1)
      expect(assert.ok.mock.calls[0][0]).toEqual(true)
      expect(assert.ok.mock.calls[0][1]).toBe('[POST /users] The response body property foo.bar should be close to now, but received : 2019-04-07T10:21:30Z')
    })

    test('addHeaderPropertyToDataset', () => {
      const $this = {
        data: {
          set: jest.fn()
        },
        api: {
          response: {
            findInHeader: jest.fn((_) => 'my value')
          }
        }
      }

      const Then = require('./functions')
      Then.addHeaderPropertyToDataset.call($this, 'foo.bar', 'my-value')

      expect($this.api.response.findInHeader.mock.calls.length).toBe(1)
      expect($this.api.response.findInHeader.mock.calls[0][0]).toBe('foo.bar')

      expect($this.data.set.mock.calls.length).toBe(1)
      expect($this.data.set.mock.calls[0][0]).toBe('my-value')
      expect($this.data.set.mock.calls[0][1]).toBe('my value')
    })

    test('addBodyPropertyToDataset', () => {
      const $this = {
        data: {
          set: jest.fn()
        },
        api: {
          response: {
            findInBody: jest.fn((_) => 'my value')
          }
        }
      }

      const Then = require('./functions')
      Then.addBodyPropertyToDataset.call($this, 'foo.bar', 'my-value')

      expect($this.api.response.findInBody.mock.calls.length).toBe(1)
      expect($this.api.response.findInBody.mock.calls[0][0]).toBe('foo.bar')

      expect($this.data.set.mock.calls.length).toBe(1)
      expect($this.data.set.mock.calls[0][0]).toBe('my-value')
      expect($this.data.set.mock.calls[0][1]).toBe('my value')
    })
  })
})
