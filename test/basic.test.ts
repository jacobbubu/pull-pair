import * as pull from 'pull-stream'
import { pair, duplex } from '../src'

describe('basic', () => {
  it('simple', (done) => {
    const pa = pair()
    const input = [1, 2, 3]
    pull(pull.values(input), pa.sink)
    pull(
      pa.source,
      pull.collect((err, values) => {
        if (err) {
          throw err
        }
        expect(values).toEqual(input)
        done()
      })
    )
  })

  it('simple - error', (done) => {
    const pa = pair()
    const err = new Error('test errors')

    pull((abort, cb) => {
      cb(err)
    }, pa.sink)

    pull(
      pa.source,
      pull.collect(function (_err, values) {
        expect(_err).toBe(err)
        done()
      })
    )
  })

  it('echo duplex', (done) => {
    const dup = duplex()
    pull(
      pull.values([1, 2, 3]),
      dup[0],
      pull.collect(function (_, ary) {
        expect(ary).toEqual([1, 2, 3])
        done()
      })
    )

    // Pipe the second duplex stream back to itself.
    const logger = () => {
      const result: any[] = []
      return (data: any) => {
        result.push(data)
      }
    }
    pull(dup[1], pull.through(logger()), dup[1])
  })
})
