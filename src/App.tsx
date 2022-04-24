import { ChangeEvent, useState } from 'react';
import { XMLParser } from "fast-xml-parser";
import './App.css';
import Viewer from './components/Viewer';

function App() {
  const [xmlData, setXmlData] = useState<any>();
  const [imageFile, setImageFile] = useState<File>();

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

  function handleAltoChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target?.files?.length === 1) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        parseXml(String(e.target?.result));
      };
      reader.readAsText(event.target.files[0])
    }
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target?.files?.length === 1) {
      setImageFile(event.target.files[0])
    }
  }

  return (
    <div>
      <header className="header">
        <p>Pick alto xml file: </p>
        <input type="file" onChange={handleAltoChange} accept=".xml"/>
        <p>Pick jpeg scan: </p>
        <input type="file" onChange={handleImageChange} accept=".jpg"/>
      </header>
      <Viewer imageFile={imageFile} printSpace={xmlData?.alto?.Layout?.Page?.PrintSpace} />
    </div>
  );
}

export default App;
