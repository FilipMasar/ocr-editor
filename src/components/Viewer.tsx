import { FC, useEffect, useState } from "react";
import PrintSpace from "./PrintSpace";
import TextBlock from "./TextBlock";
import TextLine from "./TextLine";

interface ViewerProps {
  imageFile: File | undefined;
  printSpace: any;
}

const Viewer:FC<ViewerProps> = ({imageFile, printSpace}) => {
  const [textBlocks, setTextBlocks] = useState<any[]>([]);
  const [textLines, setTextLines] = useState<any[]>([]);

  useEffect(() => {
    if (printSpace?.TextBlock) {
      if (Array.isArray(printSpace.TextBlock)) {
        setTextBlocks(printSpace.TextBlock);
      } else {
        setTextBlocks([printSpace.TextBlock]);
      }
    }
  }, [printSpace]);
  
  useEffect(() => {
    for (const textBlock of textBlocks) {
      if (textBlock?.TextLine) {
        if (Array.isArray(textBlock.TextLine)) {
          setTextLines(old => old.concat(textBlock.TextLine));
        } else {
          setTextLines(old => [...old, textBlock.TextLine]);
        }
      }
    }
  }, [textBlocks]);

  // const [strings, setStrings] = useState<any[]>([]);
  
  // useEffect(() => {
  //   if (textLine?.String) {
  //     if (Array.isArray(textLine.String)) {
  //       setStrings(textLine.String);
  //     } else {
  //       setStrings([textLine.String]);
  //     }
  //   }
  // }, [textLine]);


  console.log("PRINTSPACE", printSpace)
  console.log("TEXTBLOCKs", textBlocks)

  if (printSpace === undefined) {
    return <h1>No or wrong xml</h1>
  }

  return (
    <div style={{position: "relative", width: "100%", height: "100%", margin: 20}}>
      {imageFile && <img src={URL.createObjectURL(imageFile)}  alt={imageFile.name} />}
      <PrintSpace top={printSpace["@_VPOS"]} left={printSpace["@_HPOS"]} width={printSpace["@_WIDTH"]} height={printSpace["@_HEIGHT"]} />
      {textBlocks.map((textBlock: any, index: number) => 
        <TextBlock key={index} top={textBlock["@_VPOS"]} left={textBlock["@_HPOS"]} width={textBlock["@_WIDTH"]} height={textBlock["@_HEIGHT"]} />
      )}
      {textLines.map((textLine: any, index: number) =>
        <TextLine key={index} top={textLine["@_VPOS"]} left={textLine["@_HPOS"]} width={textLine["@_WIDTH"]} height={textLine["@_HEIGHT"]} />
      )}
    </div>
  );
};

export default Viewer;