import { FC, useEffect, useState } from "react";
import TextLine from "./TextLine";

interface TextBlockProps {
  textBlock: any;
}

const TextBlock:FC<TextBlockProps> = ({ textBlock }) => {
  const [textLines, setTextLines] = useState<any[]>([]);
  
  useEffect(() => {
    if (textBlock?.TextLine) {
      if (Array.isArray(textBlock.TextLine)) {
        setTextLines(textBlock.TextLine);
      } else {
        setTextLines([textBlock.TextLine]);
      }
    }
  }, [textBlock]);

  return (
    <div>
      {textLines.map((textLine: any, index: number) => <TextLine key={index} textLine={textLine} />)}
    </div>
  );
};

export default TextBlock;