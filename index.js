'use strict';

const fs = require('fs');
const util = require('util');

const writeFileAsync = util.promisify(fs.writeFile);

const loopJS = `['Jake', 'John', 'Jill'].forEach((name) => console.log(name));`;

// convert code to UTF-16
let encodedLoopJS = loopJS.split('').map((char)=> char.charCodeAt(0));


console.log(loopJS);