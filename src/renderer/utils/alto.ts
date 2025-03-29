/* eslint-disable no-restricted-globals */
import {
  AltoJson,
  AltoTextBlockJson,
  AltoIllustrationJson,
  AltoGraphicalElementJson,
  AltoTextLineJson,
  AltoPageJson,
  AltoStringJson,
  AltoComposedBlockJson,
} from '../types/alto';

/**
 * Type for ALTO measurement units
 */
export type MeasurementUnit = 'pixel' | 'mm10' | 'inch1200';

/**
 * Gets the measurement unit from the ALTO document
 * Falls back to 'pixel' if not specified
 */
export const getMeasurementUnit = (altoJson: AltoJson): MeasurementUnit => {
  try {
    const unit = altoJson?.alto?.Description?.MeasurementUnit?.['#text'] as MeasurementUnit;
    if (unit === 'mm10' || unit === 'inch1200') {
      return unit;
    }
    return 'pixel';
  } catch (e) {
    return 'pixel';
  }
};

/**
 * Converts a value from the document's measurement unit to pixels
 * - mm10: 1/10 of a millimeter (1mm = 3.779528px, so 1mm10 = 0.3779528px)
 * - inch1200: 1/1200 of an inch (1inch = 96px, so 1inch1200 = 0.08px)
 * - pixel: no conversion needed
 */
export const convertToPixels = (value: any, unit: MeasurementUnit): number => {
  if (value === null || value === undefined) return 0;
  
  const n = Number(value);
  if (isNaN(n)) return 0;
  
  switch (unit) {
    case 'mm10':
      // 1mm = 3.779528px, so 1mm10 = 0.3779528px
      return n * 0.3779528;
    case 'inch1200':
      // 1inch = 96px, so 1inch1200 = 0.08px
      return n * 0.08;
    case 'pixel':
    default:
      return n;
  }
};

/**
 * Get text content from a TextLine element
 * Returns an array of strings or a single string
 */
export const getStringsFromLine = (textLine: AltoTextLineJson): string[] | string => {
  if (textLine?.String) {
    if (Array.isArray(textLine.String)) {
      return textLine.String.map((s) => s['@_CONTENT']);
    }
    return textLine.String['@_CONTENT'];
  }
  return '';
};

/**
 * This is a helper for UI rendering and processing
 */
export const addMetadata = <T extends Record<string, any>, M extends Record<string, any>>(
  element: T | T[],
  parentStyleRefs?: string,
  otherMetadata?: M
): Array<{
  element: T;
  metadata: M & {
    index: number;
    '@_STYLEREFS': string | undefined;
  };
}> => {
  if (Array.isArray(element)) {
    return element.map((e, i) => ({
      element: e,
      metadata: {
        ...otherMetadata,
        index: i,
        '@_STYLEREFS': e['@_STYLEREFS'] || parentStyleRefs,
      } as M & {
        index: number;
        '@_STYLEREFS': string | undefined;
      },
    }));
  }
  return [
    {
      element,
      metadata: {
        ...otherMetadata,
        index: -1,
        '@_STYLEREFS': element['@_STYLEREFS'] || parentStyleRefs,
      } as M & {
        index: number;
        '@_STYLEREFS': string | undefined;
      },
    },
  ];
};

/**
 * Ensures an element is always treated as an array
 * Useful for handling ALTO elements that can be either single or array
 */
export const ensureArray = <T>(item: T | T[] | undefined): T[] => {
  if (!item) return [];
  return Array.isArray(item) ? item : [item];
};

/**
 * Gets the ALTO schema version from the document
 * Returns undefined if not found
 */
export const getAltoVersion = (altoJson: AltoJson): string | undefined => {
  return altoJson?.alto?.['@_SCHEMAVERSION'];
};

/**
 * Checks if the ALTO document is compatible with version 3.x
 */
export const isAltoV3Compatible = (altoJson: AltoJson): boolean => {
  const version = getAltoVersion(altoJson);
  return version ? version.startsWith('3.') : false;
};

/**
 * Helper function to get the first page from the ALTO document
 * Most ALTO files only have one page, but this handles multi-page cases
 */
export const getFirstPage = (altoJson: AltoJson): AltoPageJson | undefined => {
  if (!altoJson?.alto?.Layout?.Page) return undefined;
  
  const page = altoJson.alto.Layout.Page;
  return Array.isArray(page) ? page[0] : page;
};

/**
 * Extracts all TextBlocks from the ALTO document
 * Searches in PrintSpace and all margins
 */
export const getAllTextBlocks = (altoJson: AltoJson): AltoTextBlockJson[] => {
  const page = getFirstPage(altoJson);
  if (!page) return [];
  
  const blocks: AltoTextBlockJson[] = [];
  
  // Get blocks from PrintSpace
  if (page.PrintSpace?.TextBlock) {
    blocks.push(...ensureArray(page.PrintSpace.TextBlock));
  }
  
  // Get blocks from margins
  ['TopMargin', 'LeftMargin', 'RightMargin', 'BottomMargin'].forEach(margin => {
    const marginElement = page[margin as keyof typeof page];
    if (marginElement && (marginElement as any).TextBlock) {
      blocks.push(...ensureArray((marginElement as any).TextBlock));
    }
  });
  
  return blocks;
};

/**
 * Extracts all Illustrations from the ALTO document
 * Searches in PrintSpace and all margins
 */
export const getAllIllustrations = (altoJson: AltoJson): AltoIllustrationJson[] => {
  const page = getFirstPage(altoJson);
  if (!page) return [];
  
  const illustrations: AltoIllustrationJson[] = [];
  
  // Get illustrations from PrintSpace
  if (page.PrintSpace?.Illustration) {
    illustrations.push(...ensureArray(page.PrintSpace.Illustration));
  }
  
  // Get illustrations from margins
  ['TopMargin', 'LeftMargin', 'RightMargin', 'BottomMargin'].forEach(margin => {
    const marginElement = page[margin as keyof typeof page];
    if (marginElement && (marginElement as any).Illustration) {
      illustrations.push(...ensureArray((marginElement as any).Illustration));
    }
  });
  
  return illustrations;
};

/**
 * Extracts all GraphicalElements from the ALTO document
 * Searches in PrintSpace and all margins
 */
export const getAllGraphicalElements = (altoJson: AltoJson): AltoGraphicalElementJson[] => {
  const page = getFirstPage(altoJson);
  if (!page) return [];
  
  const elements: AltoGraphicalElementJson[] = [];
  
  // Get elements from PrintSpace
  if (page.PrintSpace?.GraphicalElement) {
    elements.push(...ensureArray(page.PrintSpace.GraphicalElement));
  }
  
  // Get elements from margins
  ['TopMargin', 'LeftMargin', 'RightMargin', 'BottomMargin'].forEach(margin => {
    const marginElement = page[margin as keyof typeof page];
    if (marginElement && (marginElement as any).GraphicalElement) {
      elements.push(...ensureArray((marginElement as any).GraphicalElement));
    }
  });
  
  return elements;
};

/**
 * Extracts all ComposedBlocks from the ALTO document
 * Searches in PrintSpace and all margins
 */
export const getAllComposedBlocks = (altoJson: AltoJson): AltoComposedBlockJson[] => {
  const page = getFirstPage(altoJson);
  if (!page) return [];
  
  const blocks: AltoComposedBlockJson[] = [];
  
  // Get blocks from PrintSpace
  if (page.PrintSpace?.ComposedBlock) {
    blocks.push(...ensureArray(page.PrintSpace.ComposedBlock));
  }
  
  // Get blocks from margins
  ['TopMargin', 'LeftMargin', 'RightMargin', 'BottomMargin'].forEach(margin => {
    const marginElement = page[margin as keyof typeof page];
    if (marginElement && (marginElement as any).ComposedBlock) {
      blocks.push(...ensureArray((marginElement as any).ComposedBlock));
    }
  });
  
  return blocks;
};

/**
 * Helper function to get all text content from the ALTO document
 * Useful for text extraction and validation
 */
export const getAllText = (altoJson: AltoJson): string => {
  const textBlocks = getAllTextBlocks(altoJson);
  
  return textBlocks
    .map((textBlock) => {
      if (!textBlock.TextLine) return '';
      
      const textLines = ensureArray(textBlock.TextLine);
      
      return textLines
        .map((textLine) => {
          if (!textLine.String) return '';
          
          const strings = ensureArray(textLine.String);
          return strings.map((s) => s['@_CONTENT']).join(' ');
        })
        .join(' ');
    })
    .join(' ');
};

/**
 * Updates a TextBlock in the ALTO JSON structure
 * Returns a new ALTO JSON with the updated TextBlock
 */
export const updateTextBlockInAlto = (
  altoJson: AltoJson,
  textBlock: AltoTextBlockJson,
  index: number,
  containerPath: string[] = ['alto', 'Layout', 'Page', 'PrintSpace']
): AltoJson => {
  // Create a deep copy of the ALTO JSON
  const newAlto = JSON.parse(JSON.stringify(altoJson));
  
  // Navigate to the container element
  let container = newAlto;
  for (const part of containerPath) {
    container = container[part];
    if (!container) return altoJson; // Return original if path isn't valid
  }
  
  // Update the TextBlock
  if (index === -1) {
    container.TextBlock = textBlock;
  } else {
    if (!Array.isArray(container.TextBlock)) {
      if (index === 0) {
        container.TextBlock = textBlock;
      }
    } else {
      if (index >= 0 && index < container.TextBlock.length) {
        container.TextBlock[index] = textBlock;
      }
    }
  }
  
  return newAlto;
};
