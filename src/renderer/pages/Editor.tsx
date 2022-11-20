import { Title } from '@mantine/core';
import { ChangeEvent, FC, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Viewer from 'renderer/components/Viewer';
import { useAlto } from 'renderer/context/AltoContext';
import { useEditor } from 'renderer/context/EditorContext';

const Editor: FC = () => {
  const [urlSearchParams] = useSearchParams();
  const index = urlSearchParams.get('index');
  const imageFileName = urlSearchParams.get('image');
  const altoFileName = urlSearchParams.get('alto');

  const { imageSrc, requestPageAssets, settings, setSettings } = useEditor();
  const { pageDimensions } = useAlto();

  const updateZoom = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSettings((old) => ({ ...old, zoom: parseFloat(e.target.value) }));
  };

  useEffect(() => {
    if (imageFileName && altoFileName) {
      requestPageAssets(imageFileName, altoFileName);
    }
  }, [imageFileName, altoFileName, requestPageAssets]);

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
          width: 2 * pageDimensions.width + 40,
          height: 2 * pageDimensions.height + 40,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'relative',
            margin: 20,
            transform: `scale(${settings.zoom})`,
            transformOrigin: 'center top',
          }}
        >
          <Viewer />
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
        <label htmlFor="zoomInput">Zoom: {settings.zoom}</label>
        <input
          id="zoomInput"
          className="w-full"
          type="range"
          min={0.1}
          max={2}
          step={0.1}
          value={settings.zoom}
          onChange={updateZoom}
        />
      </div>
    </>
  );
};

export default Editor;
