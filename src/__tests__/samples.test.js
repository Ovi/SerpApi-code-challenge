const path = require('path');
const fs = require('fs');
const { getFileName, readHTMLFile, getHTMLFiles } = require('../utils/index.js');
const parser = require('../parser.js');
const extractData = require('../../index.js');

const outputDir = path.join(__dirname, './__output__');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

getHTMLFiles().forEach(createTestSuite);

function createTestSuite(filenameWithExt) {
  const filename = getFileName(filenameWithExt);

  describe(`Parsing ${filename} HTML`, () => {
    let artworks = [];

    test('File created without error', () => {
      expect(extractData(filename, outputDir)).toBeUndefined();
      artworks = parser(readHTMLFile(filename));
    });

    test('At least one artwork found', () => {
      expect(artworks.length).toBeGreaterThan(0);
    });

    test('All artworks have names', () => {
      artworks.forEach((work) => expect(work.name.length).toBeGreaterThan(0));
    });

    test('All artworks have links', () => {
      artworks.forEach((work) => expect(work.link.length).toBeGreaterThan(0));
    });

    test('Some artworks have images', () => {
      const hasImages = artworks.some((work) => work.image);
      expect(hasImages).toBe(true);
    });

    test('Extensions are optional', () => {
      const hasExtensions = artworks.every((work) => work.extensions === undefined || Array.isArray(work.extensions));
      expect(hasExtensions).toBe(true);
    });

    test('Extensions is an array of strings', () => {
      const hasValidExtensions = artworks.every((work) => {
        if (work.extensions) {
          return work.extensions.length === 1 && typeof work.extensions[0] === 'string';
        }
        return true;
      });
      expect(hasValidExtensions).toBe(true);
    });

    test('All links are valid', () => {
      const isValidLink = artworks.every((work) => work.link.startsWith('https://www.google.com'));
      expect(isValidLink).toBe(true);
    });

    test('All images are valid', () => {
      const isValidImage = artworks.every((work) => work.image === null || work.image.startsWith('data:image'));
      expect(isValidImage).toBe(true);
    });
  });
}
