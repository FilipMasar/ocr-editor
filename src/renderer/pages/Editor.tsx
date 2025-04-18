import { Center, Loader, Box } from '@mantine/core';
import { FC, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import EditorOverlay from '../components/editorOverlay/EditorOverlay';
import Viewer from '../components/Viewer';
import ValidationWarning from '../components/ValidationWarning';
import AltoVersionBadge from '../components/AltoVersionBadge';
import { useAlto } from '../context/app/AltoContext';
import { useEditor } from '../context/editor/EditorContext';
import { useSettings } from '../context/app/SettingsContext';
import { ErrorBoundary } from '../components/common';
import { logger } from '../utils/logger';

const Editor: FC = () => {
  const [urlSearchParams] = useSearchParams();
  const index = urlSearchParams.get('index');
  const imageFileName = urlSearchParams.get('image');
  const altoFileName = urlSearchParams.get('alto');

  const { settings } = useSettings();
  const { loading, requestPageAssets, zoom, setZoom, saveAlto } = useEditor();
  const { pageDimensions } = useAlto();

  const alignCenter = useCallback(() => {
    const availableWidth = window.innerWidth - 70 * 2;
    const availableHeight = window.innerHeight - 56 * 2;

    const contentWidth = settings.show.textNext
      ? pageDimensions.width * 2
      : pageDimensions.width;
    const contentHeight = pageDimensions.height || 0;

    const scaleWidth = availableWidth / contentWidth;
    const scaleHeight = availableHeight / contentHeight;

    const ratio = Math.min(scaleWidth, scaleHeight);
    const newZoom =
      ratio < 1 ? Math.floor(ratio * 100) / 100 : Math.ceil(ratio * 100) / 100;

    const xCenter = (2 * pageDimensions.width + 40) / 2 - window.innerWidth / 2;
    window.scrollTo({
      left: settings.show.textNext
        ? xCenter + (pageDimensions.width * newZoom) / 2
        : xCenter,
      top: 0,
    });
    setZoom(newZoom);
  }, [
    pageDimensions.height,
    pageDimensions.width,
    setZoom,
    settings.show.textNext,
  ]);

  const onSave = useCallback(() => {
    if (altoFileName && index) {
      logger.info('Editor', `Saving ALTO file: ${altoFileName} with index ${index}`);
      saveAlto(altoFileName, parseInt(index, 10));
    }
  }, [altoFileName, index, saveAlto]);

  useEffect(() => {
    if (!loading) alignCenter();
  }, [alignCenter, loading]);

  useEffect(() => {
    if (imageFileName && altoFileName) {
      logger.info('Editor', `Loading page assets: ${imageFileName}, ${altoFileName}`);
      requestPageAssets(imageFileName, altoFileName);
    }
  }, [imageFileName, altoFileName, requestPageAssets]);

  return (
    <>
      <ErrorBoundary componentName="EditorStatusBar">
        <Box 
          style={{
            position: 'fixed',
            top: 70,
            right: 20,
            zIndex: 1000,
            width: 300,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 10,
          }}
        >
          <AltoVersionBadge />
          <ValidationWarning />
        </Box>
      </ErrorBoundary>

      {loading ? (
        <Center w="100vw" h="90vh">
          <Loader />
        </Center>
      ) : (
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
            margin: 56,
            transform: `scale(${zoom})`,
            transformOrigin: 'center top',
          }}
        >
          <ErrorBoundary componentName="Viewer">
            <Viewer />
          </ErrorBoundary>
          </div>
        </div>
      )}

      <ErrorBoundary componentName="EditorOverlay">
        <EditorOverlay
          alignCenter={alignCenter}
          pageNumber={parseInt(index || '0', 10)}
          onSave={onSave}
        />
      </ErrorBoundary>
    </>
  );
};

export default Editor;
