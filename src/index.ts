import * as fs from 'fs';

import { createStore, applyMiddleware, combineReducers, Store } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { bsDmReducer } from '@brightsign/bsdatamodel';
import { generateBpfx } from './bpfxGenerator';
import { ArAutoplay, ArSign, Autoplay } from './types';

console.log('Hello world!')

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

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});

const autoPlayFilePath = process.argv[2];
console.log('autoplay file path: ' + autoPlayFilePath);

const autoplayFile: Buffer = fs.readFileSync(autoPlayFilePath);
// console.log('autoplay file: ' + autoplayFile);

const autoplay: ArAutoplay = JSON.parse(autoplayFile.toString());
// console.log('autoplay: ' + autoplay);

store.dispatch(generateBpfx(autoplay.BrightAuthor));

// const autoplayStr = JSON.stringify(autoplay, null, 4); // (Optional) beautiful indented output.
// console.log(autoplayStr); // Logs output to dev tools console.


