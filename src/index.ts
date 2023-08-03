import * as fs from 'fs';

import { createStore, applyMiddleware, combineReducers, Store } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { ImageModeType } from '@brightsign/bscore';
import { bsDmReducer } from '@brightsign/bsdatamodel';

console.log('Hello big world!')

console.log(ImageModeType.ScaleToFill);

const reducers = combineReducers<any>({
  bsdm: bsDmReducer,
});

const store: Store<any> = createStore(
  reducers,
  composeWithDevTools(
    applyMiddleware(
      thunk,
    ),
  )
);

// store.dispatch();

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
