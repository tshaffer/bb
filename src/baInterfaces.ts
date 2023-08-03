import { BaFeedAssetItemSpec } from './types';
import { AccessType } from '@brightsign/bscore';

export class BACommandNames {
  static BaCecDisplayOff = 'cecDisplayOff';
  static BaCecDisplayOn = 'cecDisplayOn';
  static BaCecSetSourceBrightSign = 'cecSetSourceBrightSign';
  static BaCecPhilipsSetVolume = 'cecPhilipsSetVolume';
  static BaCecSendString = 'cecSendString';
  static BaSendBPOutput = 'sendBPOutput';
  static BaSendIRRemote = 'sendIRRemote';
  static BaSendPluginMessage = 'sendPluginMessage';
  static BaSendSerialBlockCommand = 'sendSerialBlockCommand';
  static BaSendSerialByteCommand = 'sendSerialByteCommand';
  static BaSendSerialBytesCommand = 'sendSerialBytesCommand';
  static BaSendSerialStringCommand = 'sendSerialStringCommand';
  static BaSendUDPBytesCommand = 'sendUDPBytesCommand';
  static BaSendUDPCommand = 'sendUDPCommand';
  static BaSendZoneMessage = 'sendZoneMessage';
  static BaGpioOffCommand = 'gpioOffCommand';
  static BaGpioOnCommand = 'gpioOnCommand';
  static BaGpioSetStateCommand = 'gpioSetStateCommand';
  static BaSetZoneVolume = 'setZoneVolume';
  static BaIncrementZoneVolume = 'incrementZoneVolume';
  static BaDecrementZoneVolume = 'decrementZoneVolume';
  static BaSynchronize = 'synchronize';
  static BaPause = 'pause';
  static BaSetConnectorVolume = 'setConnectorVolume';
  static BaSetVariable = 'setVariable';
  static BaResetVariables = 'resetVariables';
  static BaSendWss = 'sendWss';
  static BaBeaconStart = 'beaconStart';
  static BaBeaconStop = 'beaconStop';
  static BaBrightControlDisplayOn = 'BrightControlDisplayOn';
  static BaBrightControlDisplayOff = 'BrightControlDisplayOff';
  static BaBrightControlSetSourceBrightSign = 'BrightControlSetSourceBrightSign';
  static BaBrightControlSendAsciiString = 'BrightControlSendAsciiString';
  static BaBrightControlPhilipsSetVolume = 'BrightControlPhilipsSetVolume';
  static BaConfigureAudioResources = 'configureAudioResources';
  static BaDecrementConnectorVolume = 'decrementConnectorVolume';
  static BaDecrementVariable = 'decrementVariable';
  static BaDecrementZoneChannelVolume = 'decrementZoneChannelVolume';
  static BaDisablePowerSaveMode = 'disablePowerSaveMode';
  static BaEnablePowerSaveMode = 'enablePowerSaveMode';
  static BaHideZone = 'hideZone';
  static BaIncrementConnectorVolume = 'incrementConnectorVolume';
  static BaIncrementVariable = 'incrementVariable';
  static BaIncrementZoneChannelVolume = 'incrementZoneChannelVolume';
  static BaInternalSynchronize = 'internalSynchronize';
  static BaMuteAudioOutputs  = 'muteAudioOutputs';
  static BaPauseVideoCommand  = 'pauseVideoCommand';
  static BaReboot = 'reboot';
  static BaResetVariable = 'resetVariable';
  static BaResizeZone = 'resizeZone';
  static BaResumeVideoCommand  = 'resumeVideoCommand';
  static BaSendBLC400Output = 'sendBLC400Output';
  static BaSendProntoIRRemote  = 'sendProntoIRRemote';
  static BaSetAllAudioOutputs = 'setAllAudioOutputs';
  static BaSetAudioMode = 'setAudioMode';
  static BaSetZoneChannelVolume = 'setZoneChannelVolume';
  static BaShowZone = 'showZone';
  static BaSwitchPresentation = 'switchPresentation';
  static BaUnmuteAudioOutputs = 'unmuteAudioOutputs';
  static BaUpdateDataFeed = 'updateDataFeed';
}

Object.freeze(BACommandNames)

export interface Bpf {
  metadata: any;
  presentationParameters: any;
  zones: any[];
}

export interface LiveDataFeed {
  name: string;
  dataFeedUse: string;
  updateInterval: number;
  useHeadRequest: boolean;
  parserPluginName: string;
  autoGenerateUserVariables: boolean;
  userVariableAccess: AccessType;
  url?: any;
  liveBSNDataFeed?: BaFeedAssetItemSpec;
  liveMediaFeed?: BaFeedAssetItemSpec;
  liveDynamicPlaylist?: BaFeedAssetItemSpec;
  liveBSNTaggedPlaylist?: any;
}

