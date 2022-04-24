import { FC, useEffect, useState } from "react";

interface TextLineProps {
  textLine: any;
}

const TextLine:FC<TextLineProps> = ({ textLine }) => {
  const [strings, setStrings] = useState<any[]>([]);
  
  useEffect(() => {
    if (textLine?.String) {
      if (Array.isArray(textLine.String)) {
        setStrings(textLine.String);
      } else {
        setStrings([textLine.String]);
      }
    }
  }, [textLine]);

  return (
    <div>
      {strings.map((str: any, index: number) => <span key={index}>{str["@_CONTENT"]} </span>)}
    </div>
  );
};

export default TextLine;