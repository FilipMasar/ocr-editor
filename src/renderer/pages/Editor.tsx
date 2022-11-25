import { Title } from '@mantine/core';
import { FC, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import EditorOverlay from 'renderer/components/EditorOverlay';
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

  const alignCenter = useCallback(() => {
    const ratio = (window.innerHeight - 40) / pageDimensions.height;
    const newZoom =
      ratio < 1 ? Math.floor(ratio * 10) / 10 : Math.ceil(ratio * 10) / 10;
    const xCenter = (2 * pageDimensions.width + 40) / 2 - window.innerWidth / 2;
    window.scrollTo({ left: xCenter, top: 0 });
    setSettings((old) => ({ ...old, zoom: newZoom }));
  }, [pageDimensions, setSettings]);

  useEffect(() => {
    alignCenter();
  }, [alignCenter]);

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
      <EditorOverlay alignCenter={alignCenter} />
    </>
  );
};

export default Editor;
