import { PlayerModel, VideoMode } from '@brightsign/bscore';
import { DmState, dmNewSign } from "@brightsign/bsdatamodel";
import { LiveDataFeed } from './baInterfaces';

export const generateBpfx = (autoplay: any): any => {
  return (dispatch: Function, getState: any): any => {
    dispatch(newSign(autoplay));
    dispatch(setSignProperties(autoplay));
    dispatch(setSignAudioProperties(autoplay));
    dispatch(setSignIRRemote(autoplay));
    dispatch(setSerialPortConfiguration(autoplay));
    dispatch(addUserVariables(autoplay.metadata.userVariables));
    dispatch(addHtmlSites(autoplay.metadata.htmlSites));
    dispatch(addScriptPlugins(autoplay.metadata.scriptPlugins));
    dispatch(addParserPlugins(autoplay.metadata.parserPlugins));
    dispatch(addVideoModePlugins(autoplay.metadata.videoModePlugins));
    dispatch(addAuxiliaryFiles(autoplay.metadata.additionalFilesToPublish));
    const addLiveDataFeedsPromise: Promise<void> =
      dispatch(buildDataFeedSourceSpecs(getState().bsdm, autoplay.metadata.liveDataFeeds));
    return addLiveDataFeedsPromise
      .then(() => {
        const addLinkedPresentationPromise: Promise<void> =
          dispatch(addLinkedPresentations(autoplay.metadata.presentationIdentifiers));
        return addLinkedPresentationPromise;
      }).then(() => {
        const addPartnerProductsPromise: Promise<void> =
          dispatch(addPartnerProducts(autoplay, autoplay.metadata.boseProducts));
        return addPartnerProductsPromise;
      }).then(() => {
        const zoneIds: string[] = dispatch(addAllZones(autoplay));
        const promise: any = dispatch(buildZonePlaylists(autoplay, zoneIds));
        return promise;
      }).then(() => {
        // console.log(getState().bsdm);
        return Promise.resolve(getState());
      });

  }
};

export const newSign = (autoplay: any): any => {
  return (dispatch: Function, getState: any): any => {
    const name = 'testBpf';
    const signAction: any = dmNewSign(name, VideoMode.v1920x1080x60p, PlayerModel.XT1144);
    dispatch(signAction);
    // return signAction;

    const newState = getState();
    console.log(newState);
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


