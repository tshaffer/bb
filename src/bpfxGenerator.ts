import { isNil } from 'lodash';
import { AssetType, DeviceWebPageDisplay, GpioType, GraphicsZOrderType, PlayerModel, VideoMode, bscAssetItemFromBasicAssetInfo, getEnumKeyOfValue } from '@brightsign/bscore';
import { DmGpioList, DmSignMetadata, DmSignProperties, DmSignState, DmState, SignAction, SignParams, dmGetSignState, dmNewSign, dmSetPresentationWebPage, dmUpdateSignGpio, dmUpdateSignProperties } from "@brightsign/bsdatamodel";
import { LiveDataFeed } from './baInterfaces';
import { ArSign, ArSignMetadata, AutoplayMetadata, BrightAuthorHeader } from './types';
import { isString } from 'util';

export const generateBpfx = (autoplay: ArSign): any => {
  return (dispatch: Function, getState: any): any => {
    dispatch(newSign(autoplay.meta));
    dispatch(setSignProperties(autoplay.meta));
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

    const { name, model, videoMode } = autoplay;

    let videoModeToUse: VideoMode;
    if (!getEnumKeyOfValue(VideoMode, videoMode as any)) {
      videoModeToUse = VideoMode.v1920x1080x60p;
    } else {
      videoModeToUse = videoMode as any;
    }

    let modelToUse: PlayerModel;
    if (!getEnumKeyOfValue(PlayerModel, modelToUse as any)) {
      modelToUse = PlayerModel.XT1144;
    } else {
      modelToUse = model as any;
    }

    // const { name } = autoplay;
    const signAction: any = dmNewSign(name, videoModeToUse, modelToUse);
    dispatch(signAction);
    // return signAction;
  };
};

let _graphicsZOrder: GraphicsZOrderType;

export const setSignProperties = (autoplayMetadata: ArSignMetadata): any => {

  return (dispatch: Function, getState: Function): any => {

    const state = getState();

    let signAction: SignAction;
    let signState: DmSignState;
    let signMetadata: DmSignMetadata;
    let signProperties: DmSignProperties;

    signState = dmGetSignState(state.bsdm);
    signMetadata = signState.sign;
    signProperties = signMetadata.properties;

    const {

      // DmSignPropertyData
      videoMode,
      size,
      model,
      monitorOrientation,
      monitorOverscan,
      videoConnector,
      deviceWebPageDisplay,
      backgroundScreenColor,
      forceResolution,
      tenBitColorEnabled,
      dolbyVisionEnabled,
      fullResGraphicsEnabled,
      // audioConfiguration,
      audioAutoLevel,
      htmlEnableJavascriptConsole,
      alphabetizeVariableNames,
      autoCreateMediaCounterVariables,
      resetVariablesOnPresentationStart,
      networkedVariablesUpdateInterval,
      delayScheduleChangeUntilMediaEndEvent,
      language,
      languageKey,
      flipCoordinates,
      inactivityTimeout,
      inactivityTime,
      touchCursorDisplayMode,
      udpDestinationAddressType,
      udpDestinationAddress,
      udpDestinationPort,
      udpReceiverPort,
      enableEnhancedSynchronization,
      disableSettingsHandler,

      // DmSignProperties
      id,
      version,
      name,

      // DmSignHardwareConfiguration
      serialPortConfigurations,
      gpio,
      buttonPanels,
      audioSignPropertyMap,
      irRemote,

      // ArSignMetadata
      audioConfiguration,
      customDeviceWebPage,
      nodeApps,
      htmlSites,
      userVariables,
      userDefinedEvents,
      scriptPlugins,
      parserPlugins,
      videoModePlugins,
      auxiliaryFiles,
      presentationIdentifiers,
      beacons,
      liveDataFeeds,
      dataFeedSources,
      partnerProducts,
      bmapSpecAssetName,
      wssDeviceSpec,
      graphicsZOrder,
      irRemoteControl,
    } = autoplayMetadata;

    console.log(autoplayMetadata)

    _graphicsZOrder = graphicsZOrder;


    const signParams: SignParams = {
      id: signProperties.id
    };
    addToSignParamsIfNotNil(signParams, 'alphabetizeVariableNames', alphabetizeVariableNames);
    addToSignParamsIfNotNil(signParams, 'autoCreateMediaCounterVariables', autoCreateMediaCounterVariables);
    addToSignParamsIfNotNil(signParams, 'backgroundScreenColor', backgroundScreenColor);
    addToSignParamsIfNotNil(signParams, 'delayScheduleChangeUntilMediaEndEvent', delayScheduleChangeUntilMediaEndEvent);
    addToSignParamsIfNotNil(signParams, 'deviceWebPageDisplay', deviceWebPageDisplay);
    addToSignParamsIfNotNil(signParams, 'enableEnhancedSynchronization', enableEnhancedSynchronization);
    addToSignParamsIfNotNil(signParams, 'flipCoordinates', flipCoordinates);
    addToSignParamsIfNotNil(signParams, 'forceResolution', forceResolution);
    addToSignParamsIfNotNil(signParams, 'htmlEnableJavascriptConsole', htmlEnableJavascriptConsole);
    addToSignParamsIfNotNil(signParams, 'inactivityTime', inactivityTime);
    addToSignParamsIfNotNil(signParams, 'inactivityTimeout', inactivityTimeout);
    // addToSignParamsIfNotNil(signParams, 'isMosaic', isMosaic);
    addToSignParamsIfNotNil(signParams, 'language', language);
    addToSignParamsIfNotNil(signParams, 'languageKey', languageKey);
    addToSignParamsIfNotNil(signParams, 'monitorOrientation', monitorOrientation);
    addToSignParamsIfNotNil(signParams, 'monitorOverscan', monitorOverscan);
    addToSignParamsIfNotNil(signParams, 'resetVariablesOnPresentationStart', resetVariablesOnPresentationStart);
    addToSignParamsIfNotNil(signParams, 'tenBitColorEnabled', tenBitColorEnabled);
    addToSignParamsIfNotNil(signParams, 'dolbyVisionEnabled', dolbyVisionEnabled);
    addToSignParamsIfNotNil(signParams, 'fullResGraphicsEnabled', fullResGraphicsEnabled);
    addToSignParamsIfNotNil(signParams, 'audioConfiguration', audioConfiguration);
    addToSignParamsIfNotNil(signParams, 'audioAutoLevel', audioAutoLevel);
    addToSignParamsIfNotNil(signParams, 'touchCursorDisplayMode', touchCursorDisplayMode);
    addToSignParamsIfNotNil(signParams, 'udpDestinationAddress', udpDestinationAddress);
    addToSignParamsIfNotNil(signParams, 'udpDestinationAddressType', udpDestinationAddressType);
    addToSignParamsIfNotNil(signParams, 'udpDestinationPort', udpDestinationPort);
    addToSignParamsIfNotNil(signParams, 'udpReceiverPort', udpReceiverPort);
    addToSignParamsIfNotNil(signParams, 'videoConnector', videoConnector);

    signAction = dispatch(dmUpdateSignProperties(signParams));

    const gpioList: DmGpioList = [
      gpio[0] === 'output' ? GpioType.Output : GpioType.Input,
      gpio[1] === 'output' ? GpioType.Output : GpioType.Input,
      gpio[2] === 'output' ? GpioType.Output : GpioType.Input,
      gpio[3] === 'output' ? GpioType.Output : GpioType.Input,
      gpio[4] === 'output' ? GpioType.Output : GpioType.Input,
      gpio[5] === 'output' ? GpioType.Output : GpioType.Input,
      gpio[6] === 'output' ? GpioType.Output : GpioType.Input,
      gpio[7] === 'output' ? GpioType.Output : GpioType.Input,
    ];

    dispatch(dmUpdateSignGpio({
      gpioList,
    }));

    // if (deviceWebPageDisplay === DeviceWebPageDisplay.Custom && isString(customDeviceWebPageSiteName) &&
    //   customDeviceWebPageSiteName.length > 0 && isString(customDeviceWebPage) && customDeviceWebPage.length > 0) {
    //   if (converterSpec.desktopConversion) {
    //     const assetItem = getAssetItemFromPath(AssetType.DeviceHtmlSite, customDeviceWebPage);
    //     dispatch(dmSetPresentationWebPage(DeviceWebPageDisplay.Custom, assetItem, customDeviceWebPageSiteName));
    //   } else {
    //     const assetName = customDeviceWebPageSiteName + '-customDeviceWebPage';
    //     const assetItem = bscAssetItemFromBasicAssetInfo(AssetType.DeviceHtmlSite, assetName);
    //     dispatch(dmSetPresentationWebPage(DeviceWebPageDisplay.Custom, assetItem, customDeviceWebPageSiteName));
    //   }
    // }

  };
};

const addToSignParamsIfNotNil = (signParams: SignParams, propertyName: string, propertyValue: any) => {
  if (!isNil(propertyValue)) {
    (signParams as any)[propertyName] = propertyValue;
  }
}


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


