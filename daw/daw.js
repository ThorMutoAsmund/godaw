//
// DAW DAW
// (c) Thor Muto Asmund, 2018
//

const fs = require('fs');
const { Song } = require('./song');
const { Track } = require('./track');
const { Mixer } = require('./mixer');
const { Sample } = require('./sample');
const AudioBuffer = require('audio-buffer');
var toWav = require('audiobuffer-to-wav')

class DAW {
  static Song(options = {}) {
    var song = new Song(options);
    return song;
  }

  static Track(options = {}) {
    const track = new Track(options);
    return track;
  }

  static Mixer(options = {}) {
    const mixer = new Mixer(options);
    return mixer;
  }

  static Sample(options = {}) {
    const sample = new Sample(options);
    return sample;
  }

  static Go(options = {}) {
    options = {
      args: process.argv.slice(2), 
      mode: 'null',
      from: 0,
      to: -1,
      ...options};
    
    const optionInt = {
      from: true,
      to: true
    }
    
    var firstArg = true, key = null;
    options.args.forEach(arg => {
      if (firstArg) {
        options.mode = arg.toLowerCase();
        firstArg = false;        
      }
      else if (key === null) {
        if (!arg.startsWith('--')) {
          throw new TypeError('Argument error: ' +  arg);
        }
        key = arg.substring(2);
      }
      else {
        if (optionInt[key]) {
          var isSeconds = false;
          if (arg[arg.length-1] == 's') {
            arg = arg.substring(0, arg.length-1);
            isSeconds = true;
          }
          var intVal = parseInt(arg);
          if (isNaN(intVal)) {
            throw new TypeError('Not an integer: ' +  arg);
          }
          options[key] = isSeconds ? Song.default.secondsToSamples(intVal) : intVal;  
        }
        else {
          options[key] = arg;  
        }
        key = null;
      }
    });

    if (options.to < -1 || options.from < 0) {
      throw new TypeError('"to" and "from" must be positive integers');
    }
    if (options.to != -1 && options.to <= options.from) {
      throw new TypeError('If "to" is specified it should be larger than "from"');
    }

    // TBD: Should be able to calculate correct song length
    if (options.to == -1) {
      options.to = Song.default.secondsToSamples(10);
    }

    const buffers = Song.default.render(options.from, options.to - options.from);

    switch(options.mode) {
      case 'log':
        console.log(buffers[0]);
        if (Song.default.facade.input.numberOfChannels != 1) {
          console.log(buffers[1]);
        }
        break;
      case 'play':
        break;
      case 'save':
        DAW.save(buffers, './output.wav');
        break;
      default:
        throw new TypeError('Unknown mode: ' + options.mode);
    }
  }

  static save(buffers, filePath) {
    var audioBuffer = new AudioBuffer({
      length: buffers[0].length,
      sampleRate: Song.default.sampleRate,
      numberOfChannels: Song.default.facade.input.numberOfChannels
    });
    audioBuffer.copyToChannel(buffers[0], 0);
    if (Song.default.facade.input.numberOfChannels == 2) {
      audioBuffer.copyToChannel(buffers[1], 1);
    }

    var arrayBuffer = toWav(audioBuffer);
    console.log(arrayBuffer);
    fs.writeFileSync(filePath, new Buffer(arrayBuffer));
  }
}

module.exports = { DAW };