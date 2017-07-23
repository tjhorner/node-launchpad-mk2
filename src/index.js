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

/**
 * A Launchpad instance.
 * 
 * @class Launchpad
 * @extends {EventEmitter}
 */
export default class Launchpad extends EventEmitter {
  /**
   * Creates an instance of Launchpad.
   * 
   * @param {Object} params The paramaters to instantiate the Launchpad.
   * @param {Number} params.in The input port of the Launchpad.
   * @param {Number} params.out The output port of the Launchpad.
   * 
   * @example
   * let myLaunchpad = new Launchpad({
   *   in: 1,
   *   out: 1
   * })
   * 
   * @memberOf Launchpad
   */
  constructor(params) {
    super()

    /**
     * All the buttons on this Launchpad. Get one by using `getButton`.
     * @type {Button[]}
     */
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

  /**
   * Convenience method to add the system-exclusive message header to a message
   * and then send it to the Launchpad.
   * 
   * @param {Number[]} bytes The bytes of the SysEx message to send. Header is automatically included.
   * 
   * @example
   * myLaunchpad.sendSysEx([0, 1, 2, 3])
   * 
   * @memberOf Launchpad
   */
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

  /**
   * Get a button on this Launchpad
   * 
   * @param {Number} x The x-coordinate of the button.
   * @param {Number} y The y-coordinate of the button.
   * @returns {Button}
   * 
   * @example
   * let button = myLaunchpad.getButton(1, 2)
   * 
   * // do whatever with the button
   * button.setRgbColor(10, 30, 10)
   * 
   * @memberOf Launchpad
   */
  getButton(x, y) {
    return this.buttons[(x.toString() === "0" ? "" : x.toString()) + y.toString()]
  }

  /**
   * Convenience method to light up all the buttons on the Launchpad a certain color.
   * 
   * @param {Number} color Note representation of the color.
   * 
   * @example
   * myLaunchpad.lightAll(23)
   * 
   * @memberOf Launchpad
   */
  lightAll(color) {
    this.sendSysEx([14, color])
  }

  /**
   * Convenience method to light up all the buttons on the Launchpad a certain color with RGB values.
   * 
   * @param {Number} r Red value. 0-63
   * @param {Number} g Green value. 0-63
   * @param {Number} b Blue value. 0-63
   * 
   * @example
   * myLaunchpad.lightAllRgb(10, 30, 10)
   * 
   * @memberOf Launchpad
   */
  lightAllRgb(r, g, b) {
    this.buttons.forEach(button => button.setRgbColor(r, g, b))
  }

  /**
   * Convenience method to darken all buttons on the Launchpad.
   * 
   * @example
   * myLaunchpad.darkAll()
   * 
   * @memberOf Launchpad
   */
  darkAll() {
    this.buttons.forEach(button => button.setColor(0))
  }

  /**
   * Set the Launchpad's layout.
   * 
   * @param {String} layout The layout you want to switch to. Can be one of _NOTE, DRUM, FADER, PROGRAMMER_.
   * 
   * @example
   * myLaunchpad.toLayout("PROGRAMMER")
   * 
   * @memberOf Launchpad
   */
  toLayout(layout) {
    this._output.sendMessage([240, 0, 32, 41, 2, 16, 44, layouts[layout], 247])
  }

  /**
   * Scroll text across the Launchpad.
   * 
   * @param {String} text The text to scroll.
   * @param {Number} color Note representation of the text color.
   * @param {Boolean} loop If true, will loop the text scrolling until another text scroll message is sent.
   * @param {Number} speed The speed of the text scrolling. 1-7
   * 
   * @example
   * myLaunchpad.scrollText("Hello node!", 23, true, 5)
   * 
   * @memberOf Launchpad
   */
  scrollText(text, color, loop, speed) {
    var message = [20, color, loop]

    loop = loop ? 1 : 0

    for(var i=0;i<text.length;i++)
      message.push(text.charCodeAt(i))
    
    this.sendSysEx(message)
    if(speed) this.sendSysEx([20, color, loop, speed])
  }
}