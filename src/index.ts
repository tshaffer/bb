import * as fs from 'fs';

import { ImageModeType } from '@brightsign/bscore';

console.log('Hello big world!')
console.log(ImageModeType.ScaleToFill);

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});

const autoPlayFilePath = process.argv[2];
console.log('autoplay file path: ' + autoPlayFilePath);

const autoplayFile: Buffer = fs.readFileSync(autoPlayFilePath);
console.log('autoplay file: ' + autoplayFile);

const autoplay = JSON.parse(autoplayFile.toString());
console.log('autoplay: ' + autoplay);

// const autoplayProperties = Object.keys(autoplay);
// for (const autoplayProperty of autoplayProperties) {
//   console.log('autoplay property: ' + autoplayProperty);
// }

const autoplayStr = JSON.stringify(autoplay, null, 4); // (Optional) beautiful indented output.
console.log(autoplayStr); // Logs output to dev tools console.
