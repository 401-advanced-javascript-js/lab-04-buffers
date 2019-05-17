'use strict';

jest.mock('fs');

const articleMaker = require('../lib/articleMaker.js');

describe('Article Maker', () => {
  it('', () => {
    return articleMaker(
      '/Users/jag/School/codefellows/401/labs/lab-04-buffers/files/pair-programming.txt',
      './testing.html'
    )
      .then((result) => {
        expect(result).toBeInstanceOf(Buffer);
        expect(Buffer.isBuffer(result)).toBeTruthy();
      })
      .catch((err) => {});
  });


  it('should be wrapped in an article tag', () => {

  });

  it('', () => {
    
  });
});
