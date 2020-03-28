# @jacobbubu/pull-pair

[![Build Status](https://travis-ci.org/jacobbubu/pull-pair.svg)](https://travis-ci.org/jacobbubu/pull-pair)
[![Coverage Status](https://coveralls.io/repos/github/jacobbubu/pull-pair/badge.svg)](https://coveralls.io/github/jacobbubu/pull-pair)
[![npm](https://img.shields.io/npm/v/@jacobbubu/pull-pair.svg)](https://www.npmjs.com/package/@jacobbubu/pull-pair/)

> Rewritten [pull-pair](https://github.com/dominictarr/pull-pair) in TypeScript.

# pull-pair

A pair of {source, sink} streams that are internally connected,
(what goes into the sink comes out the source)

This can be used to construct pipelines that are connected.

``` js
import * as pull from 'pull-stream'
import { pair } from '@jacobbubu/pull-pair'

const pa = pair()

// Read values into this sink...
pull(pull.values([1, 2, 3]), pa.sink)

// But that should become the source over here.
pull(pa.source, pull.collect(function (err, values) {
  if(err) throw err
  console.log(values) //[1, 2, 3]
}))

```

This is particularly useful for creating duplex streams especially
around servers. Use `pull-pair/duplex` to get two duplex streams
that are attached to each other.

``` js
import { duplex } from '@jacobbubu/pull-pair'

const dup = duplex()

// The "client": pipe to the first duplex and get the response.
pull(
  pull.values([1,2,3]),
  dup[0],
  pull.collect(console.log) // => 10, 20, 30
)

// The "server": pipe from the second stream back to itself
// (in this case) applying a transformation.
pull(
  dup[1],
  pull.map(function (e) {
    return e*10
  }),
  dup[1]
)
```
