export type Settings = {
  zoom: number;
  imageOpacity: number;
  show: {
    printSpace: boolean;
    illustrations: boolean;
    graphicalElements: boolean;
    textBlocks: boolean;
    textLines: boolean;
    strings: boolean;
    textFit: boolean;
    textAbove: boolean;
    textNext: boolean;
  };
};

export type TextStyle = {
  fontSize: number;
  fontFamily: string;
  color?: string;
};

export type PageDimensions = {
  width: number;
  height: number;
};
