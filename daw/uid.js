//
// DAW UID
// (c) Thor Muto Asmund, 2018
//


class UID {
  static getUID() {
    if (UID.uid === undefined) {
      UID.uid = 0;
    }
    return UID.uid++;
  }
}

module.exports = { UID };