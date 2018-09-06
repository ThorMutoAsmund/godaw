//
// DAW DAW
// (c) Thor Muto Asmund, 2018
//

const fs = require('fs');
const G = require('./g');
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
    
    const optionNumber = {
      from: true,
      to: true
    }
    
    var firstArg = 0, key = null;
    var modeArgs = [];;
    options.args.forEach(arg => {
      var isOption = arg.startsWith('--');

      if (firstArg == 0 && !isOption) {
        options.mode = arg.toLowerCase();
        firstArg++;
      }
      else if (firstArg > 0 && !isOption) {
        modeArgs[firstArg - 1] = arg;
        firstArg++;
      }
      else if (key === null) {
        if (!isOption) {
          throw new TypeError('Argument error: ' +  arg);
        }
        key = arg.substring(2);
        firstArg = -1;
      }
      else {
        if (optionNumber[key]) {
          var isSeconds = false;
          if (arg[arg.length - 1] == 's') {
            arg = arg.substring(0, arg.length-1);
            isSeconds = true;
          }
          var numericVal = parseFloat(arg);
          if (isNaN(numericVal)) {
            throw new TypeError('Not a number: ' +  arg);
          }
          options[key] = isSeconds ? G.sec(numericVal) : numericVal;  
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
      options.to = G.sec(10);
    }

    return Song.default.render(options.from, options.to - options.from).then(buffers => {
      console.log('Buffers rendered ' + buffers[0].length);
      switch(options.mode) {
        case 'log':
          console.log(buffers[0]);
          if (Song.default.getInput().numberOfChannels != 1) {
            console.log(buffers[1]);
          }
          break;
        case 'play':
          break;
        case 'save':
          if (!modeArgs[0]) {
            modeArgs[0] = './output.wav';
          }
          DAW.save(buffers, modeArgs[0]);
          break;
        default:
          throw new TypeError('Unknown mode: ' + options.mode);
      }
    }).catch(e => {
      console.log("DAW ERROR", e)
    });
  }

  static save(buffers, filePath) {
    var audioBuffer = new AudioBuffer({
      length: buffers[0].length,
      sampleRate: Song.default.sampleRate,
      numberOfChannels: Song.default.getInput().numberOfChannels
    });
    audioBuffer.copyToChannel(buffers[0], 0);
    if (Song.default.getInput().numberOfChannels == 2) {
      audioBuffer.copyToChannel(buffers[1], 1);
    }

    var arrayBuffer = toWav(audioBuffer);
    fs.writeFileSync(filePath, new Buffer(arrayBuffer));
  }
}

module.exports = { DAW };