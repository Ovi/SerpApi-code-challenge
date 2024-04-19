const path = require('path');
const fs = require('fs');
const { readHTMLFile } = require('../utils/index.js');
const parser = require('../parser.js');
const extractData = require('../../index.js');

const outputDir = path.join(__dirname, './__output__');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const expectedJSONPath = path.join(__dirname, '../../files/expected-array.json');
const expectedJSON = JSON.parse(fs.readFileSync(expectedJSONPath, 'utf-8'));

describe('HTML File Handling', () => {
  test('Read HTML file content: van-gogh-paintings', () => {
    const fileString = readHTMLFile('van-gogh-paintings');
    expect(fileString).not.toBeNull();
  });
});

describe('Parsing Van Gogh Paintings HTML', () => {
  let artworks = [];

  test('File created without error', () => {
    expect(extractData('van-gogh-paintings', outputDir)).toBeUndefined();
    artworks = parser(readHTMLFile('van-gogh-paintings'));
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

  test('Some artworks have extensions', () => {
    const hasExtensions = artworks.some((work) => work.extensions);
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

describe('Create output HTML of Van Gogh Paintings', () => {
  test('File created without error', () => {
    expect(extractData('van-gogh-paintings', outputDir)).toBeUndefined();
  });

  test('Output file is created', () => {
    const outputPath = path.join(outputDir, 'array-van-gogh-paintings.json');
    const fileContent = fs.readFileSync(outputPath, 'utf-8');
    expect(fileContent).not.toBeNull();
  });
});

describe('Comparison with Expected Artwork Data', () => {
  let artworks = [];

  test('File created without error', () => {
    expect(extractData('van-gogh-paintings', outputDir)).toBeUndefined();
    artworks = parser(readHTMLFile('van-gogh-paintings'));
  });

  test('Has same number of artworks as expected', () => {
    expect(artworks.length).toBe(expectedJSON.length);
  });

  test('Artworks have matching names with expected', () => {
    artworks.forEach((artwork, index) => {
      expect(artwork.name).toBe(expectedJSON[index].name);
    });
  });

  test('Artworks have matching links with expected', () => {
    artworks.forEach((artwork, index) => {
      expect(artwork.link).toBe(expectedJSON[index].link);
    });
  });

  test('Artworks have matching extensions with expected', () => {
    artworks.forEach((artwork, index) => {
      expect(artwork.extensions).toEqual(expectedJSON[index].extensions);
    });
  });

  test('Artworks have matching images with expected', () => {
    artworks.forEach((artwork, index) => {
      expect(artwork.image).toEqual(expectedJSON[index].image);
    });
  });

  test('Arrays are identical', () => {
    expect(artworks).toEqual(expectedJSON);
  });
});
