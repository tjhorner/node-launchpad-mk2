var midi = require('midi'),
    color = require('./helpers/color'),
    Button = require('./helpers/button'),
    EventEmitter = require('events'),
    util = require('util');

var types = {
  PRO: 0,
  MK2: 1
};

function Launchpad(params){
  EventEmitter.call(this);

  var self = this;

  this.type = params.type;

  this._input = new midi.input();
  this._output = new midi.output();

  self._input.openPort(params.in);

  self._input.on("message", function(dTime, message){
    if(message[0] === 176 || message[0] === 144){
      // button message
      if(message[2] > 0){
        self.emit("press", self.buttons[message[1]], message[2]);
      }else{
        self.emit("release", self.buttons[message[1]]);
      }
    }
  });

  self._output.openPort(params.out);

  this.buttons = [ ];

  if(self.type === types.PRO){
    for(var i=0;i<100;i++){
      self.buttons.push(new Button(self, i));
    }
  }else{
    throw new Error("// TODO: Implement MK2 support.");
  }

  // convenience method for adding the header and terminator to sysex messages
  this.sendSysEx = function(bytes){
    // sysex header
    var message = [240, 0, 32, 41, 2, 16];
    // sysex message
    bytes.forEach(function(byte){
      message.push(byte);
    });
    // sysex terminator
    message.push(247);
    // console.log("sysex", message);
    self._output.sendMessage(message);
  }

  this.getButton = function(x, y){
    return self.buttons[(x.toString() === "0" ? "" : x.toString()) + y.toString()];
  }

  this.lightAll = function(color){
    self.sendSysEx([14, color]);
    // self.buttons.forEach(function(button){
    //   button.setColor(color);
    // });
  }

  this.lightAllRgb = function(r, g, b){
    self.buttons.forEach(function(button){
      button.setRgbColor(r, g, b);
    });
  }

  this.darkAll = function(){
    self.buttons.forEach(function(button){
      button.setColor(0);
    });
  }

  this.toLayout = function(layout){
    self._output.sendMessage([240, 0, 32, 41, 2, 16, 44, layout, 247]);
  }

  this.scrollText = function(text, color, loop, speed){
    var message = [20, color, loop];
    for(var i=0;i<text.length;i++){
      message.push(text.charCodeAt(i));
    }
    self.sendSysEx(message);
    if(speed) self.sendSysEx([20, color, loop, speed]);
  }

  return this;
}

util.inherits(Launchpad, EventEmitter);

module.exports = {
  connect: Launchpad,
  types: types,
  getColor: color.getLaunchpadColor,
  layouts: {
    NOTE: 0,
    DRUM: 1,
    FADE: 2,
    PROGRAMMER: 3
  }
};
