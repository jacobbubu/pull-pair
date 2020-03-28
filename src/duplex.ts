import { pair } from './index'

export function duplex() {
  const a = pair()
  const b = pair()
  return [
    {
      source: a.source,
      sink: b.sink,
    },
    {
      source: b.source,
      sink: a.sink,
    },
  ]
}
