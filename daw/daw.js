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
const { Effect } = require('./effect');
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

  static Effect(process, object, options = {}) {
    const effect = Effect.create(process, object, options);
    return effect;
  }

  static Go(options = {}) {
    options = {
      args: process.argv.slice(2), 
      mode: undefined,
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

    if (!options.mode) {
      throw new TypeError('Mode not speified');
    }

    var modeFunc;
    switch(options.mode) {
      case 'log':
        modeFunc = DAW.log;
        break;
      case 'play':
        modeFunc = DAW.play;
        break;
      case 'save':
        modeFunc = DAW.save;
        break;
      default:
        throw new TypeError('Unknown mode: ' + options.mode);
    }

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
      modeFunc(buffers, modeArgs);
    }).catch(e => {
      console.log("DAW ERROR", e)
    });
  }

  static log(buffers) {
    console.log(buffers[0]);
    if (Song.default.input.numberOfChannels != 1) {
      console.log(buffers[1]);
    }
  }

  static play() {

  }

  static save(buffers, args) {
    var filePath = !args[0] ? './output.wav' : args[0];

    var audioBuffer = new AudioBuffer({
      length: buffers[0].length,
      sampleRate: Song.default.sampleRate,
      numberOfChannels: Song.default.input.numberOfChannels
    });
    audioBuffer.copyToChannel(buffers[0], 0);
    if (Song.default.input.numberOfChannels == 2) {
      audioBuffer.copyToChannel(buffers[1], 1);
    }

    var arrayBuffer = toWav(audioBuffer);
    fs.writeFileSync(filePath, new Buffer(arrayBuffer));
  }
}

module.exports = { DAW };