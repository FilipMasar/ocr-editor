import { FC } from 'react';
import { useAlto } from '../../context/app/AltoContext';
import { getStringsFromTextLine, convertToPixels } from '../../utils/alto';
import { withErrorBoundary } from '../../utils/withErrorBoundary';
import { AltoTextLineJson } from '../../types/alto';


interface TextLineNextToProps {
  element: AltoTextLineJson;
}

const TextLineNextTo: FC<TextLineNextToProps> = ({ element }) => {
  const { measurementUnit } = useAlto();

  // Convert coordinates using the current measurement unit
  const top = convertToPixels(element['@_VPOS'], measurementUnit);
  const height = convertToPixels(element['@_HEIGHT'], measurementUnit);

  const strings = getStringsFromTextLine(element);

  return (
    <>
      {strings.map((string) => {
        const stringLeft = convertToPixels(string['@_HPOS'], measurementUnit);
        
        return (
          <span key={string['@_CUSTOM_ID']} style={{fontSize: height * 0.8, position: 'absolute', top, left: stringLeft}}>
            {string['@_CONTENT']}
          </span>
        )
      })}
    </>
  )
};

export default withErrorBoundary(TextLineNextTo, 'TextLineNextTo');
