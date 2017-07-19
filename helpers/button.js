class Button{
  constructor(launchpad, note) {
    this.launchpad = launchpad
    this.note = note

    var noteAsString = note.toString().split("")

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

    this.color = 0
  }

  setColor(color) {
    this.launchpad._output.sendMessage([144, this.note, color])
  }

  pulseColor(color) {
    this.launchpad.sendSysEx([40, this.note, color])
  }

  // rgb values 0-63
  setRgbColor(r, g, b) {
    this.launchpad.sendSysEx([11, this.note, r, g, b])
  }

  darken() {
    this.launchpad._output.sendMessage([144, this.note, 0])
  }
}

module.exports = Button
