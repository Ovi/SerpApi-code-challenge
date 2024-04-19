const fs = require('fs');
const path = require('path');
const { getFileName, readHTMLFile, getOutputFilesDir, getHTMLFiles } = require('./src/utils/index.js');
const parser = require('./src/parser.js');

getHTMLFiles().forEach((file) => extractData(file));

function extractData(filenameWithExt, outputDir = getOutputFilesDir()) {
  const filename = getFileName(filenameWithExt);
  const htmlContent = readHTMLFile(filename);

  const parsedJSON = parser(htmlContent);

  const filePath = path.join(outputDir, `array-${filename}.json`);
  fs.writeFileSync(filePath, JSON.stringify(parsedJSON || [], null, 2), 'utf-8');
}

module.exports = extractData;
