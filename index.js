'use strict';

const fs = require('fs');
const util = require('util');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const loopJS = `'use strict'; ['Jake', 'John', 'Jill'].forEach((name) => console.log(name));`;

let buffer = Buffer.alloc(0);
loopJS.split('').forEach((encodedBit) => {
  buffer = Buffer.concat([buffer, Buffer.alloc(1, encodedBit.charCodeAt(0))]);
});

// write to file and console message once finished
writeFileAsync('files/loop.js', buffer).then(() => console.log('loop.js'));

// Part 2 ------------------------------------------------------------------------

readFileAsync('./files/pair-programming.txt')
  .then((fileDataBuffer) => {
    let lines = splitBuffer(fileDataBuffer, [10]);
    let html = Buffer.alloc(0);

    for (let line = lines.length - 1; line >= 0; line--) {
      html = Buffer.concat([paragraphToList(lines[line]), html]);
      line--;

      if (isNumbered(lines[line]) && line > 0) {
        html = Buffer.concat([addAroundBuffer(lines[line], '<h3>', '</h3>'), html]);
        line--;

        if (lines[line][0] !== 10 && line > 0) {
          html = Buffer.concat([addAroundBuffer(lines[line], '<h2>', '</h2>'), html]);
          line--;
        }
      } 
      
      if (lines[line][0] !== 10 && line >= 0) {
        html = Buffer.concat([addAroundBuffer(lines[line], '<h2>', '</h2>'), html]);
        line--;
      }
    }
    return html;
  })
  .then((htmlBuffer) => {
    writeFileAsync('./files/index.html', htmlBuffer)
      .then(() => {
        console.log('Article created in index.html');
      })
      .catch((err) => console.log(err));
  })
  .catch((err) => console.error(err));

/**
 * 
 * @param {*} buffer 
 */
function paragraphToList(buffer) {
  buffer = splitBuffer(buffer, [46, 33, 63]);

  buffer[0] = addAroundBuffer(buffer[0], '<li>', '</li>');
  for (let i = 1; i < buffer.length; i++) {
    buffer[i] = addAroundBuffer(buffer[i], '<li>', '</li>');
    buffer[0] = Buffer.concat([buffer[0], buffer[i]]);
  }

  return addAroundBuffer(buffer[0], '<ul>', '</ul>');
}

/**
 * 
 * @param {*} buffer 
 */
function isNumbered(buffer) {
  if (buffer[0] >= 48 && buffer[0] <= 57 && buffer[1] === 46) {
    return true;
  } else {
    return false;
  }
}

/**
 * 
 * @param {*} buffer 
 * @param {*} openTag 
 * @param {*} closeTag 
 */
function addAroundBuffer(buffer, openTag, closeTag) {
  return Buffer.concat([Buffer.from(openTag), buffer, Buffer.from(closeTag)]);
}

/**
 *
 * @param {*} buffer
 * @param {*} splitVal
 */
function splitBuffer(buffer, splitVals) {
  let arrayOfBuffers = [];

  for (let i = 0; i < buffer.length; i++) {
    // index of next new line
    let nextIndex = indexOf(buffer, splitVals, i);

    if (nextIndex !== -1) {
      arrayOfBuffers.push(buffer.slice(i, nextIndex + 1));
      i = nextIndex;
    } else if (i < buffer.length) {
      arrayOfBuffers.push(buffer.slice(i, buffer.length));
      i = buffer.length;
    }
  }
  return arrayOfBuffers;
}

/**
 *
 * @param {*} buffer
 * @param {*} values
 * @param {*} start
 */
function indexOf(buffer, values, start) {
  // values.map(val => val.hexDecode());
  for (let i = start; i < buffer.length; i++) {
    if (values.includes(buffer[i])) {
      return i;
    }
  }
  return -1;
}
