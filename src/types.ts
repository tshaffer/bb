import {
  AccessType,
  AssetType,
  BsnDataFeedAssetType,
} from '@brightsign/bscore';

import {
  BsDmId,
  DmDataFeedSourceSpecification,
} from '@brightsign/bsdatamodel';

export type StringToStringDictionary = { [name: string]: string };

export interface BpfConversionParameters {
  presentationName: string;
  desktopConversion: boolean;
  buffer: any;
  updateToCompatibleBsModel: boolean;
}

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



