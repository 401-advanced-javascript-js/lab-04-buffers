'use strict';

const fs = require('fs');
const util = require('util');

const writeFileAsync = util.promisify(fs.writeFile);

const loopJS = `'use strict'; ['Jake', 'John', 'Jill'].forEach((name) => console.log(name));`;

let buffer = Buffer.alloc(0);
loopJS.split('').forEach((encodedBit) => {
  buffer = Buffer.concat([buffer, Buffer.alloc(1, encodedBit.charCodeAt(0))]);
});

// write to file and console message once finished
writeFileAsync('files/loop.js', buffer).then(() => console.log('loop.js'));

// Part 2 ------------------------------------------------------------------------

const articleMaker = require('./lib/articleMaker.js');

articleMaker('./files/pair-programming.txt', './files/article.html');