import * as pull from 'pull-stream'

// A pair of pull streams where one drains from the other
export function pair() {
  let _read: pull.Source<any> | undefined
  let waiting: [pull.Abort, pull.Source<any>] | undefined

  const sink: pull.Sink<any> = (read?) => {
    if ('function' !== typeof read) {
      throw new Error('read must be function')
    }

    if (_read) {
      throw new Error('already piped')
    }

    _read = read
    if (waiting) {
      const _waiting = waiting
      waiting = undefined
      _read.apply(null, _waiting)
    }
  }

  const source: pull.Source<any> = (abort, cb) => {
    if (_read) {
      _read(abort, cb)
    } else {
      waiting = [abort, cb]
    }
  }

  return {
    source,
    sink,
  }
}

export { duplex } from './duplex'
