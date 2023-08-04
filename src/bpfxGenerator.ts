import * as os from 'os';
import path from 'isomorphic-path';

import { isNil, isString, isObject, isNumber } from 'lodash';

import { fsGetAssetItemFromFile } from '@brightsign/fsconnector';

import { AssetType, AudioMixModeType, BsAssetItem, BsIrRemoteControl, BsRect, BscFileTypeInfo, CommandSequenceType, CommandType, DeviceWebPageDisplay, EventType, GpioType, GraphicsZOrderType, ImageModeType, IrReceiverSource, IrRemoteModel, IrTransmitterDestination, MediaType, PlayerModel, TransitionType, VideoMode, ZoneLayerType, ZoneType, bscAssetItemFromBasicAssetInfo, bscGetBscFileTypeInfo, bscGetIrRemoteControl, getEnumKeyOfValue } from '@brightsign/bscore';
import { AudioSignPropertyMapParams, BsDmId, BsDmThunkAction, CommandAddParams, CommandDataParams, DmAudioOutputAssignmentMap, DmAudioSignProperties, DmAudioSignPropertyMap, DmAudioZonePropertyData, DmCommand, DmCommandData, DmEntityType, DmGpioList, DmImageZoneProperties, DmImageZonePropertyData, DmMediaStateContainer, DmSignMetadata, DmSignProperties, DmSignState, DmState, DmVideoContentItemData, DmVideoZoneProperties, DmVideoZonePropertyData, DmZoneLayerIdParams, DmcEvent, DmcMediaState, DmcZone, EventParams, MediaStateAction, MediaStateContainerType, MediaStateParams, SignAction, SignParams, VideoOrImagesZonePropertyParams, ZoneAddAction, ZoneAddInputParams, ZoneAddParams, ZonePropertyUpdateParams, dmAddCommand, dmAddMediaState, dmAddZone, dmCreateCommand, dmCreateCommandData, dmGetEventById, dmGetEventIdsForMediaState, dmGetMediaStateById, dmGetMediaStateIdsForProps, dmGetSignState, dmGetZoneById, dmGetZoneLayerIdByTypeAndIndex, dmGetZoneLayerSequence, dmGetZoneMediaStateContainer, dmMoveZoneLayersAtIndices, dmNewSign, dmPlaylistAddMediaState, dmSetPresentationWebPage, dmUpdateEvent, dmUpdateSignAudioPropertyMap, dmUpdateSignGpio, dmUpdateSignIrInConfiguration, dmUpdateSignIrOutConfiguration, dmUpdateSignIrRemoteControl, dmUpdateSignProperties, dmUpdateZone, dmUpdateZoneProperties } from "@brightsign/bsdatamodel";
import { BACommandNames, LiveDataFeed } from './baInterfaces';
import { ArSign, ArSignMetadata, ArVideoOrImagesZone, ArVideoOrImagesZoneProperties, ArVideoZonePropertyData, ArZone, AutoplayMetadata, BpfConverterSpec, BrightAuthorHeader } from './types';

export const generateBpfx = (arSign: ArSign): any => {
  return (dispatch: Function, getState: any): any => {
    dispatch(newSign(arSign.meta));
    dispatch(setSignProperties(arSign.meta));
    dispatch(setSignAudioProperties(arSign.meta));
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

    const zoneIds: string[] = dispatch(addAllZones(arSign.zones));
    const promise: any = dispatch(buildZonePlaylists(arSign, zoneIds));
    return promise;

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

    // set z order of zone layers
    bsdm = getState().bsdm;
    let indices: number[];
    let indexOfGraphicsLayer: number = -1;
    let indexOfVideoLayer1: number = -1;
    let indexOfVideoLayer2: number = -1;

    const zoneLayerIdsInSequence: BsDmId[] = dmGetZoneLayerSequence(bsdm);
    zoneLayerIdsInSequence.forEach((zoneLayerId: BsDmId, index: number) => {
      switch (zoneLayerId) {
        case graphicsLayerId:
          indexOfGraphicsLayer = index;
          break;
        case videoLayer1Id:
          indexOfVideoLayer1 = index;
          break;
        case videoLayer2Id:
          indexOfVideoLayer2 = index;
          break;
      }
    });

    switch (_graphicsZOrder) {
      case GraphicsZOrderType.Front:
        indices = setZoneLayerIndices(indexOfGraphicsLayer, indexOfVideoLayer1, indexOfVideoLayer2);
        break;
      case GraphicsZOrderType.Middle:
        indices = setZoneLayerIndices(indexOfVideoLayer1, indexOfGraphicsLayer, indexOfVideoLayer2);
        break;
      case GraphicsZOrderType.Back:
        indices = setZoneLayerIndices(indexOfVideoLayer1, indexOfVideoLayer2, indexOfGraphicsLayer);
        break;
    }
    for (let targetIndex = 0; targetIndex < indices.length; targetIndex++) {
      const existingIndex = indices[targetIndex];
      if (existingIndex !== targetIndex) {
        dispatch(dmMoveZoneLayersAtIndices(existingIndex, targetIndex));
        for (let j = targetIndex + 1; j < indices.length; j++) {
          if (indices[j] < existingIndex) {
            indices[j]++;
          }
        }
      }
    }
    return zoneIds;

  };
};

function setZoneLayerIndices(index0: number, index1: number, index2: number): number[] {
  const indices: number[] = [];
  if (index0 >= 0) {
    indices.push(index0);
  }
  if (index1 >= 0) {
    indices.push(index1);
  }
  if (index2 >= 0) {
    indices.push(index2);
  }
  return indices;
}

const setZoneProperties = (
  arZone: any,
  zoneId: BsDmId,
  zoneType: ZoneType) => {

  return (dispatch: Function, getState: Function): any => {
    switch (zoneType) {
      case ZoneType.VideoOrImages: {
        dispatch(setVideoOrImagesZoneSpecificProperties(arZone, zoneId));
        break;
      }
      // case ZoneType.VideoOnly: {
      //   dispatch(setVideoZoneSpecificProperties(arZone, zoneId));
      //   break;
      // }
      // case ZoneType.Images: {
      //   dispatch(setImageZoneSpecificProperties(arZone, zoneId));
      //   break;
      // }
      // case ZoneType.AudioOnly: {
      //   dispatch(setAudioZoneSpecificProperties(arZone, zoneId));
      //   break;
      // }
      // case ZoneType.EnhancedAudio: {
      //   dispatch(setEnhancedAudioZoneSpecificProperties(arZone, zoneId));
      //   break;
      // }
      // case ZoneType.Ticker: {
      //   dispatch(setTickerZoneSpecificProperties(arZone, zoneId));
      //   break;
      // }
      // case ZoneType.Clock: {
      //   dispatch(setClockZoneSpecificProperties(arZone, zoneId));
      //   break;
      // }
      case ZoneType.BackgroundImage: {
        // no zoneSpecific properties for a background image zone
        break;
      }
      default: {
        debugger;
        // throw 'Invalid zone type';
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

    const audioZonePropertyData: DmAudioZonePropertyData = getAudioZonePropertyData(zoneSpecificParameters);

    const videoZonePropertyData = getVideoZonePropertyData(zoneSpecificParameters);

    const videoZoneProperties: DmVideoZoneProperties =
      Object.assign({}, videoZonePropertyData, audioZonePropertyData);

    const zonePropertyParams: VideoOrImagesZonePropertyParams =
      Object.assign({}, videoZoneProperties, imageZoneProperties);

    const zonePropertyUpdateParams: ZonePropertyUpdateParams = {
      id: zoneId,
      type: ZoneType.VideoOrImages,
      properties: zonePropertyParams
    };
    const updateZonePropertyThunkAction: BsDmThunkAction<ZonePropertyUpdateParams> =
      dmUpdateZoneProperties(zonePropertyUpdateParams);
    dispatch(updateZonePropertyThunkAction);
  };
}

function getAudioZonePropertyData(
  zoneSpecificParameters: any,
): DmAudioZonePropertyData {

  const audioOutputAssignmentMap: DmAudioOutputAssignmentMap =
    buildAudioOutputAssignmentMap(zoneSpecificParameters);

  const audioZonePropertyData: DmAudioZonePropertyData = {
    audioOutput: zoneSpecificParameters.audioOutput,
    audioMode: zoneSpecificParameters.audioMode,
    audioMapping: zoneSpecificParameters.audioMapping,
    audioOutputAssignments: audioOutputAssignmentMap,
    audioMixMode: zoneSpecificParameters.audioMixMode,
    audioVolume: zoneSpecificParameters.audioVolume,
    minimumVolume: zoneSpecificParameters.minimumVolume,
    maximumVolume: zoneSpecificParameters.maximumVolume,
  };

  return audioZonePropertyData;
}

function buildAudioOutputAssignmentMap(zoneSpecificParameters: any): DmAudioOutputAssignmentMap {

  const bpfAudioOutputs: string[] = [
    'analogOutput',
    'hdmiOutput',
    'spdifOutput',
    'usbOutputTypeA',
    'usbOutputTypeC',
    'usbOutput700_1',
    'usbOutput700_2',
    'usbOutput700_3',
    'usbOutput700_4',
    'usbOutput700_5',
    'usbOutput700_6',
    'usbOutput700_7',
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

  const audioOutputAssignments: DmAudioOutputAssignmentMap = {};

  for (let i = 0; i < bpfAudioOutputs.length; i++) {
    audioOutputAssignments[bpfxAudioOutputs[i]] =
      zoneSpecificParameters[bpfAudioOutputs[i]];
  }

  return audioOutputAssignments;
}

function getVideoZonePropertyData(zoneSpecificParameters: any):
  DmVideoZonePropertyData {

  const videoZonePropertyData: DmVideoZonePropertyData = {
    viewMode: zoneSpecificParameters.viewMode,
    videoVolume: zoneSpecificParameters.videoVolume,
    maxContentResolution: zoneSpecificParameters.maxContentResolution,
  };

  return videoZonePropertyData;
}


export const buildZonePlaylists = (arSign: ArSign, zoneIds: string[]): any => {

  return (dispatch: Function, getState: Function): any => {

    const promises: Array<Promise<any>> = [];

    zoneIds.forEach((zoneId: BsDmId, zoneIndex: number) => {
      const arZone: any = arSign.zones[zoneIndex];
      promises.push(dispatch(buildZonePlaylist(arZone, zoneId)));
    });

    return Promise.all(promises)
      .then(() => {
        dispatch(executeSecondPass(arSign));
      });
  };
};

function getMediaStateInZone(bsdm: DmState, zoneId: BsDmId, stateName: string): DmcMediaState | null {
  const mediaStateIds = dmGetMediaStateIdsForProps(bsdm, {
    name: stateName,
    containerId: zoneId,
    searchContainedSuperStates: true,
  });
  if (mediaStateIds.length === 0) {
    return null;
  }
  // TODO - check if mediaStateIds.length > 1
  const mediaState: DmcMediaState = dmGetMediaStateById(bsdm, { id: mediaStateIds[0] });
  return mediaState;
}


function buildZonePlaylist(arZone: ArZone, zoneId: BsDmId): Function {

  return (dispatch: Function, getState: Function): any => {

    const zone: DmMediaStateContainer = dmGetZoneMediaStateContainer(zoneId);

    return dispatch(addStatesToZone(zone, arZone.playlist.states, arZone.playlist.type === 'interactive'))
      .then((eventData: any) => {
        // set initialState for  interactive zones - it's set by bsdm for non interactive zones.
        if (arZone.playlist.type === 'interactive') {
          debugger;
          // if (isString(arZone.playlist.initialState)
          //   && arZone.playlist.initialState !== '') {
          //   const initialStateName = arZone.playlist.initialState;
          //   const initialState: DmcMediaState = getMediaStateInZone(getState().bsdm, zoneId, initialStateName);

          //   if (isObject(initialState)) {
          //     dispatch(dmUpdateZone({
          //       id: zone.id,
          //       initialMediaStateId: initialState.id
          //     }));
          //   }
          // }
        } else {
          // for a non interactive playlist, update all the timeOnScreen values
          for (const eventDataItem of eventData) {
            const eventIds: BsDmId[] = dmGetEventIdsForMediaState(getState().bsdm, { id: eventDataItem.mediaStateId });
            for (const eventId of eventIds) {
              const dmcEvent: DmcEvent | null = dmGetEventById(getState().bsdm, { id: eventId });
              if (!isNil(dmcEvent) && dmcEvent.type === EventType.Timer) {
                const eventParams: EventParams = {
                  id: eventId,
                  type: dmcEvent.type,
                  data: eventDataItem.eventSpecification.data
                };
                dispatch(dmUpdateEvent(eventParams));
              }
            }
          }
        }

        if (!isNil(arZone.playlist.states) && arZone.playlist.states.length > 0) {
          if (arZone.playlist.type === 'interactive') {
            debugger;
            // dispatch(buildInteractiveTransitions(arZone, zoneId));
          }
        }
      });
  };
}

function addState(
  addItem: Function,
  mediaStateContainer: any, state: any, isInteractive: boolean): Function {
  return (dispatch: Function, getState: Function): any => {
    const mediaStateId = dispatch(addItem(mediaStateContainer, state, isInteractive));
    return Promise.resolve(
      {
        state,
        mediaStateId,
      }
    );
  };
}

function createTimeoutEventData(mediaStateId: BsDmId, timeout: number) {
  return {
    mediaStateId,
    eventSpecification: {
      type: EventType.Timer,
      data: {
        interval: timeout
      }
    }
  };
}

function createMediaEndEventData(mediaStateId: BsDmId) {
  return {
    mediaStateId,
    eventSpecification: {
      type: EventType.MediaEnd,
      data: null as any
    }
  };
}

export function getFileName(filePath: string): string {
  const normalizedPath = normalizePath(filePath);
  return path.basename(normalizedPath);
}

function normalizePath(filePath: string): string {
  let sep = path.sep;
  if (isWindows()) {
    sep += path.sep; // windows files paths are assumed to be escaped by node i.e. \\
  }
  const parsedPath = filePath.replace(/(\\\\)|(\/\/)|[\/\\]|(^.*:\\)/g, sep);
  if (isWindows()) {
    const prefix = parsedPath.substr(0, 2);
    const root = path.parse(process.cwd()).root;
    if (prefix === root) {
      return parsedPath;
    } else if (prefix === sep) {
      return root + parsedPath.substr(2, parsedPath.length - 1);
    } else {
      return root + parsedPath;
    }
  } else {
    return parsedPath;
  }
}

function isWindows() {
  return path.sep === path.win32.sep;
}


function getAssetItemFromPath(
  assetType: AssetType,
  filePath: string,
  fileName?: string,
  mediaType?: MediaType): BsAssetItem {

  let bsAssetItem: BsAssetItem = fsGetAssetItemFromFile(filePath) as BsAssetItem;
  if (isNil(bsAssetItem)) {
    if (isNil(fileName)) {
      fileName = getFileName(filePath);
    }

    let dummyAssetType: AssetType = assetType;

    // TODO - what is the implication of setting a specific assetType in the call to
    // bscAssetItemFromBasicAssetInfo? This may be relevant in the context of auxiliary files.
    if (assetType === AssetType.Other) {
      const bscFileTypeInfo: BscFileTypeInfo = bscGetBscFileTypeInfo(fileName);
      dummyAssetType = bscFileTypeInfo.assetType;
    }
    bsAssetItem = createDummyAssetItem(dummyAssetType, fileName, filePath, mediaType);
  }
  return bsAssetItem;
}


function addImageItem(container: DmMediaStateContainer, state: any, isInteractive: boolean): Function {

  return (dispatch: Function, getState: Function): any => {

    const bsAssetItem = getAssetItemFromPath(AssetType.Content, state.imageItem.filePath, state.imageItem.fileName, MediaType.Image);

    let addMediaStateThunkAction: BsDmThunkAction<MediaStateParams>;
    if (isInteractive) {
      addMediaStateThunkAction = dmAddMediaState(state.name, container, bsAssetItem,
        {
          defaultTransition: state.imageItem.transitionEffect.transitionType,
          transitionDuration: state.imageItem.transitionEffect.transitionDuration,
        });
    }
    else {
      addMediaStateThunkAction = dmPlaylistAddMediaState(
        -1,
        container,
        bsAssetItem,
        {
          contentData: {
            defaultTransition: state.imageItem.transitionEffect.transitionType,
            transitionDuration: state.imageItem.transitionEffect.transitionDuration,
          }
        }
      );
    }
    const mediaStateAction: MediaStateAction = dispatch(addMediaStateThunkAction);
    const mediaStateParams: MediaStateParams = mediaStateAction.payload;

    return mediaStateParams.id;
  };
}

function addVideoItem(
  container: DmMediaStateContainer,
  state: any,
  isInteractive: boolean,
): Function {

  return (dispatch: Function, getState: Function): any => {

    debugger;

    const bsAssetItem = getAssetItemFromPath(AssetType.Content, state.videoItem.filePath, state.videoItem.fileName, MediaType.Video);

    // const { name, automaticallyLoop, file, fileIsLocal, videoDisplayMode, volume } = state;
    const videoContentItemData: DmVideoContentItemData = {
      volume: 100,
      videoDisplayMode: state.videoItem.videoDisplayMode,
      automaticallyLoop: state.videoItem.automaticallyLoop,
    };

    let addMediaStateThunkAction: BsDmThunkAction<MediaStateParams>;
    if (isInteractive) {
      addMediaStateThunkAction = dmAddMediaState(state.name, container, bsAssetItem, videoContentItemData);
    }
    else {
      addMediaStateThunkAction = dmPlaylistAddMediaState(
        -1,
        container,
        bsAssetItem,
        {
          contentData: videoContentItemData,
        }
      );
    }
    const mediaStateAction: MediaStateAction = dispatch(addMediaStateThunkAction);
    const mediaStateParams: MediaStateParams = mediaStateAction.payload;

    return mediaStateParams.id;
  };
}

function addStatesToZone(
  mediaStateContainer: DmMediaStateContainer,
  states: any[],
  isInteractive: boolean): Function {

  let mediaStateId: string;
  const eventData: any[] = [];

  const promises: Array<Promise<any>> = [];

  return (dispatch: Function, getState: Function): any => {

    // if (mediaStateContainer.type === MediaStateContainerType.Zone) {
    // const zoneId: BsDmId = mediaStateContainer.id;
    // const zone: DmcZone = dmGetZoneById(getState().bsdm, { id: zoneId });
    // if (zone.type === ZoneType.Clock) {
    //   dispatch(addClockItem(mediaStateContainer, (zone.properties as ClockZonePropertyParams).displayTime));
    //   return Promise.resolve();
    // }
    // }

    // empty zone
    if (isNil(states)) {
      return Promise.resolve([]);
    }

    states.forEach((state: any) => {
      mediaStateId = '';
      if (!isNil(state.imageItem)) {
        promises.push(dispatch(addState(addImageItem, mediaStateContainer, state, isInteractive)));
      } else if (!isNil(state.videoItem)) {
        promises.push(dispatch(addState(addVideoItem, mediaStateContainer, state, isInteractive)));
      }
    });

    return Promise.all(promises)
      .then((statesData: any[]) => {
        statesData.forEach((stateData: any) => {
          const state = stateData.state;
          const addedStateMediaStateId = stateData.mediaStateId;

          switch (state.type) {
            case 'imageItem':
              eventData.push(createTimeoutEventData(addedStateMediaStateId, state.slideDelayInterval));
              break;
            // case 'html5Item':
            // case 'liveVideoItem':
            //   eventData.push(createTimeoutEventData(addedStateMediaStateId, Number(state.timeOnScreen)));
            //   break;
            // case 'mrssDataFeedItem':
            case 'videoItem':
              // case 'audioItem':
              // case 'rssDataFeedPlaylistItem': {
              eventData.push(createMediaEndEventData(addedStateMediaStateId));
              break;
            // }
            // case 'audioStreamItem':
            // case 'videoStreamItem':
            // case 'mjpegStreamItem':
            //   if (state.timeOnScreen === 0) {
            //     eventData.push(createMediaEndEventData(addedStateMediaStateId));
            //   }
            //   else {
            //     eventData.push(createTimeoutEventData(addedStateMediaStateId, state.timeOnScreen));
            //   }
            //   break;
            default:
              debugger;
              break;
          }

          if (isInteractive) {

            const bsdm: DmState = getState().bsdm;

            state.brightSignEntryCommands.forEach((brightSignCommand: any) => {
              dispatch(
                buildCommand(
                  bsdm,
                  brightSignCommand,
                  CommandSequenceType.StateEntry,
                  addedStateMediaStateId));
            });

            state.brightSignExitCommands.forEach((brightSignCommand: any) => {
              dispatch(
                buildCommand(
                  bsdm,
                  brightSignCommand,
                  CommandSequenceType.StateExit,
                  addedStateMediaStateId));
            });

            // if (isNumber(state.x) && isNumber(state.y) &&
            //   isString(addedStateMediaStateId) && addedStateMediaStateId.length > 0) {
            //   baPeUiModelAddInteractiveCanvasState({
            //     id: addedStateMediaStateId,
            //     position: {
            //       x: state.x,
            //       y: state.y,
            //     }
            //   });
            // }
          }
        });
        return Promise.resolve(eventData);
      });
  };
}



// After the zones, states have been added, make a second pass to update those items that are dependent 
// on the items that are added in the first pass...
function executeSecondPass(arSign: ArSign) {
  return (dispatch: Function, getState: Function): any => {
    // dispatch(addPresentationDataFeeds());
    // dispatch(setUserVariableDataFeeds(arSign.meta.userVariables));
    // dispatch(addMediaCounterLiveTextItems());
    // dispatch(updateUpdateDataFeedCommands());
  };
}

export function buildCommand(
  bsdm: DmState,
  bpfCommand: any,
  sequenceType: CommandSequenceType,
  parentId: BsDmId): Function {

  return (dispatch: Function): any => {

    let command: DmCommand;

    const commandType: CommandType = bpfCommandNameToCommandType(bpfCommand.name);
    const commandDataParams: CommandDataParams = getCommandDataParams(bsdm, bpfCommand.operations);

    let commandData: DmCommandData | null = null;
    if (isNil(commandDataParams)) {
      commandData = dmCreateCommandData(commandType);

    } else {
      commandData = dmCreateCommandData(commandType, commandDataParams);
    }

    if (!isNil(commandType)) {
      if (isNil(commandData)) {
        command = dmCreateCommand(commandType.toString(), commandType);
      }
      else {
        command = dmCreateCommand(commandType.toString(), commandType, commandData);
      }
    }

    if (!isNil(command)) {
      const commandAddParams: CommandAddParams = dispatch(dmAddCommand(sequenceType, parentId, command));
      debugger;
      // addPendingCommand(bsdm, bpfCommand, converterSpec, commandType, commandDataParams, commandAddParams);
    }
  };
}

function bpfCommandNameToCommandType(bpfCommandName: string): CommandType {
  if (!isString(bpfCommandName) || bpfCommandName.length === 0) {
    debugger;
  }
  switch (bpfCommandName.toLowerCase()) {
    case 'sendbpoutput':
    case 'bp900aoutput':
    case 'bp900boutput':
    case 'bp900coutput':
    case 'bp900doutput':
    case 'bp200aoutput':
    case 'bp200boutput':
    case 'bp200coutput':
    case 'bp200doutput':
      return CommandType.SendBpOutput;
    case 'setallaudiooutputs':
      return CommandType.SetAllAudioOutputs;
    case 'setaudiomode':
      return CommandType.SetAudioMode;
    case 'configureaudioresources':
      return CommandType.ConfigureAudioResources;
    case 'setconnectorvolume':
      return CommandType.SetConnectorVolume;
    case 'incrementconnectorvolume':
      return CommandType.IncrementConnectorVolume;
    case 'decrementconnectorvolume':
      return CommandType.DecrementConnectorVolume;
    case 'muteaudiooutputs':
      return CommandType.MuteAudioOutputs;
    case 'unmuteaudiooutputs':
      return CommandType.UnmuteAudioOutputs;
    case 'setzonevolume':
      return CommandType.SetZoneVolume;
    case 'incrementzonevolume':
      return CommandType.IncrementZoneVolume;
    case 'decrementzonevolume':
      return CommandType.DecrementZoneVolume;
    case 'setzonechannelvolume':
      return CommandType.SetZoneChannelVolume;
    case 'incrementzonechannelvolume':
      return CommandType.IncrementZoneChannelVolume;
    case 'decrementzonechannelvolume':
      return CommandType.DecrementZoneChannelVolume;
    case 'sendzonemessage':
      return CommandType.SendZoneMessage;
    case 'sendudp':
      return CommandType.SendUdp;
    case 'sendudpbytes':
      return CommandType.SendUdpBytes;
    case 'sendirremote':
      return CommandType.SendIRRemote;
    case 'sendprontoirremote':
      return CommandType.SendProntoIRRemote;
    case 'serialsendstring':
    case 'serialsendstringcr':
    case 'serialsendstringnocr':
      return CommandType.SerialSendString;
    case 'serialsendbyte':
      return CommandType.SerialSendByte;
    case 'serialsendbytes':
      return CommandType.SerialSendBytes;
    case 'sendpluginmessage':
      return CommandType.SendPluginMessage;
    case 'synchronize':
      return CommandType.Synchronize;
    case 'internalsynchronize':
      return CommandType.InternalSynchronize;
    case 'gpioon':
      return CommandType.GpioOn;
    case 'gpiooff':
      return CommandType.GpioOff;
    case 'gpiosetstate':
      return CommandType.GpioSetState;
    case 'pausevideo':
      return CommandType.PauseVideo;
    case 'resumevideo':
      return CommandType.ResumeVideo;
    case 'enablepowersavemode':
      return CommandType.EnablePowerSaveMode;
    case 'disablepowersavemode':
      return CommandType.DisablePowerSaveMode;
    case 'brightcontroldisplayon':
    case 'cecdisplayon':
      return CommandType.CecDisplayOn;
    case 'brightcontroldisplayoff':
    case 'cecdisplayoff':
      return CommandType.CecDisplayOff;
    case 'brightcontrolsetsourcebrightsign':
    case 'cecsetsourcetobrightsign':
      return CommandType.CecSetSourceToBrightSign;
    case 'brightcontrolsendasciistring':
    case 'cecsendstring':
      return CommandType.CecSendString;
    case 'brightcontrolphilipssetvolume':
    case 'cecphilipssetvolume':
      return CommandType.CecPhilipsSetVolume;
    case 'beaconstart':
      return CommandType.BeaconStart;
    case 'beaconstop':
      return CommandType.BeaconStop;
    case 'pause':
      return CommandType.Pause;
    case 'resume':
      return CommandType.Resume;
    case 'setvariable':
      return CommandType.SetVariable;
    case 'incrementvariable':
      return CommandType.IncrementVariable;
    case 'decrementvariable':
      return CommandType.DecrementVariable;
    case 'resetvariable':
      return CommandType.ResetVariable;
    case 'resetvariables':
      return CommandType.ResetVariables;
    case 'switchpresentation':
      return CommandType.SwitchPresentation;
    case 'updatedatafeed':
      return CommandType.UpdateDataFeed;
    case 'resizezone':
      return CommandType.ResizeZone;
    case 'hidezone':
      return CommandType.HideZone;
    case 'showzone':
      return CommandType.ShowZone;
    case 'reboot':
      return CommandType.Reboot;
    case 'sendwss':
      return CommandType.SendWss;
    case 'blc400a':
    case 'blc400b':
    case 'blc400c':
      return CommandType.SendBLC400Output;
    default:
      debugger;
  }
}

function getCommandDataParams(bsdm: DmState, operations: any[]): CommandDataParams {
  let commandDataParams: CommandDataParams = {};
  operations.forEach((operation: any) => {
    switch (operation.name) {
      // no parameter operations
      case BACommandNames.BaConfigureAudioResources:
      case BACommandNames.BaResetVariables:
      case BACommandNames.BaCecDisplayOn:
      case BACommandNames.BaCecDisplayOff:
      case BACommandNames.BaCecSetSourceBrightSign:
      case BACommandNames.BaBrightControlDisplayOn:
      case BACommandNames.BaBrightControlDisplayOff:
      case BACommandNames.BaBrightControlSetSourceBrightSign:
      case BACommandNames.BaDisablePowerSaveMode:
      case BACommandNames.BaEnablePowerSaveMode:
      case BACommandNames.BaPauseVideoCommand:
      case BACommandNames.BaReboot:
      case BACommandNames.BaResumeVideoCommand:
        break;
      case BACommandNames.BaCecPhilipsSetVolume:
      // case BACommandNames.BaBrightControlPhilipsSetVolume:
      //   commandDataParams = getCecSetVolumeParams(bsdm, commandDataParams, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaSetAllAudioOutputs:
      //   commandDataParams = getSetAllAudioOutputsParams(bsdm, commandDataParams, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaSetAudioMode:
      //   commandDataParams = getSetAudioModeParams(bsdm, commandDataParams, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaCecSendString:
      // case BACommandNames.BaBrightControlSendAsciiString:
      //   commandDataParams = getCecSendStringCommandParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaSendIRRemote:
      //   commandDataParams = getSendIRRemoteCommandParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaSendPluginMessage:
      //   commandDataParams = getSendPluginMessageCommandParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaSendSerialBlockCommand:
      //   commandDataParams = getSendSerialStringNoEolCommandParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaSendSerialByteCommand:
      //   commandDataParams = getSendSerialByteCommandParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaSendSerialBytesCommand:
      //   commandDataParams = getSendSerialBytesCommandParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaSendSerialStringCommand:
      //   commandDataParams = getSendSerialStringWithEolCommandParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaSendUDPBytesCommand:
      //   commandDataParams = getSendUdpBytesCommandParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaSendUDPCommand:
      //   commandDataParams = getSendUdpCommandParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaGpioOffCommand:
      //   commandDataParams = getGpioOffCommandParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaGpioOnCommand:
      //   commandDataParams = getGpioOnCommandParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaIncrementZoneVolume:
      //   commandDataParams = getIncrementZoneVolumeCommandParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaDecrementZoneVolume:
      //   commandDataParams = getDecrementZoneVolumeCommandParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaGpioSetStateCommand:
      //   commandDataParams = getGpioSetStateCommandParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaSendZoneMessage:
      //   commandDataParams = getSendZoneMessageCommandParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaSetZoneVolume:
      //   commandDataParams = getSetZoneVolumeCommandParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaSendBPOutput:
      //   commandDataParams = getSendBpOutputCommandParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaSynchronize:
      //   commandDataParams = getSynchronizeCommandParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaPause:
      //   commandDataParams = getPauseCommandParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaSetConnectorVolume:
      //   commandDataParams = getSetConnectorVolumeCommandParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaSetVariable:
      //   commandDataParams = getSetVariableCommandParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaSendWss:
      //   commandDataParams = getSendWssParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaBeaconStart:
      //   commandDataParams = getBeaconStartParams(bsdm, operation.parameters);
      //   break;
      // case BACommandNames.BaBeaconStop:
      //   commandDataParams = getBeaconStopParams(bsdm, operation.parameters);
      //   break;
      // case BACommandNames.BaDecrementConnectorVolume:
      //   commandDataParams = getDecrementConnectorVolumeParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaDecrementVariable:
      //   commandDataParams = getDecrementVariableParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaDecrementZoneChannelVolume:
      //   commandDataParams = getDecrementZoneChannelVolumeParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaHideZone:
      //   commandDataParams = getHideZoneParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaIncrementConnectorVolume:
      //   commandDataParams = getIncrementConnectorVolumeParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaIncrementVariable:
      //   commandDataParams = getIncrementVariableParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaIncrementZoneChannelVolume:
      //   commandDataParams = getIncrementZoneChannelVolumeParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaInternalSynchronize:
      //   commandDataParams = getInternalSynchronizeParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaMuteAudioOutputs:
      //   commandDataParams = getMuteAudioOutputsParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaResetVariable:
      //   commandDataParams = getResetVariableParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaResizeZone:
      //   commandDataParams = getResizeZoneParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaSendBLC400Output:
      //   commandDataParams = getSendBLC400OutputParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaSendProntoIRRemote:
      //   commandDataParams = getSendProntoIRRemoteParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaSetZoneChannelVolume:
      //   commandDataParams = getSetZoneChannelVolumeParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaShowZone:
      //   commandDataParams = getShowZoneParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaSwitchPresentation:
      //   commandDataParams = getSwitchPresentationParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaUnmuteAudioOutputs:
      //   commandDataParams = getUnmuteAudioOutputsParams(bsdm, operation.parameters, converterSpec);
      //   break;
      // case BACommandNames.BaUpdateDataFeed:
      //   commandDataParams = getUpdateDataFeedParams(bsdm, operation.parameters, converterSpec);
      //   break;
      default:
        debugger;
    }
  });

  return commandDataParams;
}

function createDummyAssetItem(assetType: AssetType, fileName: string, filePath: string, mediaType?: MediaType) {
  const stub: undefined = undefined; // stub out optional fields with undefined placeholder for dummy asset item
  const homePath = getAbsoluteHomePath();
  return bscAssetItemFromBasicAssetInfo(assetType, fileName, homePath, stub, mediaType, stub, filePath);
}

export function getAbsoluteHomePath() {
  return os.homedir();
}


