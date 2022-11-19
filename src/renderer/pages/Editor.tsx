import { Title } from '@mantine/core';
import { FC, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Viewer from 'renderer/components/Viewer';
import { useAlto } from 'renderer/context/AltoContext';
import { useEditor } from 'renderer/context/EditorContext';

const Editor: FC = () => {
  const [urlSearchParams] = useSearchParams();
  const index = urlSearchParams.get('index');
  const imageFileName = urlSearchParams.get('image');
  const altoFileName = urlSearchParams.get('alto');

  const { imageSrc, setImageSrc } = useEditor();
  const { alto, setAlto } = useAlto();

  useEffect(() => {
    if (imageFileName && altoFileName) {
      window.electron.ipcRenderer.sendMessage('editor-channel', {
        action: 'GET_PAGE_ASSETS',
        payload: { imageFileName, altoFileName },
      });
    }

    window.electron.ipcRenderer.on('editor-channel', (data) => {
      console.log('editor-channel', data);
      switch (data.action) {
        case 'PAGE_ASSETS':
          setImageSrc(data.payload.imageUri);
          setAlto(data.payload.altoJson);
          break;
        case 'ERROR':
          console.log(String(data.payload));
          break;
        default:
          console.log('Unhandled action:', data.action);
      }
    });
  }, [altoFileName, imageFileName, index]);

  if (imageSrc === undefined)
    return (
      <div>
        <Title>Loading...</Title>
      </div>
    );

  return (
    <div style={{ display: 'flex', position: 'relative' }}>
      <div style={{ height: '100vh', width: '100vh', overflow: 'scroll' }}>
        <Viewer />
      </div>
      {/* {panelOpened && (
        <div style={{ height }} className="w-1/3 bg-indigo-100 overflow-scroll">
          <Panel />
        </div>
      )} */}
    </div>
  );
};

export default Editor;
