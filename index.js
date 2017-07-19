const midi = require('midi'),
      Button = require('./helpers/button'),
      EventEmitter = require('events'),
      util = require('util')

var layouts = {
  NOTE: 0,
  DRUM: 1,
  FADE: 2,
  PROGRAMMER: 3
}

class Launchpad extends EventEmitter {
  constructor(params) {
    super()

    this.buttons = [ ]
    
    this._input = new midi.input()
    this._output = new midi.output()

    this._input.openPort(params.in)

    this._input.on("message", (dTime, message) => {
      if(message[0] === 176 || message[0] === 144){
        // button message
        if(message[2] > 0)
          this.emit("press", this.buttons[message[1]], message[2])
        else
          this.emit("release", this.buttons[message[1]])
      }
    })

    this._output.openPort(params.out)

    for(var i=0;i<100;i++)
      this.buttons.push(new Button(self, i))
  }

  // convenience method for adding the header and terminator to sysex messages
  sendSysEx(bytes){
    // sysex header
    var message = [240, 0, 32, 41, 2, 16]
    // sysex message
    bytes.forEach(byte => message.push(byte))
    // sysex terminator
    message.push(247)
    // console.log("sysex", message)
    this._output.sendMessage(message)
  }

  getButton(x, y) {
    return this.buttons[(x.toString() === "0" ? "" : x.toString()) + y.toString()]
  }

  lightAll(color) {
    this.sendSysEx([14, color])
  }

  lightAllRgb(r, g, b) {
    this.buttons.forEach(button => button.setRgbColor(r, g, b))
  }

  darkAll() {
    this.buttons.forEach(button => button.setColor(0))
  }

  toLayout(layout) {
    this._output.sendMessage([240, 0, 32, 41, 2, 16, 44, layouts[layout], 247])
  }

  scrollText(text, color, loop, speed) {
    var message = [20, color, loop]

    for(var i=0;i<text.length;i++)
      message.push(text.charCodeAt(i))
    
    this.sendSysEx(message)
    if(speed) this.sendSysEx([20, color, loop, speed])
  }
}

module.exports = Launchpad