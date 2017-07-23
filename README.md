# launchpad-mk2

[Documentation](https://tjhorner.com/node-launchpad-mk2/)

A node module for interacting with the Launchpad Pro.

If you're looking for a module to interact with the original Launchpad or Launchpad S, check [here](https://www.npmjs.com/package/midi-launchpad).

# VERSION 2.0.0 HAS MAJOR BREAKING CHANGES

The entire module has been rewritten to be more modern and use ES6 features.

## Getting Started

Here's an example to get you started:

```js
import Launchpad from "launchpad-mk2"

let myLaunchpad = new Launchpad({
  in: 1,
  out: 1
})

myLaunchpad.lightAll(3)
```