const fs = require('fs');
const handler = require('node-unzip-2');
const chalk = require('chalk');

/**
 * unzip()
 * @param {*} source
 * @param {*} dest
 * @returns
 * @copyfrom https://github.com/gmsoft-happyCoding/stormrage/blob/master/lib/utils/doUnzip.js
 */
const unzip = (source, dest) => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(source)
      .pipe(handler.Extract({
        path: dest
      }))
      .on('close', (err) => {
        if (err) {
          console.error(err)
          reject(false)
          process.exit(1);
        } else {
          resolve(true);
        }
      });
  });
};

module.exports = unzip;