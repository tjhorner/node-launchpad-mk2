# launchpad-mk2

A node module for interacting with the Launchpad MK2 and Launchpad Pro. Except that it doesn't really work with the MK2 at the moment. Sorry.

If you're looking for a module to interact with the original Launchpad or Launchpad S, check [here](https://www.npmjs.com/package/midi-launchpad).

## Self-documenting example

```javascript
var LaunchpadMK2 = require('launchpad-mk2'), // require the module
    // create a new Launchpad instance
    launchpad = new LaunchpadMK2.connect({
      in: 0 // the input port of the launchpad
      out: 0 // the output port
      type: LaunchpadMK2.types.PRO // PRO/MK2 (PRO only works now)
    });

// on button press
launchpad.on("press", function(button, velocity){
  // a Button instance
  console.log(button);

  // the grid is set up where the bottom left pad is (1, 1)
  console.log(button.x, button.y);

  // set a button's color
  // pass getColor an RGB value and it will find the closest color the launchpad can display
  button.setColor(LaunchpadMK2.getColor(255, 0, 255));

  // darken a button
  button.darken();

  // get the MIDI note for this button
  console.log(button.getNote());

  // since the pads are pressure-sensitive, velocity is passed as well
  console.log(velocity);
});

// on button release
launchpad.on("release", function(button){
  // a Button instance
  console.log(button);
});
```
