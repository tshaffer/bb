import { isNil } from 'lodash';
import { AssetType, BsIrRemoteControl, BsRect, DeviceWebPageDisplay, GpioType, GraphicsZOrderType, ImageModeType, IrReceiverSource, IrRemoteModel, IrTransmitterDestination, PlayerModel, VideoMode, ZoneLayerType, ZoneType, bscAssetItemFromBasicAssetInfo, bscGetIrRemoteControl, getEnumKeyOfValue } from '@brightsign/bscore';
import { AudioSignPropertyMapParams, BsDmId, BsDmThunkAction, DmAudioSignProperties, DmAudioSignPropertyMap, DmGpioList, DmImageZoneProperties, DmImageZonePropertyData, DmSignMetadata, DmSignProperties, DmSignState, DmState, DmVideoZoneProperties, DmZoneLayerIdParams, SignAction, SignParams, VideoOrImagesZonePropertyParams, ZoneAddAction, ZoneAddInputParams, ZoneAddParams, ZonePropertyUpdateParams, dmAddZone, dmGetSignState, dmGetZoneLayerIdByTypeAndIndex, dmNewSign, dmSetPresentationWebPage, dmUpdateSignAudioPropertyMap, dmUpdateSignGpio, dmUpdateSignIrInConfiguration, dmUpdateSignIrOutConfiguration, dmUpdateSignIrRemoteControl, dmUpdateSignProperties, dmUpdateZoneProperties } from "@brightsign/bsdatamodel";
import { LiveDataFeed } from './baInterfaces';
import { ArSign, ArSignMetadata, ArVideoOrImagesZone, ArVideoOrImagesZoneProperties, ArVideoZonePropertyData, ArZone, AutoplayMetadata, BrightAuthorHeader } from './types';

export const generateBpfx = (autoplay: ArSign): any => {
  return (dispatch: Function, getState: any): any => {
    dispatch(newSign(autoplay.meta));
    dispatch(setSignProperties(autoplay.meta));
    dispatch(setSignAudioProperties(autoplay.meta));
    dispatch(setSignIRRemote());
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

    const zoneIds: string[] = dispatch(addAllZones(autoplay.zones));
    // const promise: any = dispatch(buildZonePlaylists(bpf, zoneIds));
    // return promise;

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


export const setSignAudioProperties = (autoplayMetadata: ArSignMetadata): any => {
  return (dispatch: Function): any => {
    const bpfAudioVolumeNames: string[] = [
      'audio1',
      'hdmi',
      'spdif',
      'usbTypeA',
      'usbTypeC',
      'usb700_1',
      'usb700_2',
      'usb700_3',
      'usb700_4',
      'usb700_5',
      'usb700_6',
      'usb700_7',
    ];

    const bpfxAudioOutputs: string[] = [
      'analog1',
      'hdmi',
      'spdif',
      'usbTypeA',
      'usbTypeC',
      'usb700_1',
      'usb700_2',
      'usb700_3',
      'usb700_4',
      'usb700_5',
      'usb700_6',
      'usb700_7',
    ];

    const audioSignPropertyMap: DmAudioSignPropertyMap = {};
    let audioSignProperties: DmAudioSignProperties;

    // for (let i = 0; i < bpfAudioVolumeNames.length; i++) {
    //   audioSignProperties = {
    //     min: bpf.metadata[bpfAudioVolumeNames[i] + 'MinVolume'],
    //     max: bpf.metadata[bpfAudioVolumeNames[i] + 'MaxVolume'],
    //   };
    //   audioSignPropertyMap[bpfxAudioOutputs[i]] = audioSignProperties;
    // }

    // const audioSignPropertyMapParams: AudioSignPropertyMapParams = {
    //   audioSignMap: audioSignPropertyMap
    // };

    // dispatch(dmUpdateSignAudioPropertyMap(audioSignPropertyMapParams));
  };
};

export const setSignIRRemote = (): any => {
  return (dispatch: Function): any => {
    dispatch(dmUpdateSignIrInConfiguration({
      irInConfiguration: {
        source: IrReceiverSource.Iguana
      }
    }));
    dispatch(dmUpdateSignIrOutConfiguration({
      irOutConfiguration: {
        destination: IrTransmitterDestination.Iguana
      }
    }));
    const irConfiguration: BsIrRemoteControl = bscGetIrRemoteControl(IrRemoteModel.RC1001);
    const irRemoteConfiguration: BsIrRemoteControl = {
      id: irConfiguration.id,
      encoding: irConfiguration.encoding,
      manufacturerCode: irConfiguration.manufacturerCode,
      buttons: irConfiguration.buttons
    };
    dispatch(dmUpdateSignIrRemoteControl(irRemoteConfiguration));
  };
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

export const addAllZones = (zones: ArZone[]): any => {

  return (dispatch: Function, getState: Function): any => {

    const zoneIds: BsDmId[] = [];

    let bsdm: DmState = getState().bsdm;

    const videoLayer1Id: BsDmId = dmGetZoneLayerIdByTypeAndIndex(bsdm, { type: ZoneLayerType.Video, index: 0 });
    const videoLayer2Id: BsDmId = dmGetZoneLayerIdByTypeAndIndex(bsdm, { type: ZoneLayerType.Video, index: 1 });
    const graphicsLayerId: BsDmId = dmGetZoneLayerIdByTypeAndIndex(bsdm, { type: ZoneLayerType.Graphics });
    const audioLayerId: BsDmId = dmGetZoneLayerIdByTypeAndIndex(bsdm, { type: ZoneLayerType.Audio });
    const invisibleLayerId: BsDmId = dmGetZoneLayerIdByTypeAndIndex(bsdm, { type: ZoneLayerType.Invisible });

    zones.forEach((zone: ArZone) => {
      const { x, y, width, height } = zone.absolutePosition;

      const zoneRect: BsRect = {
        x,
        y,
        width,
        height,
        pct: false
      };

      const zoneLayerIdParams: DmZoneLayerIdParams = {};
      switch (zone.type) {
        case ZoneType.VideoOrImages:
        case ZoneType.VideoOnly:
          if ((zone.zoneSpecificParameters as ArVideoZonePropertyData).zOrderFront) {
            zoneLayerIdParams.videoLayerId = videoLayer1Id;
          }
          else {
            zoneLayerIdParams.videoLayerId = videoLayer2Id;
          }
          if (zone.type === ZoneType.VideoOrImages) {
            zoneLayerIdParams.graphicsLayerId = graphicsLayerId;
          }
          break;
        // case ZoneType.BackgroundImage:
        //   if (!isNil(videoLayer2Id)) {
        //     zoneLayerIdParams.videoLayerId = videoLayer2Id;
        //   }
        //   else {
        //     zoneLayerIdParams.videoLayerId = videoLayer1Id;
        //   }
        //   break;
        // case ZoneType.Images:
        // case ZoneType.Ticker:
        // case ZoneType.Clock:
        //   zoneLayerIdParams.graphicsLayerId = graphicsLayerId;
        //   break;
        // case ZoneType.AudioOnly:
        // case ZoneType.EnhancedAudio:
        //   zoneLayerIdParams.audioLayerId = audioLayerId;
        //   break;
      }
      const zoneAddInputParams: ZoneAddInputParams = {
        nonInteractive: zone.playlist.type !== 'interactive',
        position: zoneRect,
        allowTransitionToMosaic: false, // TEDTODO - when we add mosaic mode support
        zoneLayerIdParams
      };
      const zoneAddAction: ZoneAddAction =
        dispatch(dmAddZone(zone.name, zone.type, zone.id, zoneAddInputParams));
      const zoneAddParams: ZoneAddParams = zoneAddAction.payload;

      const zoneId: BsDmId = zoneAddParams.zone.id;
      const zoneType: ZoneType = zoneAddParams.zone.type;

      dispatch(setZoneProperties(zone, zoneId, zoneType));

      zoneIds.push(zoneId);
    });

  };
};

const setZoneProperties = (
  bpfZone: any,
  zoneId: BsDmId,
  zoneType: ZoneType) => {

  return (dispatch: Function, getState: Function): any => {
    switch (zoneType) {
      case ZoneType.VideoOrImages: {
        dispatch(setVideoOrImagesZoneSpecificProperties(bpfZone, zoneId));
        break;
      }
      // case ZoneType.VideoOnly: {
      //   dispatch(setVideoZoneSpecificProperties(bpfZone, zoneId));
      //   break;
      // }
      // case ZoneType.Images: {
      //   dispatch(setImageZoneSpecificProperties(bpfZone, zoneId));
      //   break;
      // }
      // case ZoneType.AudioOnly: {
      //   dispatch(setAudioZoneSpecificProperties(bpfZone, zoneId));
      //   break;
      // }
      // case ZoneType.EnhancedAudio: {
      //   dispatch(setEnhancedAudioZoneSpecificProperties(bpfZone, zoneId));
      //   break;
      // }
      // case ZoneType.Ticker: {
      //   dispatch(setTickerZoneSpecificProperties(bpfZone, zoneId));
      //   break;
      // }
      // case ZoneType.Clock: {
      //   dispatch(setClockZoneSpecificProperties(bpfZone, zoneId));
      //   break;
      // }
      case ZoneType.BackgroundImage: {
        // no zoneSpecific properties for a background image zone
        break;
      }
      default: {
        throw 'Invalid zone type';
      }
    }
  };
}

const setVideoOrImagesZoneSpecificProperties = (arZone: ArVideoOrImagesZone, zoneId: BsDmId) => {
  return (dispatch: Function, getState: Function): any => {
    const zoneSpecificParameters: ArVideoOrImagesZoneProperties = arZone.zoneSpecificParameters;

    const imageMode: ImageModeType = zoneSpecificParameters.imageMode;

    const imageZonePropertyData: DmImageZonePropertyData = {
      imageMode,
    };
    const imageZoneProperties: DmImageZoneProperties = imageZonePropertyData;

    // const audioZonePropertyData = getAudioZonePropertyData(zoneSpecificParameters);

    // const videoZonePropertyData = getVideoZonePropertyData(zoneSpecificParameters);

    // const videoZoneProperties: DmVideoZoneProperties =
    //   Object.assign({}, videoZonePropertyData, audioZonePropertyData);

    // const zonePropertyParams: VideoOrImagesZonePropertyParams =
    //   Object.assign({}, videoZoneProperties, imageZoneProperties);

    // const zonePropertyUpdateParams: ZonePropertyUpdateParams = {
    //   id: zoneId,
    //   type: ZoneType.VideoOrImages,
    //   properties: zonePropertyParams
    // };
    // const updateZonePropertyThunkAction: BsDmThunkAction<ZonePropertyUpdateParams> =
    //   dmUpdateZoneProperties(zonePropertyUpdateParams);
    // dispatch(updateZonePropertyThunkAction);
  };
}


export const buildZonePlaylists = (autoplay: any, zoneIds: string[]): any => {
};


