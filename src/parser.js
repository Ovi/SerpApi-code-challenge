const { parse } = require('node-html-parser');

let root = null;
let imageFnStrings = [];

function parser(html) {
  root = parse(html);

  const carouselElements = root.querySelectorAll('#appbar g-scrolling-carousel a');
  if (!carouselElements.length) return [];

  getAllImagesFromScripts();

  return carouselElements.map(getDetailsFromCarouselItem).filter((i) => i.name);
}

function getDetailsFromCarouselItem(anchorEl) {
  const { 'aria-label': name, title, href } = anchorEl.attributes;

  let extensions;
  if (name && title && name !== title) {
    const text = getBracketedText(title);
    extensions = text ? [text] : null;
  }

  if (!extensions) {
    extensions = anchorEl.querySelectorAll('.klmeta')?.map((e) => e.innerText);
  }

  const link = `https://www.google.com${href}`;

  const details = {
    name,
    ...(extensions?.length && { extensions }),
    link,
    image: null,
  };

  const image = extractImage(anchorEl);
  if (image) details.image = image;

  return details;
}

function extractImage(anchorEl) {
  const imageEl = anchorEl.querySelector('g-img img');
  const imgSrc = imageEl?.attributes?.src;

  if (imgSrc?.startsWith('data:image/jpeg;base64') && imgSrc?.length > 100) {
    return imgSrc;
  }

  const imgId = imageEl?.attributes?.id;
  if (!imgId) return null;

  const imageFnStr = imageFnStrings.find((item) => item.indexOf(`ii=['${imgId}']`) > 0);
  const imageBase64 = imageFnStr?.match(/data:image\/jpeg;base64,(.*?[^';])'/i)?.[0];
  return imageBase64?.replace(/\\x/g, 'x')?.replace(/'$/, '');
}

function getAllImagesFromScripts() {
  const textContent = root.querySelectorAll('script').reduce((acc, tag) => {
    if (tag.innerText.includes('_setImagesSrc')) {
      acc += tag.innerText;
    }

    return acc;
  }, '');

  imageFnStrings = textContent.split('_setImagesSrc(ii,s)');
}

function getBracketedText(text) {
  return text.match(/\(([^)]+)\)/)?.[1];
}

module.exports = parser;
