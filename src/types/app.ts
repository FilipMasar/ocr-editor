export type Settings = {
  zoom: number,
  imageOpacity: number,
  show: {
    printSpace: boolean,
    illustrations: boolean,
    graphicalElements: boolean,
    textBlocks: boolean,
    textLines: boolean,
    strings: boolean,
    textFit: boolean,
    textAbove: boolean,
  }
}

export type TextStyle = {
  fontSize: number,
  fontFamily: string,
}
