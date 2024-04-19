const fs = require('fs');
const path = require('path');

function readHTMLFile(fileName) {
  const filePath = path.join(__dirname, '../../', 'html-files', `${fileName}.html`);
  return fs.readFileSync(filePath, 'utf-8');
}

function getFileName(filePath) {
  return path.basename(filePath, path.extname(filePath));
}

function getHTMLFiles() {
  const htmlFilesDir = path.join(__dirname, '../../', 'html-files');
  return fs.readdirSync(htmlFilesDir);
}

function getOutputFilesDir() {
  return path.join(__dirname, '../../', 'output-files');
}

module.exports = {
  readHTMLFile,
  getFileName,
  getHTMLFiles,
  getOutputFilesDir,
};
