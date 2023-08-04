import * as fs from 'fs';

import { createStore, applyMiddleware, combineReducers, Store } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { bsDmReducer } from '@brightsign/bsdatamodel';
import {
  BsBpfxState,
  BsBpfxInteractiveCanvasState,
  BsBpfxScreenLayoutSettingsState,
  BsBpfxSelectionState,
  BsBpfxPropertiesSelectables,
  BsBpfxAssetMenuTab,
  BsBpfxEventMenuState,
  BsBpfxLiveTextState
} from '@brightsign/bacon-core';
import { generateBpfx } from './bpfxGenerator';
import { ArAutoplay } from './types';
import { ContentItemType } from '@brightsign/bscore';

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

const bpfxFilePath = process.argv[3];
console.log('bpfxFilePath file path: ' + bpfxFilePath);

const autoplayFile: Buffer = fs.readFileSync(autoPlayFilePath);

const autoplay: ArAutoplay = JSON.parse(autoplayFile.toString());

const promise: Promise<any> = store.dispatch(generateBpfx(autoplay.BrightAuthor));
promise.then( (bpfData: any) => {
  const bpfxState: BsBpfxState = createProjectFileStateFromState(bpfData);
  console.log(bpfxState);

  const bpfxStateStr: string = JSON.stringify(bpfxState);
  fs.writeFileSync(bpfxFilePath, bpfxStateStr, 'utf8');
})

const eventMenuState: BsBpfxEventMenuState = {
  isOpen: true,
  showTitles: true
};

const selectionState : BsBpfxSelectionState = {
  hovered: null,
  selectionContainer: {
    id: BsBpfxPropertiesSelectables.PRESENTATION,
    // FIXME: this seems really wrong, the type property is declared as a ContentItemType!
    type: BsBpfxPropertiesSelectables.PRESENTATION as ContentItemType,
    selectableType: BsBpfxPropertiesSelectables.PRESENTATION,
  },
  selectionEntities: {},
  isEventAdvancedEnabled: false,
  activeAssetMenuTab: BsBpfxAssetMenuTab.ASSETS,
  prevSelectionEntities: {}
};

const interactiveCanvasState: BsBpfxInteractiveCanvasState = {
  statePositionById: {},
  eventDataById: {},
  viewTransformByZoneId: {},
  isLoaderEnabled: false,
};

const liveTextState: BsBpfxLiveTextState = {};

const screenLayoutSettings: BsBpfxScreenLayoutSettingsState = {
  selectedLayoutId: null,
  screenCount: null,
  selectedBezel: null,
  isLayoutBoundaryToggled: false,
  isSnapToCanvasToggled: false,
};


const createProjectFileStateFromState = (state: any): BsBpfxState => {
  return {
    bsdm: state.bsdm,
    interactiveCanvas: interactiveCanvasState,
    selection: selectionState,
    eventMenu: eventMenuState,
    liveText: liveTextState,
    screenLayoutSettings: screenLayoutSettings,
  };
};

