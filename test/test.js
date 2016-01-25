// TODO: actual tests
var Launchpad = require('..'),
    launchpad = new Launchpad.connect({
      in: 1,
      out: 1,
      type: Launchpad.types.PRO
    });

launchpad.toLayout(Launchpad.layouts.PROGRAMMER);

launchpad.darkAll();

// launchpad.getButton(8, 1).setColor(Launchpad.getColor(255, 0, 0));
// launchpad.getButton(1, 1).setColor(Launchpad.getColor(0, 255, 0));
// launchpad.getButton(8, 8).setColor(Launchpad.getColor(255, 255, 0));
// launchpad.getButton(1, 8).setColor(Launchpad.getColor(0, 0, 255));

launchpad.scrollText("launchpad-mk2 node module", 50, 0, 6);

launchpad.on("press", function(button, velocity){
  console.log("Button", button.x, button.y, "pressed with velocity", velocity);
  // button.setColor(Math.floor((Math.random() * 127) + 1));
  button.pulseColor(Math.floor((Math.random() * 127) + 1));
  // button.setRgbColor(30, 10, 0);
  if(button.x === 1 && button.y === 0) launchpad.darkAll();
});
