import excel from '../assets/image/excel.png';
import file from '../assets/image/file.png';
import folder from '../assets/image/folder.png';
import image from '../assets/image/image.png';
import md from '../assets/image/md.png';
import pdf from '../assets/image/pdf.png';
import ppt from '../assets/image/ppt.png';
import psd from '../assets/image/psd.png';
import txt from '../assets/image/txt.png';
import video from '../assets/image/video.png';
import zip from '../assets/image/zip.png';

const mapping = {
  xlsx: excel,
  xls: excel,
  csv: excel,
  md: md,
  pdf: pdf,
  pptx: ppt,
  ppt: ppt,
  psd: psd,
  txt: txt,
  mp4: video,
  mov: video,
  avi: video,
  flv: video,
  wmv: video,
  mkv: video,
  jpg: image,
  jpeg: image,
  png: image,
  bmp: image,
  gif: image,
  webp: image,
  zip: zip,
  rar: zip,
  '7z': zip,
  tar: zip,
  gz: zip,
  bz2: zip,
  js: txt,
  jsx: txt,
  html: txt,
  css: txt,
  scss: txt,
  sass: txt,
  less: txt,
  json: txt,
  xml: txt,
  yml: txt,
  yaml: txt,
  mdx: txt,
  graphql: txt,
  toml: txt,
  env: txt,
  sql: txt,
  php: txt,
  py: txt,
  rb: txt,
  java: txt,
  go: txt,
  swift: txt,
  c: txt,
  cpp: txt,
  h: txt,
  hpp: txt,
  cs: txt,
  vb: txt,
  ts: txt,
  tsx: txt,
  map: txt,
  lock: txt,
  npmrc: txt,
  gitignore: txt,
  editorconfig: txt,
  eslintignore: txt,
  prettierignore: txt,
  prettierrc: txt,
  babelrc: txt,
  gitattributes: txt,
  'tern-project': txt,
  npmignore: txt,
  watchmanconfig: txt,
  hgignore: txt,
  'npm-debug.log': txt,
  'yarn-error.log': txt,
  'yarn-debug.log': txt,
  DS_Store: txt,
  'desktop.ini': txt,
  'thumbs.db': txt,
  'ehthumbs.db': txt,
  'npm-debug.log*': txt,
  'yarn-error.log*': txt,
  'yarn-debug.log*': txt,
};

export function getImage(name, isFolder) {
  if (isFolder) {
    return folder;
  }
  const nameSplit = name.split('.');
  if (nameSplit.length === 0) {
    return file;
  }
  const suffix = nameSplit[nameSplit.length - 1].toLowerCase();
  const img = mapping[suffix];
  if (img === undefined) {
    return file;
  }
  return img;
}
