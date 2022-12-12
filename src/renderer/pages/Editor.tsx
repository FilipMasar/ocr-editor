import { Center, Loader, Title } from '@mantine/core';
import { FC, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import EditorOverlay from 'renderer/components/editorOverlay/EditorOverlay';
import Viewer from 'renderer/components/Viewer';
import { useAlto } from 'renderer/context/AltoContext';
import { useEditor } from 'renderer/context/EditorContext';

const Editor: FC = () => {
  const [urlSearchParams] = useSearchParams();
  const index = urlSearchParams.get('index');
  const imageFileName = urlSearchParams.get('image');
  const altoFileName = urlSearchParams.get('alto');

  const { imageSrc, requestPageAssets, settings, setSettings, saveAlto } =
    useEditor();
  const { pageDimensions } = useAlto();

  const alignCenter = useCallback(() => {
    const ratio = (window.innerHeight - 40) / pageDimensions.height;
    const newZoom =
      ratio < 1 ? Math.floor(ratio * 10) / 10 : Math.ceil(ratio * 10) / 10;
    const xCenter = (2 * pageDimensions.width + 40) / 2 - window.innerWidth / 2;
    window.scrollTo({ left: xCenter, top: 0 });
    setSettings((old) => ({ ...old, zoom: newZoom }));
  }, [pageDimensions, setSettings]);

  const onSave = useCallback(() => {
    if (altoFileName && index) {
      saveAlto(altoFileName, parseInt(index, 10));
    }
  }, [altoFileName, index, saveAlto]);

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
      <Center mt={120}>
        <Loader />
        <Title order={2} ml="sm">
          Loading...
        </Title>
      </Center>
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
      <EditorOverlay
        alignCenter={alignCenter}
        pageNumber={parseInt(index || '0', 10)}
        onSave={onSave}
      />
    </>
  );
};

export default Editor;
