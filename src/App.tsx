import { ChangeEvent, useState } from 'react';
import { XMLParser } from "fast-xml-parser";
import './App.css';
import Viewer from './components/Viewer';
import Editor from './components/Editor';

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
    <div style={{ display: "flex" }}>
      <div style={{ width: "70%", backgroundColor: "blue", height: "100vh", overflow: "scroll"}}>
        <Viewer imageFile={imageFile} printSpace={xmlData?.alto?.Layout?.Page?.PrintSpace} />
      </div>
      <div style={{ width: "30%", backgroundColor: "red", height: "100vh", overflow: "scroll"}}>
        <Editor handleAltoChange={handleAltoChange} handleImageChange={handleImageChange} />
      </div>
    </div>
  );
}

export default App;
