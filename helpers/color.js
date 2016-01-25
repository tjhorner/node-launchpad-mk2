// TODO we don't need this anymore
// since I discovered sysex messages

var launchColors = require('./colors.json');

Array.min = function(array){
  return Math.min.apply(Math, array);
};

module.exports = {
  getLaunchpadColor: function(r, g, b){
    var differenceArray = [ ];

    launchColors.forEach(function(value, index){
      var launchColorR = value[0];
      var launchColorG = value[1];
      var launchColorB = value[2];

      differenceArray.push(Math.sqrt((r-launchColorR)*(r-launchColorR)+(g-launchColorG)*(g-launchColorG)+(b-launchColorB)*(b-launchColorB)));
    });

    var lowest = Array.min(differenceArray);

    var index = differenceArray.indexOf(lowest);

    return index;
  }
}
