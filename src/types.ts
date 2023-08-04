import {
  AccessType,
  AssetType,
  AudioMappingType,
  AudioMixModeType,
  AudioModeType,
  AudioOutputSelectionType,
  BsAssetItem,
  BsColor,
  BsIrRemoteControl,
  BsRect,
  BsnDataFeedAssetType,
  CompareOperator,
  DataFeedType,
  DataFeedUsageType,
  EventIntrinsicAction,
  GraphicsZOrderType,
  ImageModeType,
  MediaListPlaybackType,
  MosaicMaxContentResolutionType,
  PlayerTagMatchingType,
  RotationType,
  SystemVariableType,
  TextHAlignmentType,
  TextScrollingMethodType,
  TransitionType,
  TwitterFeedRestrictionType,
  ViewModeType,
  WssDeviceSpec,
} from '@brightsign/bscore';

import {
  BsDmId,
  DmAudioZonePropertyData,
  DmDataFeedSourceSpecification,
  DmImageZonePropertyData,
  DmMediaState,
  DmPartnerProductCollectionState,
  DmScreen,
  DmSignHardwareConfiguration,
  DmSignProperties,
  DmTickerZonePropertyData,
  DmUserVariableData,
  DmVideoZonePropertyData,
  DmcCommand,
  DmcEvent,
} from '@brightsign/bsdatamodel';

export type StringToStringDictionary = { [name: string]: string };

export interface BaBaseDataFeedSourceSpecification {
  name: string;
  assetType: AssetType;
  usage: string;
  updateInterval: number;
  useHeadRequest: boolean;
  inUse: boolean;
}

export interface BaRemoteDataFeedSourceSpecification extends BaBaseDataFeedSourceSpecification {
  type: 'URLDataFeed';
  url: string;
}

export interface BaBsnDataFeedSourceSpecification extends BaBaseDataFeedSourceSpecification {
  type: BsnDataFeedAssetType;
  feedAssetItemSpec: BaFeedAssetItemSpec;
}

export type BaDataFeedSourceSpecification = BaRemoteDataFeedSourceSpecification | BaBsnDataFeedSourceSpecification;

export type DataFeedSourceDictionary = { [dataFeedSourceId: string]: BaDataFeedSourceSpecification };

export type DmDataFeedSourceDictionary = { [dataFeedSourceId: string]: DmDataFeedSourceSpecification };

export type DataFeedSourceIdDictionary = { [name: string]: string };

export interface BaDataFeedSpecification {
  parserPlugin: BsDmId;
  autoGenerateUserVariables: boolean;
  userVariableAccess: AccessType;
  // TODO playerTagMatching?
}

export type DataFeedDictionary = { [name: string]: BaDataFeedSpecification };

export type DataFeedInUseDictionary = { [name: string]: boolean };

export type UpdateDataFeedCommandDictionary = { [id: string ]: string };

export interface BpfConverterSpec {
  updateDataFeedCommandsDictionary: UpdateDataFeedCommandDictionary;
  baDataFeedSourceDictionary: DataFeedSourceDictionary;
  dmDataFeedSourceDictionary: DmDataFeedSourceDictionary;
  dataFeedSourceIdDictionary: DataFeedSourceIdDictionary;
  dataFeedDictionary: DataFeedDictionary;
  dataFeedInUseDictionary: DataFeedInUseDictionary;
}

export interface BaseTextTemplateItemSimple {
  backgroundColorSpecified: boolean;
  layer: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TextWidgetItem {
  alignment: string;
  delay: number;
  numberOfLines: number;
  rotation: number;
  scrollingMethod: number;
}

export interface WidgetItem {
  backgroundTextColor: any;
  foregroundTextColor: any;
  font: string;
  fontSize: number;
}

export interface BaseTextTemplateItem extends BaseTextTemplateItemSimple {
  textWidgetItem: TextWidgetItem;
  widgetItem: WidgetItem;
}


export interface MediaCounterTextTemplateItem extends BaseTextTemplateItem {
  fileName: string;
}

export interface MediaCounterSimple extends BaseTextTemplateItemSimple  {
  fileName: string;
}

export interface BaFeedAssetItemSpec {
  id: number;
  name: string;
  url: string;
}







export interface ArAudioZonePropertyData {
  audioOutput: AudioOutputSelectionType;
  audioMode: AudioModeType;
  audioMapping: AudioMappingType;
  audioMixMode: AudioMixModeType;
  audioVolume: number;
  minimumVolume: number;
  maximumVolume: number;
  analogOutput: string;
  analog2Output: string;
  analog3Output: string;
  hdmiOutput: string;
  hdmi1Output?: string;
  hdmi2Output?: string;
  hdmi3Output?: string;
  hdmi4Output?: string;
  spdifOutput: string;
  usbOutputA: string;
  usbOutputB: string;
  usbOutputC: string;
  usbOutputD: string;
  usbOutputTypeA: string;
  usbOutputTypeC: string;
  usbOutput700_1: string;
  usbOutput700_2: string;
  usbOutput700_3: string;
  usbOutput700_4: string;
  usbOutput700_5: string;
  usbOutput700_6: string;
  usbOutput700_7: string;
  usbOutput_1: string;
  usbOutput_2: string;
  usbOutput_3: string;
  usbOutput_4: string;
  usbOutput_5: string;
  usbOutput_6: string;
}
export type ArAudioZonePropertyParams = Partial<ArAudioZonePropertyData>;

export interface ArEnhancedAudioZonePropertyData {
  fadeLength: number;
}

export type ArEnhancedAudioZonePropertyParams = Partial<ArEnhancedAudioZonePropertyData>;

export interface ArEnhancedAudioZoneProperties extends Partial<ArAudioZonePropertyData>,
  Partial<ArEnhancedAudioZonePropertyData> {
}

export interface ArVideoZonePropertyData {
  viewMode: ViewModeType;
  videoVolume: number;
  zOrderFront: boolean;
  mosaic: boolean;
  maxContentResolution: MosaicMaxContentResolutionType;
  mosaicDecoderName?: string;
}
export type ArVideoZonePropertyParams = Partial<ArVideoZonePropertyData>;

export interface ArVideoZoneProperties extends Partial<ArAudioZonePropertyData>, Partial<ArVideoZonePropertyData> {
}

export interface ArImageZonePropertyData {
  imageMode: ImageModeType;
}
export type ArImageZonePropertyParams = Partial<ArImageZonePropertyData>;

export interface ArVideoOrImagesZoneProperties extends Partial<ArVideoZoneProperties>,
  Partial<ArImageZonePropertyData> {
}

export interface ArWidget {
  foregroundTextColor: BsColor;
  backgroundTextColor: BsColor;
  font: string;
  fontSize: number;
  backgroundBitmap?: ArBackgroundBitmap;
  // backgroundBitmapAssetId: BsAssetId;
  // stretchBitmapFile: boolean;
  safeTextRegion: BsRect;
  // backgroundBitmapFilePath: string;
}

export interface ArBackgroundBitmap {
  file: string;
  stretch: boolean;
}

export interface ArTextWidget {
  numberOfLines: number;
  delay: number;
  rotation: RotationType;
  alignment: TextHAlignmentType;
  scrollingMethod: TextScrollingMethodType;
}

export interface ArTickerZoneProperties {
  textWidget: Partial<ArTextWidget>;
  widget: Partial<ArWidget>;
  scrollSpeed: number;
}
export type ArTickerZonePropertyParams = Partial<ArTickerZoneProperties>;

export interface ArClockWidget {
  foregroundTextColor: BsColor;
  backgroundTextColor: BsColor;
  fontFileName?: string;
  fontSize?: number;
  backgroundBitmapFileName?: string;
  stretchBitmapFile?: boolean;
  safeTextRegion?: BsRect | null;
}

export interface ArClockZoneProperties {
  clockFormat: string;
  rotation: RotationType;
  widget: ArClockWidget;
}

export type ArZoneProperties = ArAudioZonePropertyParams | ArImageZonePropertyParams | ArVideoZoneProperties
  | ArVideoOrImagesZoneProperties | ArClockZoneProperties
  | ArTickerZonePropertyParams | ArEnhancedAudioZonePropertyParams | {};

export interface ArAutoplay {
  BrightAuthor: ArSign;
}

export interface BrightAuthorPublishMetadata {
  version: number;
  BrightAuthorConnectedVersion: string;
  type: string;
}

export interface ArSign extends BrightAuthorPublishMetadata {
  meta: ArSignMetadata;
  zones: ArZone[];
  screens: ArScreen[][];
}

export interface ArSignMetadata extends DmSignProperties, DmSignHardwareConfiguration {
  audioConfiguration: any;
  customDeviceWebPage: ArCustomDeviceWebPage | null;
  nodeApps?: any;
  htmlSites?: any;
  userVariables?: any;
  userDefinedEvents?: any;
  scriptPlugins?: any;
  parserPlugins?: any;
  videoModePlugins?: any;
  auxiliaryFiles?: any;
  presentationIdentifiers?: any;
  beacons?: any;
  liveDataFeeds?: any;
  dataFeedSources: any;
  partnerProducts?: DmPartnerProductCollectionState;
  bmapSpecAssetName?: string;
  wssDeviceSpec?: WssDeviceSpec;
  graphicsZOrder?: GraphicsZOrderType;
  irRemoteControl?: BsIrRemoteControl;
}

export interface ArPartnerProduct {
  name: string;
  productName: string;
  port: string;
}

export interface ArScriptPlugin {
  name: string;
  filePath: string;
}

export interface ArVideoModePlugin {
  name: string;
  filePath: string;
  functionName: string;
}

export interface ArParserPlugin {
  name: string;
  filePath: string;
  feedParserFunctionName: string;
  userVariableParserFunctionName: string;
  userAgentParserFunctionName: string;
}

export interface ArCustomDeviceWebPage {
  name: string;
  indexFileName: string;
}

export interface ArNodeApp {
  name: string;
  prefix?: string;
  filePath?: string;
  fileName?: string;
}

// TODO - improve
export interface ArHtmlSite {
  name: string;
  queryString: ArParameterValue;
  contentIsLocal: boolean;
  enableNode?: boolean;
  prefix?: string;
  filePath?: string;
  fileName?: string;
  url?: ArParameterValue;
}

export interface ArDataFeed {
  id: string;
  type: DataFeedType;
  usage: DataFeedUsageType;
  url?: ArParameterValue;
  updateInterval: number;
  useHeadRequest: boolean;
  parserPluginName?: string;
  autoGenerateUserVariables: boolean;
  userVariableAccess: AccessType;
  playerTagMatching?: PlayerTagMatchingType;
}

export interface ArUserVariable {
  name: string;
  defaultValue: string;
  access: AccessType;
  systemVariable: SystemVariableType;
  liveDataFeedId: string;
  url: string;
  data?: DmUserVariableData | null,
}

export type ArZone = ArAudioZone | ArImageZone | ArTickerZone | ArVideoZone | ArVideoOrImagesZone;

export type ArScreen = DmScreen;

export interface ArZoneMetadata {
  id: any;
  name: any;
  type: any;
  absolutePosition: any;
  nonInteractive: any;
  initialMediaStateName: string;
  percentagePosition: any;
}

export interface ArAudioZone extends ArZoneMetadata {
  zoneSpecificParameters: DmAudioZonePropertyData;
  playlist: ArPlaylist;
}

export interface ArImageZone extends ArZoneMetadata {
  zoneSpecificParameters: DmImageZonePropertyData;
  playlist: ArPlaylist;
}

export interface ArTickerZone extends ArZoneMetadata {
  zoneSpecificParameters: DmTickerZonePropertyData;
  playlist: ArPlaylist;
}

export interface ArVideoZone extends ArZoneMetadata {
  zoneSpecificParameters: DmVideoZonePropertyData;
  playlist: ArPlaylist;
}

export interface ArVideoOrImagesZone extends ArZoneMetadata {
  zoneSpecificParameters: ArVideoOrImagesZoneProperties;
  playlist: ArPlaylist;
}

export interface ArPlaylist {
  name?: string;
  type?: string;
  initialMediaStateName?: string;
  states?: ArPlaylistState[];
  transitions?: ArTransition[];
}

export interface ArPlaylistMetadata {
  name: string;
  type: string;
}

export interface TransitionEffect {
  transitionType: TransitionType;
  transitionDuration: number;
}
export interface ArState {
  stateName: string;
}

export interface ArMediaPlaylistItem extends ArState {
  fileName: string;
  filePath: string;
  type?: string;
}

export interface ArImagePlaylistItem extends ArMediaPlaylistItem {
  transitionEffect: TransitionEffect;
}

export interface ArVideoItem extends ArMediaPlaylistItem {
  videoDisplayMode: any;        // VideoDisplayModeType
  automaticallyLoop: boolean;
}

export interface ArTextStringItem {
  textString: string;
}

export interface ArTextItem extends ArMediaPlaylistItem {
  strings: ArTextStringItem[];
}

export interface ArAudioItem extends ArMediaPlaylistItem {
  volume: number;
}

export interface ArHtml5Item extends ArState {
  htmlSiteName: string;
  enableBrightSignJavascriptObjects: boolean;
  enableCrossDomainPolicyChecks: boolean;
  ignoreHttpsCertificateErrors: boolean;
  enableCamera: boolean;
  enableMouseEvents: boolean;
  displayCursor: boolean;
  hwzOn: boolean;
  useUserStylesheet: boolean;
  customFonts: string[];
  enableFileURLSharedStorage: boolean;
  enableHtmlURLSharedStorage: boolean;
}

export interface ArEventHandlerItem extends ArState {
  stopPlayback: boolean;
}

export interface ArLiveVideoItem extends ArState {
  volume: number;
  overscan: boolean;
}

export interface ArAVStreamItem extends ArState {
  url: any;
}

export interface ArMjpegStreamItem extends ArAVStreamItem {
  rotation: RotationType;
}

export interface ArMrssFeedItem extends ArState {
  liveDataFeedId: string;
}

export interface ArRssDataFeedItem extends ArState {
  liveDataFeedId: string;
}

export type ArPlayFileItemContentItem = ArImagePlaylistItem | ArVideoItem | ArAudioItem | {};

export interface ArPlayFileItemItem {
  contentItem: ArPlayFileItemContentItem;
  key: string;
  label: string;
  export: boolean;
  // fileName: string;
  // fileType: string;
  videoDisplayMode: string;
}

export interface ArPlayFileItem extends ArState {
  contentItems: ArPlayFileItemItem[];
  useDataFeed: boolean;
  dataFeedId: string;
  useDefaultMedia: boolean;
  defaultMediaContentItem: ArPlayFileItemContentItem | null;
  transition: TransitionType;
  useUserVariable: boolean;
  userVariableName: string;
}

export type ArMediaListItemItem = ArImagePlaylistItem | ArVideoItem | ArAudioItem | {};

export interface ArMediaListItem extends ArState {
  contentItems: ArMediaListItemItem[];
  playbackType: MediaListPlaybackType;
  startIndex: number;
  shuffle: boolean;
  support4KImage: boolean;
  sendZoneMessage: boolean;
  inactivityTimeout: boolean;
  inactivityTime: number;
  useDataFeed: boolean;
  dataFeedId: string;
  transitionEffect: TransitionEffect;
  transitionToNextEventList: ArUserEvent[];
  transitionToPreviousEventList: ArUserEvent[];
  transitionToNextCommands: ArCommand[];
  transitionToPreviousCommands: ArCommand[];
}

export interface ArLiveTextBackgroundImageItem {
  fileName: string;
  filePath: string;
  width: number;
  height: number;
}

export interface ArLiveTextItem extends ArState {
  backgroundImageFile: ArLiveTextBackgroundImageItem;
  constantTextTemplateItems: any;
  systemVariableTemplateItems: any;
  userVariableTemplateItems: any;
  mediaCounterLiveTextItems: any;
  indexedLiveTextDataItems: any;
  titledLiveTextDataItems: any;
  imageTemplateItems: any;
  simpleRssTemplateItems: any;
  mediaRssLiveDataFeedIds: string[];
  mediaRssTextTemplateItems: any;
  mediaRssCustomFieldTemplateItems: any;
  mediaRssMediaTemplateItem: any;
}

export interface ArTwitterItem extends ArState {
  authToken: string;
  BSConsumerKey: string;
  encryptedTwitterSecrets: string;
  numberOfRecentDaysForTweets: number;
  numberOfTweetsToShow: number;
  restrictNumberOfTweets: TwitterFeedRestrictionType;
  updateInterval: number;
  userName: string;
}

export type ArPlaylistState = ArImagePlaylistItem | ArVideoItem | ArAudioItem |
  ArHtml5Item | ArLiveVideoItem | ArTextItem |
  ArAVStreamItem | ArMrssFeedItem | ArRssDataFeedItem | ArTwitterItem | ArMediaListItem | ArLiveTextItem | any;

// export interface ArMediaState extends DmcMediaState {
export interface ArMediaState extends DmMediaState {
  uniqueIdentifier: string;
  mediaAssetItem: BsAssetItem | null;
  eventList: DmcEvent[];
  entryCommands: DmcCommand[];
  exitCommands: DmcCommand[];
}

export type ArMediaStateLUT = { [id: string]: ArMediaState };

export type EventLUT = { [id: string]: DmcEvent };

export interface ArConditionalTransition {
  variableName: string;
  compareOperator: CompareOperator;
  compareValue1: ArParameterValue;
  compareValue2?: ArParameterValue;
  conditionalAction: EventIntrinsicAction;
  targetMediaState: string | null;
  commands: DmcCommand[];
}

export interface ArTransition {
  sourceMediaState: string;
  userEvent: any;
  targetMediaState: string | null;
  eventAction: EventIntrinsicAction;
  assignInputToUserVariable: boolean;
  assignWildcardToUserVariable: boolean;
  variableToAssignFromInput: string | null;
  variableToAssignFromWildcard: string | null;
  commands: DmcCommand[];
  conditionalTransitions: ArConditionalTransition[];
}

export interface ArUserEvent {
  name: string;
  data?: any;
}

export interface ArParameterValueItem {
  type: string;
  value: string;
}

export interface ArParameterValue extends Array<ArParameterValueItem> { }

export interface ArNamedParameterValue {
  [name: string]: ArParameterValueItem[];
}

// export interface ArCommandParameter {
//   parameterName: string;
//   parameterValue: any;
// }

// export interface ArCommandOperation {
//   name: string;
//   parameters: ArParameterValueItem[];
// }

// export interface ArCommand {
//   name: string;
//   command: ArCommandOperation;
// }
export type ArCommandOperation = any;
export type ArCommand = any;

// TAS TODO - near duplicate of prior definition
export interface ArUserVariableCommandParameter {
  name: string;
  defaultValue: string;
  networked: boolean;
  liveDataFeedId: string;
  systemVariable: string;
  access: string;
}

export interface ArUserEventVariableParameters {
  assignInputToUserVariable: boolean;
  assignWildcardToUserVariable: boolean;
  variableToAssignFromInput: string;
  variableToAssignFromWildcard: string;
}



