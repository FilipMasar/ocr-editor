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
  AltoSpaceJson,
  AltoMarginJson,
  AltoHyphenJson,
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
 * Ensures an element is always treated as an array
 * Useful for handling ALTO elements that can be either single or array
 */
export const ensureArray = <T>(item: T | T[] | undefined): T[] => {
  if (!item) return [];
  return Array.isArray(item) ? item : [item];
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
 * Helper function to extract elements from page containers (PrintSpace and margins)
 * Reduces repetitive code across element extraction functions
 */
const extractElementsFromContainers = <T>(
  page: AltoPageJson,
  elementType: string,
  results: T[]
): void => {
  // Extract from PrintSpace
  const printSpace = page.PrintSpace;
  if (printSpace && (printSpace as any)[elementType]) {
    results.push(...ensureArray((printSpace as any)[elementType]));
  }
  
  // Extract from margins
  ['TopMargin', 'LeftMargin', 'RightMargin', 'BottomMargin'].forEach(margin => {
    const marginElement = page[margin as keyof typeof page];
    if (marginElement && (marginElement as any)[elementType]) {
      results.push(...ensureArray((marginElement as any)[elementType]));
    }
  });
};

/**
 * Helper function to recursively extract elements from ComposedBlocks
 */
const extractElementsFromComposedBlocks = <T>(
  blocks: AltoComposedBlockJson[],
  elementType: string,
  results: T[]
): void => {
  blocks.forEach(block => {
    // Get elements directly in this ComposedBlock
    if ((block as any)[elementType]) {
      results.push(...ensureArray((block as any)[elementType]));
    }
    
    // Recursively process nested ComposedBlocks
    if (block.ComposedBlock) {
      extractElementsFromComposedBlocks(
        ensureArray(block.ComposedBlock),
        elementType,
        results
      );
    }
  });
};

/**
 * Helper function to process ComposedBlocks in PrintSpace and margins
 */
const processComposedBlocks = <T>(
  page: AltoPageJson,
  elementType: string,
  results: T[]
): void => {
  // Get ComposedBlocks from containers
  const composedBlocks: AltoComposedBlockJson[] = [];
  
  // From PrintSpace
  if (page.PrintSpace?.ComposedBlock) {
    composedBlocks.push(...ensureArray(page.PrintSpace.ComposedBlock));
  }
  
  // From margins
  ['TopMargin', 'LeftMargin', 'RightMargin', 'BottomMargin'].forEach(margin => {
    const marginElement = page[margin as keyof typeof page];
    if (marginElement && (marginElement as any).ComposedBlock) {
      composedBlocks.push(...ensureArray((marginElement as any).ComposedBlock));
    }
  });
  
  // Extract elements from these ComposedBlocks
  extractElementsFromComposedBlocks(composedBlocks, elementType, results);
};

/**
 * Extracts all TextBlocks from the ALTO document
 * Searches in PrintSpace, all margins, and ComposedBlocks
 */
export const getAllTextBlocks = (altoJson: AltoJson): AltoTextBlockJson[] => {
  const page = getFirstPage(altoJson);
  if (!page) return [];
  
  const blocks: AltoTextBlockJson[] = [];
  
  extractElementsFromContainers(page, 'TextBlock', blocks);
  processComposedBlocks(page, 'TextBlock', blocks);
  
  return blocks;
};

/**
 * Extracts all Margins from the ALTO document
 * Searches in PrintSpace, all margins, and ComposedBlocks
 */
export const getAllMargins = (altoJson: AltoJson): AltoMarginJson[] => {
  const page = getFirstPage(altoJson);
  if (!page) return [];

  const margins = [page.TopMargin, page.LeftMargin, page.RightMargin, page.BottomMargin].filter(Boolean) as AltoMarginJson[];

  return margins;
};

/**
 * Extracts all Illustrations from the ALTO document
 * Searches in PrintSpace, all margins, and ComposedBlocks
 */
export const getAllIllustrations = (altoJson: AltoJson): AltoIllustrationJson[] => {
  const page = getFirstPage(altoJson);
  if (!page) return [];
  
  const illustrations: AltoIllustrationJson[] = [];
  
  extractElementsFromContainers(page, 'Illustration', illustrations);
  processComposedBlocks(page, 'Illustration', illustrations);
  
  return illustrations;
};

/**
 * Extracts all GraphicalElements from the ALTO document
 * Searches in PrintSpace, all margins, and ComposedBlocks
 */
export const getAllGraphicalElements = (altoJson: AltoJson): AltoGraphicalElementJson[] => {
  const page = getFirstPage(altoJson);
  if (!page) return [];
  
  const elements: AltoGraphicalElementJson[] = [];
  
  extractElementsFromContainers(page, 'GraphicalElement', elements);
  processComposedBlocks(page, 'GraphicalElement', elements);
  
  return elements;
};

/**
 * Extracts all ComposedBlocks from the ALTO document
 * Searches in PrintSpace, all margins, and includes nested ComposedBlocks
 */
export const getAllComposedBlocks = (altoJson: AltoJson): AltoComposedBlockJson[] => {
  const page = getFirstPage(altoJson);
  if (!page) return [];
  
  const blocks: AltoComposedBlockJson[] = [];
  
  extractElementsFromContainers(page, 'ComposedBlock', blocks);
  
  // Helper function to recursively find nested ComposedBlocks
  const extractNestedComposedBlocks = (parentBlocks: AltoComposedBlockJson[]): void => {
    parentBlocks.forEach(block => {
      if (block.ComposedBlock) {
        const nestedBlocks = ensureArray(block.ComposedBlock);
        blocks.push(...nestedBlocks);
        // Recursively process deeper nested blocks
        extractNestedComposedBlocks(nestedBlocks);
      }
    });
  };
  
  // Process nested ComposedBlocks
  extractNestedComposedBlocks(blocks);
  
  return blocks;
};

/**
 * Extracts all TextLines from the ALTO document
 * Works by collecting all TextBlocks and extracting TextLines from them
 */
export const getAllTextLines = (altoJson: AltoJson): AltoTextLineJson[] => {
  const textBlocks = getAllTextBlocks(altoJson);
  const textLines: AltoTextLineJson[] = [];
  
  textBlocks.forEach(block => {
    if (block.TextLine) {
      textLines.push(...ensureArray(block.TextLine));
    }
  });
  
  return textLines;
};

/**
 * Extracts all String elements (words) from the ALTO document
 * Works by collecting all TextLines and extracting Strings from them
 */
export const getAllStrings = (altoJson: AltoJson): AltoStringJson[] => {
  const textLines = getAllTextLines(altoJson);
  const strings: AltoStringJson[] = [];
  
  textLines.forEach(line => {
    if (line.String) {
      strings.push(...ensureArray(line.String));
    }
  });
  
  return strings;
};

/**
 * Extracts all Strings from a TextLine
 * Returns an array of Strings
 */
export const getStringsFromTextLine = (textLine: AltoTextLineJson): AltoStringJson[] => {
  return ensureArray(textLine.String);
};

/**
 * Extracts all Space elements from the ALTO document
 * Works by collecting all TextLines and extracting Spaces from them
 */
export const getAllSpaces = (altoJson: AltoJson): AltoSpaceJson[] => {
  const textLines = getAllTextLines(altoJson);
  const spaces: AltoSpaceJson[] = [];
  
  textLines.forEach(line => {
    if (line.SP) {
      spaces.push(...ensureArray(line.SP));
    }
  });
  
  return spaces;
};

/**
 * Extracts all HYP elements from the ALTO document
 * Searches within TextLines located in TextBlocks and ComposedBlocks
 */
export const getAllHyphens = (altoJson: AltoJson): AltoHyphenJson[] => {
  const textLines = getAllTextLines(altoJson);
  const hyphens: AltoHyphenJson[] = [];

  textLines.forEach(textLine => {
    const hyphen = textLine.HYP;
    if (hyphen) {
      // if HYP does not have width, height, or vpos, hpos, add it based on the textLine
      if (!hyphen['@_WIDTH']) {
        hyphen['@_WIDTH'] = '10';
      }
      if (!hyphen['@_HEIGHT']) {
        hyphen['@_HEIGHT'] = textLine['@_HEIGHT'];
      }
      if (!hyphen['@_VPOS']) {
        hyphen['@_VPOS'] = textLine['@_VPOS'];
      }
      if (!hyphen['@_HPOS']) {
        hyphen['@_HPOS'] = (Number(textLine['@_HPOS']) + Number(textLine['@_WIDTH']) - Number(hyphen['@_WIDTH'])).toString();
      }

      hyphens.push(hyphen);
    }
  });

  return hyphens;
};

/**
 * Extracts all text content from the ALTO document
 * Concatenates text from all Strings across all TextLines
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
 * Recursively searches through the ALTO structure and updates the element
 * with the matching targetId. Modifies the node object in place.
 *
 * @param node The current node in the ALTO structure being traversed.
 * @param targetId The @_CUSTOM_ID of the element to find and update.
 * @param newElementData The new data to replace the found element with.
 * @returns True if the element was found and updated, false otherwise.
 */
function findAndUpdateRecursive(node: any, targetId: string, newElementData: any): boolean {
  if (!node || typeof node !== 'object') {
    return false;
  }

  // Iterate over properties of the current node
  for (const key in node) {
    // Skip non-own properties and attributes
    if (!Object.prototype.hasOwnProperty.call(node, key) || key.startsWith('@_')) {
      continue;
    }

    const child = node[key];

    if (Array.isArray(child)) {
      // Handle arrays of elements
      for (let i = 0; i < child.length; i++) {
        const item = child[i];
        if (item && typeof item === 'object' && item['@_CUSTOM_ID'] === targetId) {
          // Found the element in the array, replace it
          child[i] = newElementData;
          return true; // Found and updated
        }
        // Recurse into the item if it's an object
        if (findAndUpdateRecursive(item, targetId, newElementData)) {
          return true; // Found and updated deeper
        }
      }
    } else if (child && typeof child === 'object') {
      // Handle single child objects
      if (child['@_CUSTOM_ID'] === targetId) {
        // Found the element as a direct property, replace it
        node[key] = newElementData;
        return true; // Found and updated
      }
      // Recurse into the child object
      if (findAndUpdateRecursive(child, targetId, newElementData)) {
        return true; // Found and updated deeper
      }
    }
  }

  return false; // Not found in this subtree
}

/**
 * Creates a deep copy of the ALTO JSON and updates a specific element within it.
 * The element is identified by its @_CUSTOM_ID attribute matching the provided customId.
 *
 * @param altoJson The original ALTO JSON object.
 * @param element The new element data to insert. Using 'any' type due to import issues and for flexibility.
 * @param customId The @_CUSTOM_ID of the element to be replaced.
 * @returns A new AltoJson object with the specified element updated, or the original object if the ID was not found.
 */
export const updateElementInAlto = (altoJson: AltoJson, element: any, customId: string): AltoJson => {
  // Create a deep copy to avoid modifying the original object
  const newAlto: AltoJson = JSON.parse(JSON.stringify(altoJson));

  // Start the recursive search and update process from the Layout level.
  // The findAndUpdateRecursive function modifies 'newAlto' in place.
  findAndUpdateRecursive(newAlto.alto.Layout, customId, element);

  // Return the modified deep copy
  return newAlto;
};
