/**
 * Represents a button on the Launchpad.
 * 
 * @class Button
 */
export default class Button{
  /**
   * Creates an instance of Button. You shouldn't need to use this, Buttons are generated with a Launchpad instance.
   * @param {Launchpad} launchpad The Launchpad this button belongs to.
   * @param {Number} note The note representation of the button, used when sending messages to the Launchpad.
   * 
   * @memberOf Button
   */
  constructor(launchpad, note) {
    /**
     * The Launchpad this button belongs to.
     * @type {Launchpad}
     */
    this.launchpad = launchpad

    /**
     * The note representation of this button.
     * @type {Number}
     */
    this.note = note

    var noteAsString = note.toString().split("")

    /**
     * The x-coordinate of this button.
     * @type {Number}
     */
    this.x = null

    /**
     * The y-coordinate of this button.
     * @type {Number}
     */
    this.y = null

    if(noteAsString[1] === "0"){
      // left button
      this.x = 0
      this.y = parseInt(noteAsString[0])
    }else if(!noteAsString[1]){
      // bottom button
      this.x = parseInt(noteAsString[0])
      this.y = 0
    }else{
      // any other
      this.x = parseInt(noteAsString[1]) || 0
      this.y = parseInt(noteAsString[0]) || 0
    }

    /**
     * The current color of the button.
     * @type {Number}
     */
    this.color = 0
  }

  /**
   * Set the color of this button.
   * 
   * @param {Number} color The note representation of the color.
   * 
   * @example
   * var button = launchpad.getButton(0, 0)
   * button.setColor(2)
   * 
   * @memberOf Button
   */
  setColor(color) {
    this.launchpad._output.sendMessage([144, this.note, color])
  }

  /**
   * Pulse a color in and out on a button/
   * 
   * @param {Number} color The note representation of the color.
   * 
   * @example
   * var button = launchpad.getButton(0, 0)
   * button.pulseColor(2)
   * 
   * @memberOf Button
   */
  pulseColor(color) {
    this.launchpad.sendSysEx([40, this.note, color])
  }

  /**
   * Set a color on the button with RGB values.
   * 
   * @param {Number} r Red value. 0-63
   * @param {Number} g Green value. 0-63
   * @param {Number} b Blue value. 0-63
   * 
   * @example
   * var button = launchpad.getButton(0, 0)
   * button.setRgbColor(255, 255, 255) // set color to white
   * 
   * @memberOf Button
   */
  setRgbColor(r, g, b) {
    this.launchpad.sendSysEx([11, this.note, r, g, b])
  }

  /**
   * Convenience method for setting the button's color to 0.
   * 
   * @example
   * var button = launchpad.getButton(0, 0)
   * button.darken()
   * 
   * @memberOf Button
   */
  darken() {
    this.launchpad._output.sendMessage([144, this.note, 0])
  }
}