import { ChangeEvent, useEffect, useState } from 'react';
import { XMLParser } from "fast-xml-parser";
import './App.css';
import TextBlock from './components/TextBlock';

function App() {
  const [xmlData, setXmlData] = useState<any>();
  const [textBlocks, setTextBlocks] = useState<any[]>([]);

  function parseXml(xml: string) {
    const options = {
      parseAttributeValue: true,
      ignoreAttributes: false,
      attributeNamePrefix : "@_",
      allowBooleanAttributes: true
    };
    const parser = new XMLParser(options);
    const obj = parser.parse(xml);
    setXmlData(obj);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target?.files?.length === 1) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        parseXml(String(e.target?.result));
      };
      reader.readAsText(event.target.files[0])
    }
  }

  useEffect(() => {
    if (xmlData?.alto?.Layout?.Page?.PrintSpace?.TextBlock) {
      if (Array.isArray(xmlData.alto.Layout.Page.PrintSpace.TextBlock)) {
        setTextBlocks(xmlData.alto.Layout.Page.PrintSpace.TextBlock);
      } else {
        setTextBlocks([xmlData.alto.Layout.Page.PrintSpace.TextBlock]);
      }
    }
  }, [xmlData]);

  console.log(textBlocks)

  return (
    <div className="App">
      <header className="App-header">
        <p>Pick alto xml file: </p>
        <input type="file" onChange={handleChange} accept=".xml"/>
      </header>
        {textBlocks.map((textBlock: any, index: number) => <TextBlock key={index} textBlock={textBlock} />)}
    </div>
  );
}

export default App;
