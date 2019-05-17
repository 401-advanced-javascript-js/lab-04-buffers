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
// writeFileAsync('files/loop.js', buffer).then(() => console.log('loop.js'));

// Part 2 ------------------------------------------------------------------------

readFileAsync('./files/pair-programming.txt')
  .then((fileDataBuffer) => {
    let textBlockBuffers = splitBuffer(fileDataBuffer, ['\n\n']);
    let html = Buffer.alloc(0);

    for (let block = 0; block < textBlockBuffers.length; block++) {
      // each line in block as a buffer
      let txtBlock = splitBuffer(textBlockBuffers[block], ['\n']);

      // split last line into buffer for each sentence
      let buffer = splitBuffer(txtBlock[txtBlock.length - 1], ['.']);

      // for each sentence add li tags and add to a buffer containing all list items
      let listBuffer = Buffer.alloc(0);
      for (let sentence = 0; sentence < buffer.length; sentence++) {
        listBuffer = Buffer.concat([listBuffer, addAroundBuffer(buffer[sentence], '<li>', '</li>')]);
      }
      buffer = addAroundBuffer(listBuffer, '<ul>', '</ul>');

      console.log(txtBlock[0].toString(), '---------------------------------------', block);
      // second line, h3 or h2
      if (isNumbered(txtBlock[txtBlock.length - 2])) {
        // h3 tags around
        buffer = Buffer.concat([addAroundBuffer(txtBlock[txtBlock.length - 2], '<h3>', '</h3>'), buffer]);

        // has section title
        if (txtBlock.length - 3 === 0) {
          buffer = Buffer.concat([addAroundBuffer(txtBlock[0], '<h2>', '</h2>'), buffer]);
        }
      } else {
        buffer = Buffer.concat([addAroundBuffer(txtBlock[0], '<h2>', '</h2>'), buffer]);
      }
      html = Buffer.concat([html, buffer]);
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



function isNumbered(buffer) {
  if (buffer[0] >= 48 && buffer[0] <= 57 && buffer[1] === 46) {
    return true;
  } else {
    return false;
  }
}

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
      arrayOfBuffers.push(buffer.slice(i, nextIndex+1));
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

  for (let i = start; i < buffer.length; i++) {
    if (values.includes(buffer[i].toString())) {
      return i;
    }
  }
  return -1;
}