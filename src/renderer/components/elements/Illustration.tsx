import { FC } from 'react';
import { useAlto } from '../../context/AltoContext';
// import { useAltoEditorContext } from '../../context/altoEditorContext';
import { toNumber } from '../../utils/alto';

interface IllustrationProps {
  element: any;
  metadata: any;
}

const Illustration: FC<IllustrationProps> = ({ element, metadata }) => {
  // const { updateIllustration } = useAlto();
  // const { openAltoEditor } = useAltoEditorContext();

  const top = toNumber(element['@_VPOS']);
  const left = toNumber(element['@_HPOS']);
  const width = toNumber(element['@_WIDTH']);
  const height = toNumber(element['@_HEIGHT']);

  // const handleClick = () => {
  //   openAltoEditor(
  //     element,
  //     () => (updated: any) => updateIllustration(updated, metadata.index)
  //   );
  // };

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        width,
        height,
        border: '1px solid pink',
      }}
      // className="border border-pink-500 hover:bg-pink-500 hover:opacity-10"
      // onClick={handleClick}
    />
  );
};

export default Illustration;
