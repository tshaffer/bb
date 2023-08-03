import { PlayerModel, VideoMode } from '@brightsign/bscore';
import { DmState, dmNewSign } from "@brightsign/bsdatamodel";
import { LiveDataFeed } from './baInterfaces';
import { AutoplayMetadata, BrightAuthorHeader } from './types';

export const generateBpfx = (autoplay: BrightAuthorHeader): any => {
  return (dispatch: Function, getState: any): any => {
    dispatch(newSign(autoplay.meta));
    // dispatch(setSignProperties(autoplay));
    // dispatch(setSignAudioProperties(autoplay));
    // dispatch(setSignIRRemote(autoplay));
    // dispatch(setSerialPortConfiguration(autoplay));
    // dispatch(addUserVariables(autoplay.meta.userVariables));
    // dispatch(addHtmlSites(autoplay.meta.htmlSites));
    // dispatch(addScriptPlugins(autoplay.meta.scriptPlugins));
    // dispatch(addParserPlugins(autoplay.meta.parserPlugins));
    // dispatch(addVideoModePlugins(autoplay.meta.videoModePlugins));
    // dispatch(addAuxiliaryFiles(autoplay.meta.additionalFilesToPublish));
    // const addLiveDataFeedsPromise: Promise<void> =
    //   dispatch(buildDataFeedSourceSpecs(getState().bsdm, autoplay.meta.liveDataFeeds));
    // return addLiveDataFeedsPromise
    //   .then(() => {
    //     const addLinkedPresentationPromise: Promise<void> =
    //       dispatch(addLinkedPresentations(autoplay.meta.presentationIdentifiers));
    //     return addLinkedPresentationPromise;
    //   }).then(() => {
    //     const addPartnerProductsPromise: Promise<void> =
    //       dispatch(addPartnerProducts(autoplay, autoplay.meta.boseProducts));
    //     return addPartnerProductsPromise;
    //   }).then(() => {
    //     const zoneIds: string[] = dispatch(addAllZones(autoplay));
    //     const promise: any = dispatch(buildZonePlaylists(autoplay, zoneIds));
    //     return promise;
    //   }).then(() => {
    //     // console.log(getState().bsdm);
    //     return Promise.resolve(getState());
    //   });

    const newState = getState();
    console.log(newState);

  }
};

export const newSign = (autoplay: AutoplayMetadata): any => {
  return (dispatch: Function, getState: any): any => {
    // const { name, model, videoMode } = autoplay;
    const { name } = autoplay;
    const signAction: any = dmNewSign(name, VideoMode.v1920x1080x60p, PlayerModel.XT1144);
    dispatch(signAction);
    // return signAction;
  };
};

export const setSignProperties = (autoplay: any): any => {
};

export const setSignAudioProperties = (autoplay: any): any => {
};

export const setSignIRRemote = (autoplay: any): any => {
};

export const setSerialPortConfiguration = (autoplay: any): any => {
};

export const addUserVariables = (userVariables: any): any => {
};

export const addHtmlSites = (htmlSites: any[]): any => {
};

export const addScriptPlugins = (scriptPlugins: any[]): any => {
};

export const addParserPlugins = (parserPlugins: any[]): any => {
};

export const addVideoModePlugins = (videoModePlugins: any[]): any => {
};

export const addLinkedPresentations = (presentationIdentifiers: any): any => {
};

export const addAuxiliaryFiles = (additionalFilesToPublish: string[]): any => {
};


export const addPartnerProducts = (autoplay: any, partnerProducts: any): any => {
};

function buildDataFeedSourceSpecs(bsdm: DmState, liveDataFeeds: any[]) {

  return (dispatch: Function, getState: Function): Promise<void> => {
    executeBuildDataFeedSourceSpecs(bsdm, liveDataFeeds);
    return Promise.resolve();
  };
}

export const executeBuildDataFeedSourceSpecs = (bsdm: DmState, liveDataFeeds: LiveDataFeed[]): any => {
};

export const addAllZones = (autoplay: any): any => {
};

export const buildZonePlaylists = (autoplay: any, zoneIds: string[]): any => {
};


