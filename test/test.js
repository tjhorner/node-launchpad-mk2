// TODO: actual tests
var Launchpad = require('..'),
    launchpad = new Launchpad.connect({
      in: 0,
      out: 1,
      type: Launchpad.types.PRO
    });

launchpad.darkAll();

// launchpad.getButton(8, 1).setColor(Launchpad.getColor(255, 0, 0));
// launchpad.getButton(1, 1).setColor(Launchpad.getColor(0, 255, 0));
// launchpad.getButton(8, 8).setColor(Launchpad.getColor(255, 255, 0));
// launchpad.getButton(1, 8).setColor(Launchpad.getColor(0, 0, 255));

launchpad.on("press", function(button, velocity){
  console.log("Button", button.x, button.y, "pressed with velocity", velocity);
  button.setColor(Math.floor((Math.random() * 127) + 1));
  if(button.x === 1 && button.y === 0) launchpad.darkAll();
  launchpad.forceBootloader();
});
