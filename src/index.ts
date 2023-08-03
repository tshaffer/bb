import * as fs from 'fs';

import { createStore, applyMiddleware, combineReducers, Store } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { PlayerModel, VideoMode } from '@brightsign/bscore';
import { bsDmReducer, dmNewSign } from '@brightsign/bsdatamodel';

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

store.dispatch(newSign());

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

function newSign(): any {
  return (dispatch: Function, getState: any): any => {
    const name = 'testBpf';
    const signAction: any = dmNewSign(name, VideoMode.v1920x1080x60p, PlayerModel.XT1144);
    dispatch(signAction);
    // return signAction;

    const newState = getState();
    console.log(newState);
  };
}

