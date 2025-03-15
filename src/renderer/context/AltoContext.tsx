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
import { PageDimensions, TextStyle } from '../types/app';
import { addMetadata, toNumber, getFirstPage } from '../utils/alto';
import { updateComposedBlockInAlto } from '../utils/composedBlockUtils';
import { 
  AltoJson, 
  AltoTextBlockJson, 
  AltoTextLineJson, 
  AltoStringJson, 
  AltoGraphicalElementJson, 
  AltoIllustrationJson,
  AltoComposedBlockJson,
  AltoPrintSpaceJson,
  AltoPageJson
} from '../types/alto';

interface AltoElement<T> {
  element: T;
  metadata: {
    index: number;
    [key: string]: any;
  };
}

interface AltoProviderValue {
  alto: AltoJson;
  setAlto: Dispatch<SetStateAction<AltoJson>>;
  styles: Record<string, TextStyle>;
  setStyles: Dispatch<SetStateAction<Record<string, TextStyle>>>;
  pageDimensions: PageDimensions;
  printSpace: AltoPrintSpaceJson | undefined;
  illustrations: AltoElement<AltoIllustrationJson>[];
  graphicalElements: AltoElement<AltoGraphicalElementJson>[];
  textBlocks: AltoElement<AltoTextBlockJson>[];
  composedBlocks: AltoElement<AltoComposedBlockJson>[];
  altoVersion?: string;
  setAltoVersion: Dispatch<SetStateAction<string | undefined>>;
  validationStatus?: { valid: boolean; errors?: string };
  setValidationStatus: Dispatch<SetStateAction<{ valid: boolean; errors?: string } | undefined>>;
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

// useContext
export const useAlto = () => useContext(AltoContext);

// Provider
const AltoProvider: FC<PropsWithChildren> = ({ children }) => {
  const [alto, setAlto] = useState<AltoJson | undefined>();
  const [pageDimensions, setPageDimensions] = useState<PageDimensions>({
    width: 0,
    height: 0,
  });
  const [styles, setStyles] = useState<Record<string, TextStyle>>({});
  const [printSpace, setPrintSpace] = useState<AltoPrintSpaceJson | undefined>();
  const [illustrations, setIllustrations] = useState<AltoElement<AltoIllustrationJson>[]>([]);
  const [graphicalElements, setGraphicalElements] = useState<AltoElement<AltoGraphicalElementJson>[]>([]);
  const [textBlocks, setTextBlocks] = useState<AltoElement<AltoTextBlockJson>[]>([]);
  const [composedBlocks, setComposedBlocks] = useState<AltoElement<AltoComposedBlockJson>[]>([]);
  const [altoVersion, setAltoVersion] = useState<string | undefined>();
  const [validationStatus, setValidationStatus] = useState<{ valid: boolean; errors?: string } | undefined>();

  /*
   * Parse styles from Alto file
   */
  useEffect(() => {
    const stylesObj = alto?.alto?.Styles;
    if (stylesObj?.TextStyle) {
      if (Array.isArray(stylesObj.TextStyle)) {
        for (const style of stylesObj.TextStyle) {
          setStyles((old) => ({
            ...old,
            [style['@_ID']]: {
              fontSize: toNumber(style['@_FONTSIZE']),
              fontFamily: style['@_FONTFAMILY'],
            },
          }));
        }
      } else {
        setStyles({
          [stylesObj.TextStyle['@_ID']]: {
            fontSize: toNumber(stylesObj.TextStyle['@_FONTSIZE']),
            fontFamily: stylesObj.TextStyle['@_FONTFAMILY'],
          },
        });
      }
    }
  }, [alto]);

  useEffect(() => {
    if (!alto?.alto?.Layout?.Page) {
      setPrintSpace(undefined);
      setPageDimensions({ width: 0, height: 0 });
      return;
    }

    const page = getFirstPage(alto);
    if (!page) {
      setPrintSpace(undefined);
      setPageDimensions({ width: 0, height: 0 });
      return;
    }

    // Check for dimensions in both Page and PrintSpace elements
    let width = toNumber(page['@_WIDTH']);
    let height = toNumber(page['@_HEIGHT']);
    
    // If Page dimensions are missing, try to get them from PrintSpace
    if ((!width || !height) && page.PrintSpace) {
      width = width || toNumber(page.PrintSpace['@_WIDTH']);
      height = height || toNumber(page.PrintSpace['@_HEIGHT']);
    }
    
    // Set dimensions with values from either Page or PrintSpace
    setPageDimensions({
      width,
      height,
    });

    setPrintSpace(page.PrintSpace);

    if (page.PrintSpace?.TextBlock) {
      if (Array.isArray(page.PrintSpace.TextBlock)) {
        setTextBlocks(
          page.PrintSpace.TextBlock.map((textBlock, index) => ({
            element: textBlock,
            metadata: { index },
          }))
        );
      } else {
        setTextBlocks([
          {
            element: page.PrintSpace.TextBlock,
            metadata: { index: -1 },
          },
        ]);
      }
    } else {
      setTextBlocks([]);
    }

    if (page.PrintSpace?.Illustration) {
      if (Array.isArray(page.PrintSpace.Illustration)) {
        setIllustrations(
          page.PrintSpace.Illustration.map((illustration, index) => ({
            element: illustration,
            metadata: { index },
          }))
        );
      } else {
        setIllustrations([
          {
            element: page.PrintSpace.Illustration,
            metadata: { index: -1 },
          },
        ]);
      }
    } else {
      setIllustrations([]);
    }

    if (page.PrintSpace?.GraphicalElement) {
      if (Array.isArray(page.PrintSpace.GraphicalElement)) {
        setGraphicalElements(
          page.PrintSpace.GraphicalElement.map((graphicalElement, index) => ({
            element: graphicalElement,
            metadata: { index },
          }))
        );
      } else {
        setGraphicalElements([
          {
            element: page.PrintSpace.GraphicalElement,
            metadata: { index: -1 },
          },
        ]);
      }
    } else {
      setGraphicalElements([]);
    }

    if (page.PrintSpace?.ComposedBlock) {
      if (Array.isArray(page.PrintSpace.ComposedBlock)) {
        setComposedBlocks(
          page.PrintSpace.ComposedBlock.map((composedBlock, index) => ({
            element: composedBlock,
            metadata: { index },
          }))
        );
      } else {
        setComposedBlocks([
          {
            element: page.PrintSpace.ComposedBlock,
            metadata: { index: -1 },
          },
        ]);
      }
    } else {
      setComposedBlocks([]);
    }
  }, [alto]);

  const updateGraphicalElement = useCallback(
    (graphicalElement: AltoGraphicalElementJson, index: number) => {
      setAlto((old) => {
        if (!old) return old;
        
        // Create a deep copy to avoid mutations
        const newAlto = JSON.parse(JSON.stringify(old));
        const page = getFirstPage(newAlto);
        if (!page || !page.PrintSpace) return old;
        
        if (index === -1) {
          page.PrintSpace.GraphicalElement = graphicalElement;
        } else {
          const elements = Array.isArray(page.PrintSpace.GraphicalElement) 
            ? [...page.PrintSpace.GraphicalElement] 
            : [page.PrintSpace.GraphicalElement];
          
          elements[index] = graphicalElement;
          page.PrintSpace.GraphicalElement = elements.length === 1 ? elements[0] : elements;
        }
        
        return newAlto;
      });
    },
    []
  );

  const updateIllustration = useCallback((illustration: AltoIllustrationJson, index: number) => {
    setAlto((old) => {
      if (!old) return old;
      
      // Create a deep copy to avoid mutations
      const newAlto = JSON.parse(JSON.stringify(old));
      const page = getFirstPage(newAlto);
      if (!page || !page.PrintSpace) return old;
      
      if (index === -1) {
        page.PrintSpace.Illustration = illustration;
      } else {
        const illustrations = Array.isArray(page.PrintSpace.Illustration) 
          ? [...page.PrintSpace.Illustration] 
          : [page.PrintSpace.Illustration];
        
        illustrations[index] = illustration;
        page.PrintSpace.Illustration = illustrations.length === 1 ? illustrations[0] : illustrations;
      }
      
      return newAlto;
    });
  }, []);

  const updateTextBlock = useCallback((textBlock: AltoTextBlockJson, index: number) => {
    setAlto((old) => {
      if (!old) return old;
      
      // Create a deep copy to avoid mutations
      const newAlto = JSON.parse(JSON.stringify(old));
      const page = getFirstPage(newAlto);
      if (!page || !page.PrintSpace) return old;
      
      if (index === -1) {
        page.PrintSpace.TextBlock = textBlock;
      } else {
        const blocks = Array.isArray(page.PrintSpace.TextBlock) 
          ? [...page.PrintSpace.TextBlock] 
          : [page.PrintSpace.TextBlock];
        
        blocks[index] = textBlock;
        page.PrintSpace.TextBlock = blocks.length === 1 ? blocks[0] : blocks;
      }
      
      return newAlto;
    });
  }, []);

  const updateComposedBlock = useCallback((composedBlock: AltoComposedBlockJson, index: number) => {
    setAlto((old) => {
      if (!old) return old;
      
      // Create a deep copy to avoid mutations
      const newAlto = JSON.parse(JSON.stringify(old));
      const page = getFirstPage(newAlto);
      if (!page || !page.PrintSpace) return old;
      
      if (index === -1) {
        page.PrintSpace.ComposedBlock = composedBlock;
      } else {
        const blocks = Array.isArray(page.PrintSpace.ComposedBlock) 
          ? [...page.PrintSpace.ComposedBlock] 
          : page.PrintSpace.ComposedBlock ? [page.PrintSpace.ComposedBlock] : [];
        
        if (index >= blocks.length) {
          blocks.push(composedBlock);
        } else {
          blocks[index] = composedBlock;
        }
        
        page.PrintSpace.ComposedBlock = blocks.length === 1 ? blocks[0] : blocks;
      }
      
      return newAlto;
    });
  }, []);

  const updateTextLine = useCallback(
    (textLine: AltoTextLineJson, textBlockIndex: number, textLineIndex: number) => {
      if (!printSpace) return;
      
      const newTextBlock = JSON.parse(JSON.stringify(
        textBlockIndex === -1
          ? printSpace.TextBlock
          : Array.isArray(printSpace.TextBlock)
            ? printSpace.TextBlock[textBlockIndex]
            : printSpace.TextBlock
      ));
      
      if (!newTextBlock) return;
      
      if (textLineIndex === -1) {
        newTextBlock.TextLine = textLine;
      } else {
        if (!Array.isArray(newTextBlock.TextLine)) {
          newTextBlock.TextLine = [newTextBlock.TextLine];
        }
        newTextBlock.TextLine[textLineIndex] = textLine;
        if (newTextBlock.TextLine.length === 1) {
          newTextBlock.TextLine = newTextBlock.TextLine[0];
        }
      }
      
      updateTextBlock(newTextBlock, textBlockIndex);
    },
    [printSpace, updateTextBlock]
  );

  const updateString = useCallback(
    (
      textBlockIndex: number,
      textLineIndex: number,
      textStringIndex: number,
      value: string
    ) => {
      if (!printSpace) return;
      
      const newTextBlock = JSON.parse(JSON.stringify(
        textBlockIndex === -1
          ? printSpace.TextBlock
          : Array.isArray(printSpace.TextBlock)
            ? printSpace.TextBlock[textBlockIndex]
            : printSpace.TextBlock
      ));
      
      if (!newTextBlock) return;
      
      if (textLineIndex === -1) {
        if (!newTextBlock.TextLine || !newTextBlock.TextLine.String) return;
        
        if (textStringIndex === -1) {
          if (Array.isArray(newTextBlock.TextLine.String)) {
            newTextBlock.TextLine.String.forEach((s: AltoStringJson) => {
              s['@_CONTENT'] = value;
            });
          } else {
            newTextBlock.TextLine.String['@_CONTENT'] = value;
          }
        } else {
          if (Array.isArray(newTextBlock.TextLine.String)) {
            newTextBlock.TextLine.String[textStringIndex]['@_CONTENT'] = value;
          }
        }
      } else {
        if (!newTextBlock.TextLine) return;
        
        const textLine = Array.isArray(newTextBlock.TextLine)
          ? newTextBlock.TextLine[textLineIndex]
          : textLineIndex === 0 ? newTextBlock.TextLine : undefined;
          
        if (!textLine || !textLine.String) return;
        
        if (textStringIndex === -1) {
          if (Array.isArray(textLine.String)) {
            textLine.String.forEach((s: AltoStringJson) => {
              s['@_CONTENT'] = value;
            });
          } else {
            textLine.String['@_CONTENT'] = value;
          }
        } else {
          if (Array.isArray(textLine.String)) {
            textLine.String[textStringIndex]['@_CONTENT'] = value;
          }
        }
      }
      
      updateTextBlock(newTextBlock, textBlockIndex);
    },
    [printSpace, updateTextBlock]
  );

  const updateComposedBlockTextLine = useCallback(
    (
      textLine: AltoTextLineJson, 
      composedBlockIndex: number, 
      nestedTextBlockIndex: number,
      textLineIndex: number
    ) => {
      if (!alto || !composedBlocks || composedBlocks.length === 0) return;
      
      const composedBlock = composedBlocks[composedBlockIndex];
      if (!composedBlock) return;
      
      // Deep clone the composedBlock
      const updatedComposedBlock = JSON.parse(JSON.stringify(composedBlock.element)) as AltoComposedBlockJson;
      
      // Find the nested TextBlock 
      let textBlocks = updatedComposedBlock.TextBlock;
      if (!textBlocks) return;
      
      // Ensure it's an array
      if (!Array.isArray(textBlocks)) {
        textBlocks = [textBlocks];
      }
      
      if (nestedTextBlockIndex >= textBlocks.length) return;
      
      const textBlock = textBlocks[nestedTextBlockIndex];
      if (!textBlock) return;
      
      // Update the TextLine
      if (textLineIndex === -1) {
        textBlock.TextLine = textLine;
      } else {
        if (!Array.isArray(textBlock.TextLine)) {
          textBlock.TextLine = [textBlock.TextLine];
        }
        
        if (textLineIndex >= textBlock.TextLine.length) return;
        textBlock.TextLine[textLineIndex] = textLine;
      }
      
      // Update the TextBlock in the array if it was converted
      if (Array.isArray(textBlocks)) {
        textBlocks[nestedTextBlockIndex] = textBlock;
        updatedComposedBlock.TextBlock = textBlocks.length === 1 ? textBlocks[0] : textBlocks;
      }
      
      // Update the composedBlock
      updateComposedBlock(updatedComposedBlock, composedBlockIndex);
    },
    [alto, composedBlocks, updateComposedBlock]
  );
  
  const updateComposedBlockString = useCallback(
    (
      composedBlockIndex: number,
      nestedTextBlockIndex: number,
      textLineIndex: number,
      textStringIndex: number,
      value: string
    ) => {
      if (!alto || !composedBlocks || composedBlocks.length === 0) return;
      
      const composedBlock = composedBlocks[composedBlockIndex];
      if (!composedBlock) return;
      
      // Deep clone the composedBlock
      const updatedComposedBlock = JSON.parse(JSON.stringify(composedBlock.element)) as AltoComposedBlockJson;
      
      // Find the nested TextBlock
      let textBlocks = updatedComposedBlock.TextBlock;
      if (!textBlocks) return;
      
      // Ensure it's an array
      if (!Array.isArray(textBlocks)) {
        textBlocks = [textBlocks];
      }
      
      if (nestedTextBlockIndex >= textBlocks.length) return;
      
      const textBlock = textBlocks[nestedTextBlockIndex];
      if (!textBlock) return;
      
      // Get TextLines
      let textLines = textBlock.TextLine;
      if (!textLines) return;
      
      // Ensure it's an array
      if (!Array.isArray(textLines)) {
        textLines = [textLines];
      }
      
      if (textLineIndex >= textLines.length) return;
      
      const textLine = textLines[textLineIndex];
      if (!textLine) return;
      
      // Update String content
      if (textStringIndex === -1) {
        if (!textLine.String) return;
        
        if (Array.isArray(textLine.String)) {
          // Update all strings
          for (let i = 0; i < textLine.String.length; i++) {
            textLine.String[i]['@_CONTENT'] = value;
          }
        } else {
          textLine.String['@_CONTENT'] = value;
        }
      } else {
        if (!textLine.String || !Array.isArray(textLine.String)) return;
        
        if (textStringIndex >= textLine.String.length) return;
        
        textLine.String[textStringIndex]['@_CONTENT'] = value;
      }
      
      // Update the textLine in the array
      if (Array.isArray(textLines)) {
        textLines[textLineIndex] = textLine;
        textBlock.TextLine = textLines.length === 1 ? textLines[0] : textLines;
      }
      
      // Update the TextBlock in the array
      if (Array.isArray(textBlocks)) {
        textBlocks[nestedTextBlockIndex] = textBlock;
        updatedComposedBlock.TextBlock = textBlocks.length === 1 ? textBlocks[0] : textBlocks;
      }
      
      // Update the composedBlock
      updateComposedBlock(updatedComposedBlock, composedBlockIndex);
    },
    [alto, composedBlocks, updateComposedBlock]
  );

  return (
    <AltoContext.Provider
      value={{
        alto,
        setAlto,
        styles,
        setStyles,
        pageDimensions,
        printSpace,
        illustrations,
        graphicalElements,
        textBlocks,
        composedBlocks,
        altoVersion,
        setAltoVersion,
        validationStatus,
        setValidationStatus,
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
