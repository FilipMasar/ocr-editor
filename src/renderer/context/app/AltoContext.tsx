import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { PageDimensions } from '../../types/app';
import { 
  getFirstPage, 
  getMeasurementUnit, 
  convertToPixels,
  MeasurementUnit, 
  getAllIllustrations,
  getAllGraphicalElements,
  getAllTextBlocks,
  getAllComposedBlocks,
  getAllTextLines,
  getAllStrings,
  getAllMargins,
  getAllHyphens,
  getAllSpaces,
} from '../../utils/alto';
import { 
  AltoJson, 
  AltoTextBlockJson, 
  AltoTextLineJson, 
  AltoGraphicalElementJson, 
  AltoIllustrationJson,
  AltoComposedBlockJson,
  AltoPrintSpaceJson,
  AltoStringJson,
  AltoPageJson,
  AltoMarginJson,
  AltoHyphenJson,
  AltoSpaceJson,
} from '../../types/alto';
import { ValidationStatus } from '../../../shared/ipc/editor-channel';


/**
 * Alto context for managing ALTO document state and operations
 */
interface AltoProviderValue {
  alto: AltoJson;
  setAlto: Dispatch<SetStateAction<AltoJson>>;
  pageDimensions: PageDimensions;
  page: AltoPageJson | undefined;
  margins: AltoMarginJson[];
  printSpace: AltoPrintSpaceJson | undefined;
  illustrations: AltoIllustrationJson[];
  graphicalElements: AltoGraphicalElementJson[];
  textBlocks: AltoTextBlockJson[];
  composedBlocks: AltoComposedBlockJson[];
  textLines: AltoTextLineJson[];
  textStrings: AltoStringJson[];
  hyphens: AltoHyphenJson[];
  spaces: AltoSpaceJson[];
  altoVersion?: string;
  setAltoVersion: Dispatch<SetStateAction<string | undefined>>;
  validationStatus?: ValidationStatus;
  setValidationStatus: Dispatch<SetStateAction<ValidationStatus | undefined>>;
  measurementUnit: MeasurementUnit;
}

// Context
const AltoContext = createContext({} as AltoProviderValue);

/**
 * Hook to access the ALTO context
 */
export const useAlto = () => useContext(AltoContext);

/**
 * Provider component for the ALTO context
 */
const AltoProvider: FC<PropsWithChildren> = ({ children }) => {
  const [alto, setAlto] = useState<AltoJson>();
  const [pageDimensions, setPageDimensions] = useState<PageDimensions>({
    width: 0,
    height: null,
  });
  const [altoVersion, setAltoVersion] = useState<string | undefined>();
  const [validationStatus, setValidationStatus] = useState<ValidationStatus | undefined>();
  const [measurementUnit, setMeasurementUnit] = useState<MeasurementUnit>('pixel');

  // Elements
  const [page, setPage] = useState<AltoPageJson | undefined>();
  const [margins, setMargins] = useState<AltoMarginJson[]>([]);
  const [printSpace, setPrintSpace] = useState<AltoPrintSpaceJson | undefined>();
  const [illustrations, setIllustrations] = useState<AltoIllustrationJson[]>([]);
  const [graphicalElements, setGraphicalElements] = useState<AltoGraphicalElementJson[]>([]);
  const [textBlocks, setTextBlocks] = useState<AltoTextBlockJson[]>([]);
  const [composedBlocks, setComposedBlocks] = useState<AltoComposedBlockJson[]>([]);
  const [textLines, setTextLines] = useState<AltoTextLineJson[]>([]);
  const [textStrings, setTextStrings] = useState<AltoStringJson[]>([]);
  const [hyphens, setHyphens] = useState<AltoHyphenJson[]>([]);
  const [spaces, setSpaces] = useState<AltoSpaceJson[]>([]);

  // Process ALTO document when it changes
  useEffect(() => {
    if (!alto || Object.keys(alto).length === 0) {
      setPrintSpace(undefined);
      setIllustrations([]);
      setGraphicalElements([]);
      setTextBlocks([]);
      setComposedBlocks([]);
      return;
    }

    try {
      // Determine measurement unit from the document
      const unit = getMeasurementUnit(alto);
      setMeasurementUnit(unit);

      const firstPage = getFirstPage(alto);
      if (!firstPage) return;

      setPage(firstPage);

      // Extract dimensions with fallback logic
      // Try to get dimensions from Page element first
      let width = convertToPixels(firstPage['@_WIDTH'], unit);
      let height = convertToPixels(firstPage['@_HEIGHT'], unit);
      
      // If page dimensions are missing, try to get from PrintSpace
      if ((width === 0 || height === 0) && firstPage.PrintSpace) {
        width = convertToPixels(firstPage.PrintSpace['@_WIDTH'], unit);
        height = convertToPixels(firstPage.PrintSpace['@_HEIGHT'], unit);
      }
      
      // Only set dimensions if we have valid values
      if (width > 0 && height > 0) {
        setPageDimensions({ width, height });
      }

      setPrintSpace(firstPage.PrintSpace);
      setMargins(getAllMargins(alto));
      setIllustrations(getAllIllustrations(alto));
      setGraphicalElements(getAllGraphicalElements(alto));
      setTextBlocks(getAllTextBlocks(alto));
      setComposedBlocks(getAllComposedBlocks(alto));
      setTextLines(getAllTextLines(alto));
      setTextStrings(getAllStrings(alto));
      setHyphens(getAllHyphens(alto));
      setSpaces(getAllSpaces(alto));
    } catch (error) {
      console.error('Error processing ALTO document:', error);
    }
  }, [alto]);

  return (
    <AltoContext.Provider
      value={{
        alto,
        setAlto,
        pageDimensions,
        page,
        margins,
        printSpace,
        illustrations,
        graphicalElements,
        textBlocks,
        composedBlocks,
        textLines,
        textStrings,
        hyphens,
        spaces,
        altoVersion,
        setAltoVersion,
        validationStatus,
        setValidationStatus,
        measurementUnit,
      }}
    >
      {children}
    </AltoContext.Provider>
  );
};

export default AltoProvider; 