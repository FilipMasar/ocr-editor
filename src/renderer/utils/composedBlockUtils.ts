import { 
  AltoComposedBlockJson, 
  AltoJson, 
  AltoTextBlockJson,
  AltoIllustrationJson,
  AltoGraphicalElementJson
} from '../types/alto';
import { addMetadata, ensureArray, getFirstPage } from './alto';

/**
 * Extracts all ComposedBlocks from the ALTO document
 * Searches in PrintSpace and all margins
 * This is a duplicate of the function in alto.ts for now, but specific to ComposedBlocks
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
 * Get all nested TextBlocks from a ComposedBlock
 * This recursively traverses the ComposedBlock structure
 */
export const getTextBlocksFromComposedBlock = (
  composedBlock: AltoComposedBlockJson
): AltoTextBlockJson[] => {
  const textBlocks: AltoTextBlockJson[] = [];
  
  // Get direct TextBlocks
  if (composedBlock.TextBlock) {
    textBlocks.push(...ensureArray(composedBlock.TextBlock));
  }
  
  // Get TextBlocks from nested ComposedBlocks
  if (composedBlock.ComposedBlock) {
    const nestedBlocks = ensureArray(composedBlock.ComposedBlock);
    for (const block of nestedBlocks) {
      textBlocks.push(...getTextBlocksFromComposedBlock(block));
    }
  }
  
  return textBlocks;
};

/**
 * Get all nested Illustrations from a ComposedBlock
 * This recursively traverses the ComposedBlock structure
 */
export const getIllustrationsFromComposedBlock = (
  composedBlock: AltoComposedBlockJson
): AltoIllustrationJson[] => {
  const illustrations: AltoIllustrationJson[] = [];
  
  // Get direct Illustrations
  if (composedBlock.Illustration) {
    illustrations.push(...ensureArray(composedBlock.Illustration));
  }
  
  // Get Illustrations from nested ComposedBlocks
  if (composedBlock.ComposedBlock) {
    const nestedBlocks = ensureArray(composedBlock.ComposedBlock);
    for (const block of nestedBlocks) {
      illustrations.push(...getIllustrationsFromComposedBlock(block));
    }
  }
  
  return illustrations;
};

/**
 * Get all nested GraphicalElements from a ComposedBlock
 * This recursively traverses the ComposedBlock structure
 */
export const getGraphicalElementsFromComposedBlock = (
  composedBlock: AltoComposedBlockJson
): AltoGraphicalElementJson[] => {
  const elements: AltoGraphicalElementJson[] = [];
  
  // Get direct GraphicalElements
  if (composedBlock.GraphicalElement) {
    elements.push(...ensureArray(composedBlock.GraphicalElement));
  }
  
  // Get GraphicalElements from nested ComposedBlocks
  if (composedBlock.ComposedBlock) {
    const nestedBlocks = ensureArray(composedBlock.ComposedBlock);
    for (const block of nestedBlocks) {
      elements.push(...getGraphicalElementsFromComposedBlock(block));
    }
  }
  
  return elements;
};

/**
 * Get all text content from a ComposedBlock
 * Useful for displaying or searching
 */
export const getTextFromComposedBlock = (composedBlock: AltoComposedBlockJson): string => {
  const textBlocks = getTextBlocksFromComposedBlock(composedBlock);
  
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
 * Get all ComposedBlocks with their metadata
 * This prepares them for UI rendering
 */
export const getComposedBlocksWithMetadata = (altoJson: AltoJson) => {
  const composedBlocks = getAllComposedBlocks(altoJson);
  
  return composedBlocks.map((block, index) => ({
    composedBlock: block,
    metadata: {
      index,
      type: block['@_TYPE'] || 'unknown',
      id: block['@_ID'] || `composed-block-${index}`,
      textContent: getTextFromComposedBlock(block),
      nestedElements: {
        textBlocks: getTextBlocksFromComposedBlock(block).length,
        illustrations: getIllustrationsFromComposedBlock(block).length,
        graphicalElements: getGraphicalElementsFromComposedBlock(block).length,
        composedBlocks: ensureArray(block.ComposedBlock || []).length
      }
    }
  }));
};

/**
 * Updates a ComposedBlock in the ALTO JSON structure
 * Returns a new ALTO JSON with the updated ComposedBlock
 */
export const updateComposedBlockInAlto = (
  altoJson: AltoJson,
  composedBlock: AltoComposedBlockJson,
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
  
  // Update the ComposedBlock
  if (!container.ComposedBlock) {
    container.ComposedBlock = [composedBlock];
  } else if (index === -1) {
    container.ComposedBlock = composedBlock;
  } else {
    if (!Array.isArray(container.ComposedBlock)) {
      if (index === 0) {
        container.ComposedBlock = composedBlock;
      } else {
        // Convert to array and add
        container.ComposedBlock = [container.ComposedBlock, composedBlock];
      }
    } else {
      if (index >= 0 && index < container.ComposedBlock.length) {
        container.ComposedBlock[index] = composedBlock;
      } else if (index === container.ComposedBlock.length) {
        // Add at the end
        container.ComposedBlock.push(composedBlock);
      }
    }
  }
  
  return newAlto;
}; 