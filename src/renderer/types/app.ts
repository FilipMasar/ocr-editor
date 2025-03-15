export type Settings = {
  imageOpacity: number;
  show: {
    printSpace: boolean;
    illustrations: boolean;
    graphicalElements: boolean;
    textBlocks: boolean;
    textLines: boolean;
    strings: boolean;
    composedBlocks: boolean;
    textFit: boolean;
    textAbove: boolean;
    textNext: boolean;
    hyphens: boolean;
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
