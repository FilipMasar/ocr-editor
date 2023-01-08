import { Center, Title } from '@mantine/core';
import { ChangeEvent, FC, useEffect, useState } from 'react';

const Test: FC = () => {
  const [imageSrc, setImageSrc] = useState<string>();
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('editor-channel', {
      action: 'GET_PAGE_ASSETS',
      payload: { imageFileName: 'alto.jpg', altoFileName: 'alto.xml' },
    });

    window.electron.ipcRenderer.on('editor-channel', (data) => {
      console.log('editor-channel', data);
      switch (data.action) {
        case 'PAGE_ASSETS':
          setImageSrc(data.payload.imageUri);
          console.log(data.payload.altoJson);
          break;
        case 'ERROR':
          console.log(String(data.payload));
          break;
        default:
          console.log('Unhandled action:', data.action);
      }
    });
  }, []);

  const updateZoom = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setZoom(parseFloat(e.target.value));
  };

  if (imageSrc === undefined)
    return (
      <div>
        <Title>Loading...</Title>
      </div>
    );

  return (
    <>
      <div
        style={{
          minHeight: '100vh',
          minWidth: '100vw',
          width: 2040,
          height: 4040,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'relative',
            margin: 20,

            transform: `scale(${zoom})`,
            transformOrigin: 'center top',
          }}
        >
          <img width={1000} height={2000} src={imageSrc} alt="" />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 1000,
              height: 2000,
              border: '1px black solid',
            }}
          />
        </div>
      </div>
      <div
        style={{
          backgroundColor: 'white',
          width: 150,
          height: 60,
          position: 'fixed',
          bottom: 0,
          right: 0,
          zIndex: 100,
        }}
      >
        <label htmlFor="zoomInput">Zoom: {zoom}</label>
        <input
          id="zoomInput"
          className="w-full"
          type="range"
          min={0.1}
          max={2}
          step={0.1}
          value={zoom}
          onChange={updateZoom}
        />
      </div>
    </>
  );
};

export default Test;
