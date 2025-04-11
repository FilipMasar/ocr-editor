import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { PageDimensions, TextStyle } from '../../types/app';
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
  getAllSpaces
} from '../../utils/alto';
import { 
  AltoJson, 
  AltoTextBlockJson, 
  AltoTextLineJson, 
  AltoGraphicalElementJson, 
  AltoIllustrationJson,
  AltoComposedBlockJson,
  AltoPrintSpaceJson,
  AltoTextStyleJson,
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
  updateGraphicalElement: (graphicalElement: AltoGraphicalElementJson, index: number) => void;
  updateIllustration: (illustration: AltoIllustrationJson, index: number) => void;
  updateTextBlock: (textBlock: AltoTextBlockJson, index: number) => void;
  updateComposedBlock: (composedBlock: AltoComposedBlockJson, index: number) => void;
  updateTextLine: (
    textLine: AltoTextLineJson,
    textBlockIndex: number,
    textLineIndex: number
  ) => void;
  updateComposedBlockTextLine: (
    textLine: AltoTextLineJson,
    composedBlockIndex: number, 
    nestedTextBlockIndex: number,
    textLineIndex: number
  ) => void;
  updateString: (
    textBlockIndex: number,
    textLineIndex: number,
    textStringIndex: number,
    value: string
  ) => void;
  updateComposedBlockString: (
    composedBlockIndex: number,
    nestedTextBlockIndex: number,
    textLineIndex: number,
    textStringIndex: number, 
    value: string
  ) => void;
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
    console.log('ALTO_CONTEXT', alto);
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
      
      // TODO remove
      // Last resort: If dimensions are still missing, try to calculate from TextBlocks
      // if ((width === 0 || height === 0) && page.PrintSpace?.TextBlock) {
      //   const blocks = Array.isArray(page.PrintSpace.TextBlock) 
      //     ? page.PrintSpace.TextBlock 
      //     : [page.PrintSpace.TextBlock];
        
      //   let maxRight = 0;
      //   let maxBottom = 0;
        
      //   blocks.forEach(block => {
      //     const blockRight = convertToPixels(block['@_HPOS'], unit) + convertToPixels(block['@_WIDTH'], unit);
      //     const blockBottom = convertToPixels(block['@_VPOS'], unit) + convertToPixels(block['@_HEIGHT'], unit);
          
      //     maxRight = Math.max(maxRight, blockRight);
      //     maxBottom = Math.max(maxBottom, blockBottom);
      //   });
        
      //   width = maxRight > 0 ? maxRight + 50 : width;
      //   height = maxBottom > 0 ? maxBottom + 50 : height;
      // }
      
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

  // Method implementations
  const updateGraphicalElement = useCallback(
    (graphicalElement: AltoGraphicalElementJson, index: number) => {
      setAlto((prevAlto) => {
        const updatedAlto = { ...prevAlto };
        const page = getFirstPage(updatedAlto);
        if (!page || !page.PrintSpace) return updatedAlto;

        // Create or ensure array of graphical elements
        if (!page.PrintSpace.GraphicalElement) {
          page.PrintSpace.GraphicalElement = [];
        } else if (!Array.isArray(page.PrintSpace.GraphicalElement)) {
          page.PrintSpace.GraphicalElement = [page.PrintSpace.GraphicalElement];
        }

        // Update the graphical element at the specified index
        page.PrintSpace.GraphicalElement[index] = graphicalElement;
        return updatedAlto;
      });
    },
    []
  );

  const updateIllustration = useCallback(
    (illustration: AltoIllustrationJson, index: number) => {
      setAlto((prevAlto) => {
        const updatedAlto = { ...prevAlto };
        const page = getFirstPage(updatedAlto);
        if (!page || !page.PrintSpace) return updatedAlto;

        // Create or ensure array of illustrations
        if (!page.PrintSpace.Illustration) {
          page.PrintSpace.Illustration = [];
        } else if (!Array.isArray(page.PrintSpace.Illustration)) {
          page.PrintSpace.Illustration = [page.PrintSpace.Illustration];
        }

        // Update the illustration at the specified index
        page.PrintSpace.Illustration[index] = illustration;
        return updatedAlto;
      });
    },
    []
  );

  const updateTextBlock = useCallback(
    (textBlock: AltoTextBlockJson, index: number) => {
      setAlto((prevAlto) => {
        const updatedAlto = { ...prevAlto };
        const page = getFirstPage(updatedAlto);
        if (!page || !page.PrintSpace) return updatedAlto;

        // Create or ensure array of text blocks
        if (!page.PrintSpace.TextBlock) {
          page.PrintSpace.TextBlock = [];
        } else if (!Array.isArray(page.PrintSpace.TextBlock)) {
          page.PrintSpace.TextBlock = [page.PrintSpace.TextBlock];
        }

        // Update the text block at the specified index
        page.PrintSpace.TextBlock[index] = textBlock;
        return updatedAlto;
      });
    },
    []
  );

  const updateComposedBlock = useCallback(
    (composedBlock: AltoComposedBlockJson, index: number) => {
      setAlto((prevAlto) => {
        const updatedAlto = { ...prevAlto };
        const page = getFirstPage(updatedAlto);
        if (!page || !page.PrintSpace) return updatedAlto;

        // Create or ensure array of composed blocks
        if (!page.PrintSpace.ComposedBlock) {
          page.PrintSpace.ComposedBlock = [];
        } else if (!Array.isArray(page.PrintSpace.ComposedBlock)) {
          page.PrintSpace.ComposedBlock = [page.PrintSpace.ComposedBlock];
        }

        // Update the composed block at the specified index
        page.PrintSpace.ComposedBlock[index] = composedBlock;
        return updatedAlto;
      });
    },
    []
  );

  const updateTextLine = useCallback(
    (textLine: AltoTextLineJson, textBlockIndex: number, textLineIndex: number) => {
      setAlto((prevAlto) => {
        const updatedAlto = { ...prevAlto };
        const page = getFirstPage(updatedAlto);
        if (!page || !page.PrintSpace || !page.PrintSpace.TextBlock) return updatedAlto;

        // Get the text blocks array
        const textBlocks = Array.isArray(page.PrintSpace.TextBlock)
          ? page.PrintSpace.TextBlock
          : [page.PrintSpace.TextBlock];

        // Get the target text block
        const targetBlock = textBlocks[textBlockIndex];
        if (!targetBlock) return updatedAlto;

        // Create or ensure array of text lines
        if (!targetBlock.TextLine) {
          targetBlock.TextLine = [];
        } else if (!Array.isArray(targetBlock.TextLine)) {
          targetBlock.TextLine = [targetBlock.TextLine];
        }

        // Update the text line at the specified index
        targetBlock.TextLine[textLineIndex] = textLine;
        return updatedAlto;
      });
    },
    []
  );

  const updateComposedBlockTextLine = useCallback(
    (
      textLine: AltoTextLineJson,
      composedBlockIndex: number,
      nestedTextBlockIndex: number,
      textLineIndex: number
    ) => {
      setAlto((prevAlto) => {
        // Create a deep copy to prevent mutation
        const updatedAlto = JSON.parse(JSON.stringify(prevAlto));
        const page = getFirstPage(updatedAlto);
        if (!page || !page.PrintSpace) return prevAlto;
        
        // Get composed blocks array
        if (!page.PrintSpace.ComposedBlock) return prevAlto;
        
        const composedBlocks = Array.isArray(page.PrintSpace.ComposedBlock)
          ? page.PrintSpace.ComposedBlock
          : [page.PrintSpace.ComposedBlock];
          
        if (composedBlockIndex >= composedBlocks.length) return prevAlto;
        
        // Get the target composed block
        const composedBlock = composedBlocks[composedBlockIndex];
        
        // Get text blocks
        if (!composedBlock.TextBlock) return prevAlto;
        
        const textBlocks = Array.isArray(composedBlock.TextBlock)
          ? composedBlock.TextBlock
          : [composedBlock.TextBlock];
          
        if (nestedTextBlockIndex >= textBlocks.length) return prevAlto;
        
        // Get the target text block
        const textBlock = textBlocks[nestedTextBlockIndex];
        
        // Update the text line
        if (!textBlock.TextLine) {
          textBlock.TextLine = textLine;
        } else if (Array.isArray(textBlock.TextLine)) {
          textBlock.TextLine[textLineIndex] = textLine;
        } else if (textLineIndex === 0) {
          textBlock.TextLine = textLine;
        } else {
          const lineArray = [textBlock.TextLine];
          lineArray[textLineIndex] = textLine;
          textBlock.TextLine = lineArray;
        }
        
        // Update the text block in the composed block
        if (Array.isArray(composedBlock.TextBlock)) {
          composedBlock.TextBlock[nestedTextBlockIndex] = textBlock;
        } else {
          composedBlock.TextBlock = textBlock;
        }
        
        // Update the composed block in the page
        if (Array.isArray(page.PrintSpace.ComposedBlock)) {
          page.PrintSpace.ComposedBlock[composedBlockIndex] = composedBlock;
        } else {
          page.PrintSpace.ComposedBlock = composedBlock;
        }
        
        return updatedAlto;
      });
    },
    []
  );

  const updateString = useCallback(
    (
      textBlockIndex: number,
      textLineIndex: number,
      textStringIndex: number,
      value: string
    ) => {
      setAlto((prevAlto) => {
        const updatedAlto = { ...prevAlto };
        const page = getFirstPage(updatedAlto);
        if (!page || !page.PrintSpace || !page.PrintSpace.TextBlock) return updatedAlto;

        // Get the text blocks array
        const textBlocks = Array.isArray(page.PrintSpace.TextBlock)
          ? page.PrintSpace.TextBlock
          : [page.PrintSpace.TextBlock];

        // Get the target text block
        const targetBlock = textBlocks[textBlockIndex];
        if (!targetBlock) return updatedAlto;

        // Get the text lines array
        const textLines = Array.isArray(targetBlock.TextLine)
          ? targetBlock.TextLine
          : targetBlock.TextLine
          ? [targetBlock.TextLine]
          : [];

        // Get the target text line
        const targetLine = textLines[textLineIndex];
        if (!targetLine) return updatedAlto;

        // Get the text strings array
        const textStrings = Array.isArray(targetLine.String)
          ? targetLine.String
          : targetLine.String
          ? [targetLine.String]
          : [];

        // Get the target string
        const targetString = textStrings[textStringIndex];
        if (!targetString) return updatedAlto;

        // Update the string content
        targetString['@_CONTENT'] = value;
        return updatedAlto;
      });
    },
    []
  );

  const updateComposedBlockString = useCallback(
    (
      composedBlockIndex: number,
      nestedTextBlockIndex: number,
      textLineIndex: number,
      textStringIndex: number,
      value: string
    ) => {
      setAlto((prevAlto) => {
        // Create a deep copy to prevent mutation
        const updatedAlto = JSON.parse(JSON.stringify(prevAlto));
        const page = getFirstPage(updatedAlto);
        if (!page || !page.PrintSpace) return prevAlto;
        
        // Get composed blocks array
        if (!page.PrintSpace.ComposedBlock) return prevAlto;
        
        const composedBlocks = Array.isArray(page.PrintSpace.ComposedBlock)
          ? page.PrintSpace.ComposedBlock
          : [page.PrintSpace.ComposedBlock];
          
        if (composedBlockIndex >= composedBlocks.length) return prevAlto;
        
        // Get the target composed block
        const composedBlock = composedBlocks[composedBlockIndex];
        
        // Get text blocks
        if (!composedBlock.TextBlock) return prevAlto;
        
        const textBlocks = Array.isArray(composedBlock.TextBlock)
          ? composedBlock.TextBlock
          : [composedBlock.TextBlock];
          
        if (nestedTextBlockIndex >= textBlocks.length) return prevAlto;
        
        // Get the target text block
        const textBlock = textBlocks[nestedTextBlockIndex];
        
        // Get text lines
        if (!textBlock.TextLine) return prevAlto;
        
        const textLines = Array.isArray(textBlock.TextLine)
          ? textBlock.TextLine
          : [textBlock.TextLine];
          
        if (textLineIndex >= textLines.length) return prevAlto;
        
        // Get the target text line
        const textLine = textLines[textLineIndex];
        
        // Get strings
        if (!textLine.String) return prevAlto;
        
        const strings = Array.isArray(textLine.String)
          ? textLine.String
          : [textLine.String];
          
        if (textStringIndex >= strings.length) return prevAlto;
        
        // Get the target string
        const targetString = strings[textStringIndex];
        
        // Update the string content
        targetString['@_CONTENT'] = value;
        
        // Update the text line
        if (Array.isArray(textLine.String)) {
          textLine.String[textStringIndex] = targetString;
        } else {
          textLine.String = targetString;
        }
        
        // Update the text block
        if (Array.isArray(textBlock.TextLine)) {
          textBlock.TextLine[textLineIndex] = textLine;
        } else {
          textBlock.TextLine = textLine;
        }
        
        // Update the composed block
        if (Array.isArray(composedBlock.TextBlock)) {
          composedBlock.TextBlock[nestedTextBlockIndex] = textBlock;
        } else {
          composedBlock.TextBlock = textBlock;
        }
        
        // Update the page
        if (Array.isArray(page.PrintSpace.ComposedBlock)) {
          page.PrintSpace.ComposedBlock[composedBlockIndex] = composedBlock;
        } else {
          page.PrintSpace.ComposedBlock = composedBlock;
        }
        
        return updatedAlto;
      });
    },
    []
  );

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
        updateGraphicalElement,
        updateIllustration,
        updateTextBlock,
        updateComposedBlock,
        updateTextLine,
        updateComposedBlockTextLine,
        updateString,
        updateComposedBlockString,
      }}
    >
      {children}
    </AltoContext.Provider>
  );
};

export default AltoProvider; 