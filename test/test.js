// TODO: actual tests
var Launchpad = require('..'),
    launchpad = new Launchpad({
      in: 1,
      out: 1
    })

launchpad.toLayout("PROGRAMMER")

launchpad.darkAll()

launchpad.scrollText("launchpad-mk2 node module", 50, 0, 6)

launchpad.on("press", function(button, velocity){
  console.log("Button", button.x, button.y, "pressed with velocity", velocity)
  button.pulseColor(Math.floor((Math.random() * 127) + 1))
  if(button.x === 1 && button.y === 0) launchpad.darkAll()
})
